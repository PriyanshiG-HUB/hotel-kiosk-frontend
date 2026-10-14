import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTranslation from '../hooks/useTranslation';

export interface CapturedDocument {
  uri: string;
  blob?: Blob;
  name: string;
  type: string;
  side: 'front' | 'back';
}

interface IDCameraCaptureProps {
  documentType: string;
  side: 'front' | 'back';
  capturedDoc: CapturedDocument | null;
  onCapture: (doc: CapturedDocument) => void;
  onRetake: () => void;
  disabled?: boolean;
}

export default function IDCameraCapture({
  documentType,
  side,
  capturedDoc,
  onCapture,
  onRetake,
  disabled,
}: IDCameraCaptureProps) {
  const { t } = useTranslation();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera media stream
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  // Web Camera start
  const startWebCamera = async () => {
    if (Platform.OS !== 'web') return;
    setCameraError(null);
    setIsInitializing(true);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setIsInitializing(false);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.warn('Video play error:', e));
        }
      }, 100);
    } catch (err: any) {
      setIsInitializing(false);
      setIsCameraActive(false);
      setCameraError(err.message || 'Unable to access camera. Please check permissions or use file upload.');
    }
  };

  // Web Camera capture frame
  const captureWebFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          stopMediaStream();
          onCapture({
            uri: dataUrl,
            blob,
            name: `${side}-id-${Date.now()}.jpg`,
            type: 'image/jpeg',
            side,
          });
        }
      },
      'image/jpeg',
      0.95
    );
  };

  // HTML File Input selection (fallback for web and mobile browsers)
  const handleFileInputChange = (event: any) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onCapture({
        uri: dataUrl,
        blob: file,
        name: file.name || `${side}-id.jpg`,
        type: file.type || 'image/jpeg',
        side,
      });
    };
    reader.readAsDataURL(file);
  };

  const sideLabel = side === 'front' ? t('frontSide') || 'Front Side' : t('backSide') || 'Back Side';

  // 1. Preview Mode: when an image has been captured
  if (capturedDoc) {
    return (
      <View style={styles.previewContainer}>
        <View style={styles.previewCard}>
          <Image source={{ uri: capturedDoc.uri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#35C759" />
            <Text style={styles.previewBadgeText}>{sideLabel} Captured</Text>
          </View>
        </View>

        <View style={styles.previewControls}>
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => {
              onRetake();
              stopMediaStream();
            }}
            disabled={disabled}
          >
            <Ionicons name="refresh" size={18} color="#1A1A4E" />
            <Text style={styles.retakeBtnText}>{t('retakePhoto') || 'Retake'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. Active Web Camera Viewfinder Mode
  if (isCameraActive && Platform.OS === 'web') {
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.videoWrapper}>
          {/* React Native Web embedding HTML5 video */}
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <video
              ref={videoRef as any}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '14px',
              }}
            />
            {/* Viewfinder Bounding Box Guide */}
            <div
              style={{
                position: 'absolute',
                top: '12%',
                left: '8%',
                right: '8%',
                bottom: '12%',
                border: '2px dashed #35C759',
                borderRadius: '12px',
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
              }}
            />
          </div>
        </View>

        <Text style={styles.alignGuideText}>
          {t('alignDocumentInFrame') || 'Align document inside the green guide box'}
        </Text>

        <View style={styles.cameraActionBar}>
          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => {
              stopMediaStream();
              setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
              setTimeout(startWebCamera, 200);
            }}
          >
            <Ionicons name="camera-reverse" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureShutterBtn} onPress={captureWebFrame}>
            <View style={styles.innerShutterCircle} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSecondary} onPress={stopMediaStream}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Initial Capture Prompt (Camera Button & File Upload Fallback)
  return (
    <View style={styles.promptContainer}>
      {isInitializing ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1A1A4E" />
          <Text style={styles.loadingText}>{t('initializingCamera') || 'Initializing Camera...'}</Text>
        </View>
      ) : (
        <>
          <View style={styles.iconCircle}>
            <Ionicons name={side === 'front' ? 'scan-outline' : 'card-outline'} size={48} color="#1A1A4E" />
          </View>

          <Text style={styles.promptTitle}>
            {t('captureDocumentPrompt') || `Capture ${documentType} (${sideLabel})`}
          </Text>
          <Text style={styles.promptSubtitle}>
            {t('ensureClearLighting') || 'Ensure all four corners are visible without glare or blur'}
          </Text>

          {cameraError && (
            <View style={styles.errorNotice}>
              <Ionicons name="alert-circle" size={16} color="#D32F2F" />
              <Text style={styles.errorText}>{cameraError}</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={[styles.primaryCaptureBtn, disabled && { opacity: 0.5 }]}
                onPress={startWebCamera}
                disabled={disabled}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.primaryCaptureText}>{t('openCamera') || 'Use Camera'}</Text>
              </TouchableOpacity>
            )}

            {/* Cross-platform File Upload Fallback */}
            {Platform.OS === 'web' ? (
              <>
                <input
                  ref={fileInputRef as any}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
                <TouchableOpacity
                  style={[styles.secondaryUploadBtn, disabled && { opacity: 0.5 }]}
                  onPress={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  <Ionicons name="cloud-upload" size={20} color="#1A1A4E" />
                  <Text style={styles.secondaryUploadText}>{t('uploadImage') || 'Upload File'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.primaryCaptureBtn, disabled && { opacity: 0.5 }]}
                onPress={() => {
                  // Fallback simulation/prompt on native when standalone
                  alert('Please select an ID file or connect device camera');
                }}
                disabled={disabled}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.primaryCaptureText}>{t('captureDocument') || 'Capture Document'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  promptContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E4F0',
    minHeight: 260,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF0FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A4E',
    marginBottom: 6,
    textAlign: 'center',
  },
  promptSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryCaptureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A4E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  primaryCaptureText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1A1A4E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  secondaryUploadText: {
    color: '#1A1A4E',
    fontWeight: '700',
    fontSize: 14,
  },
  cameraContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    paddingBottom: 16,
  },
  videoWrapper: {
    width: '100%',
    height: 280,
    backgroundColor: '#000',
  },
  alignGuideText: {
    color: '#35C759',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
  },
  cameraActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  actionBtnSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureShutterBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerShutterCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1A1A4E',
  },
  previewContainer: {
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E4F0',
    padding: 16,
    alignItems: 'center',
  },
  previewCard: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F0F0F8',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  previewBadgeText: {
    color: '#1A1A4E',
    fontWeight: '700',
    fontSize: 12,
  },
  previewControls: {
    flexDirection: 'row',
    marginTop: 14,
    width: '100%',
    justifyContent: 'center',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A1A4E',
    gap: 6,
  },
  retakeBtnText: {
    color: '#1A1A4E',
    fontWeight: '600',
    fontSize: 13,
  },
  errorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    flex: 1,
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#1A1A4E',
    fontWeight: '600',
    fontSize: 14,
  },
});
