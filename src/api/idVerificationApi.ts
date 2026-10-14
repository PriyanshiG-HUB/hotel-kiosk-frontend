import { api } from './api';

export interface CreateSessionParams {
  bookingId?: string;
  guestId?: string;
  guestName?: string;
  /** Document number entered by guest in earlier form step (e.g. Aadhaar number) */
  enteredDocumentNumber?: string;
  selectedIdType: string;
  issuingCountry: string;
  consentGiven: boolean;
}

export interface VerificationSessionResponse {
  sessionId: string;
  bookingId?: string;
  guestId?: string;
  expectedGuestName?: string;
  selectedIdType: string;
  issuingCountry: string;
  status: string;
  frontDocumentUploaded: boolean;
  backDocumentUploaded?: boolean;
  extractedFields?: {
    fullName: string;
    documentType: string;
    issuingCountry: string;
    documentNumberMasked: string;
    dateOfBirth?: string;
    expirationDate?: string;
    gender?: string;
    confidence: number;
    isExpired: boolean;
    /** Aadhaar-specific: comparison of OCR number vs form-entered number */
    aadhaarNumberMatch?: 'match' | 'mismatch' | 'unable_to_verify';
  };
  correctedFields?: any;
  authenticity?: {
    method: string;
    status: 'verified' | 'failed' | 'pending_manual_review' | 'unavailable';
    isAuthentic: boolean;
    requiresManualReview: boolean;
    details: string;
    signatureVerified?: boolean;
    checksumMatches?: boolean;
    verifiedAt?: string;
    providerName?: string;
  };
  overallOutcome: 'proceed' | 'staff_review_required' | 'rejected' | 'in_progress';
  createdAt: string;
  expiresAt: string;
}

/**
 * 1. Create a verification attempt linked to booking or guest
 */
export const createVerificationSession = async (
  params: CreateSessionParams
): Promise<VerificationSessionResponse> => {
  const response = await api.post('/id-verification/sessions', params);
  return response.data;
};

/**
 * 2. Securely submit document image files
 */
export const uploadIdDocument = async (
  sessionId: string,
  frontFile: { uri: string; name: string; type: string } | Blob,
  backFile?: { uri: string; name: string; type: string } | Blob
): Promise<VerificationSessionResponse> => {
  const formData = new FormData();

  if (frontFile instanceof Blob) {
    formData.append('front', frontFile, 'front.jpg');
  } else {
    formData.append('front', {
      uri: frontFile.uri,
      name: frontFile.name || 'front.jpg',
      type: frontFile.type || 'image/jpeg',
    } as any);
  }

  if (backFile) {
    if (backFile instanceof Blob) {
      formData.append('back', backFile, 'back.jpg');
    } else {
      formData.append('back', {
        uri: backFile.uri,
        name: backFile.name || 'back.jpg',
        type: backFile.type || 'image/jpeg',
      } as any);
    }
  }

  const response = await api.post(`/id-verification/${sessionId}/document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 3. Process OCR and authenticity verification
 */
export const processIdVerification = async (
  sessionId: string
): Promise<VerificationSessionResponse> => {
  const response = await api.post(`/id-verification/${sessionId}/process`);
  return response.data;
};

/**
 * 4. Retrieve current verification status
 */
export const getVerificationSession = async (
  sessionId: string
): Promise<VerificationSessionResponse> => {
  const response = await api.get(`/id-verification/${sessionId}`);
  return response.data;
};

/**
 * 5. Correct extracted fields
 */
export const correctExtractedFields = async (
  sessionId: string,
  fields: { fullName?: string; documentNumberMasked?: string; dateOfBirth?: string; expirationDate?: string }
): Promise<VerificationSessionResponse> => {
  const response = await api.post(`/id-verification/${sessionId}/correct`, fields);
  return response.data;
};

/**
 * 6. Concurrency-safe atomic check-in completion
 */
export const completeCheckIn = async (
  sessionId: string,
  bookingId: string,
  paymentMethod?: string,
  paymentAmount?: number
) => {
  const response = await api.post('/check-in/complete', {
    sessionId,
    bookingId,
    paymentMethod,
    paymentAmount,
  });
  return response.data;
};

/**
 * 7. Authorized staff manual review approval/rejection
 */
export const staffReviewVerification = async (
  sessionId: string,
  review: {
    staffId: string;
    staffPin: string;
    decision: 'approved' | 'rejected';
    notes?: string;
    staffName?: string;
  }
): Promise<VerificationSessionResponse> => {
  const response = await api.post(`/id-verification/${sessionId}/staff-review`, review);
  return response.data;
};

/**
 * 8. Cancel session and purge temporary data
 */
export const cancelVerificationSession = async (sessionId: string): Promise<boolean> => {
  const response = await api.post(`/id-verification/${sessionId}/cancel`);
  return response.data?.success ?? true;
};

