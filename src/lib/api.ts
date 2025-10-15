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

const MOCK_DELAY = 500;

// --- Mock Data ---

const MOCK_USER: User = {
  id: 'user123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
};

const MOCK_PRESCRIPTIONS: Prescription[] = [
    { id: 'p1', name: 'Lisinopril 10mg', date: '2024-07-15', safetyScore: 95, issues: [], provider: 'Dr. Emily Carter' },
    { id: 'p2', name: 'Metformin 500mg', date: '2024-07-10', safetyScore: 75, issues: ['Potential interaction with Alcohol.'], provider: 'Dr. Benjamin Lee' },
    { id: 'p3', name: 'Simvastatin 20mg', date: '2024-06-28', safetyScore: 45, issues: ['High dosage warning.', 'Avoid grapefruit juice.'], provider: 'Dr. Sarah T. Hall' },
    { id: 'p4', name: 'Amoxicillin 250mg', date: '2024-06-20', safetyScore: 90, issues: [], provider: 'QuickCare Clinic' },
];

const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'i1', name: 'Lisinopril 10mg', stock: 30, expiryDate: '2025-06-30', status: 'In Stock' },
    { id: 'i2', name: 'Metformin 500mg', stock: 2, expiryDate: '2024-12-31', status: 'Low Stock' },
    { id: 'i3', name: 'Simvastatin 20mg', stock: 60, expiryDate: '2024-08-15', status: 'In Stock' },
    { id: 'i4', name: 'Expired Ibuprofen', stock: 10, expiryDate: '2024-01-01', status: 'Expired' },
];

const MOCK_ANALYTICS: Analytics = {
    totalVerified: 12,
    activeMedications: 3,
    upcomingAlerts: 1,
    averageSafetyScore: 76,
}


// --- API Functions ---

export const api = {
  login: (email: string, password?: string): Promise<{ token: string; user: User }> => {
    console.log(`Attempting login for ${email}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({ token: 'dummy-jwt-token', user: MOCK_USER });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, MOCK_DELAY);
    });
  },

  register: (name: string, email: string, password?: string): Promise<{ token: string; user: User }> => {
    console.log(`Attempting registration for ${email}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          resolve({ token: 'dummy-jwt-token', user: { ...MOCK_USER, name, email } });
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, MOCK_DELAY);
    });
  },

  getPrescriptions: (userId: string): Promise<Prescription[]> => {
    console.log(`Fetching prescriptions for user ${userId}`);
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_PRESCRIPTIONS), MOCK_DELAY);
    });
  },

  getInventory: (userId: string): Promise<InventoryItem[]> => {
    console.log(`Fetching inventory for user ${userId}`);
     return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_INVENTORY), MOCK_DELAY);
    });
  },

  getAnalytics: (userId: string): Promise<Analytics> => {
     console.log(`Fetching analytics for user ${userId}`);
     return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_ANALYTICS), MOCK_DELAY);
    });
  }
};
