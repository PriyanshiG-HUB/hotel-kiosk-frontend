import axios from "axios";
import { Platform } from "react-native";

const defaultBaseURL = Platform.OS === "web" ? "http://localhost:5000/api" : "http://10.0.2.2:5000/api";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || defaultBaseURL,
});