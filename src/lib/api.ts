// This is a mock API layer. In a real application, these functions would
// make network requests to a backend service.
import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Prescription {
  id: string;
  name: string;
  date: string;
  safetyScore: number;
  issues: string[];
  provider?: string;
  userId?: string;
  uploadTimestamp?: Timestamp;
  prescriptionText?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Expired';
}

export interface Analytics {
  totalVerified: number;
  activeMedications: number;
  upcomingAlerts: number;
  averageSafetyScore: number;
}
