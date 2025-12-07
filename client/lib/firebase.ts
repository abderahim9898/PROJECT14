import { initializeApp } from "firebase/app";
import { apiUrl } from "./api-config";

const firebaseConfig = {
  apiKey: "AIzaSyCKZpHRAm1W6lQddnArZo6Onxiwfngty6Y",
  authDomain: "secteur-1.firebaseapp.com",
  projectId: "secteur-1",
  storageBucket: "secteur-1.firebasestorage.app",
  messagingSenderId: "568304445766",
  appId: "1:568304445766:web:274405f81b2f432b80dd47",
};

const app = initializeApp(firebaseConfig);
// Firestore disabled - this app uses Google Sheets API via backend instead
export const db = null;

export interface Worker {
  id: string;
  nom: string;
  cin: string;
  age: number;
  dateEntree: string;
  dateSortie: string;
  statut: "actif" | "inactif";
  fermeId: string;
  secteur: string;
  chambre: string;
  sexe: string;
  telephone: string;
  matricule: string;
  dateNaissance: string;
  motif: string;
  supervisorId: string;
  returnCount: number;
  totalWorkDays: number;
  allocatedItems?: Record<string, boolean>;
  workHistory?: WorkHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkHistoryItem {
  id: string;
  fermeId: string;
  dateEntree: string;
  chambre: string;
  secteur: string;
}

export interface Farm {
  id: string;
  nom: string;
  totalOuvriers: number;
  totalChambres: number;
  admins: string[];
  createdAt: Date;
  updatedAt: Date;
}

// All data functions return empty arrays - data comes from Google Sheets API via backend
export async function getWorkers(): Promise<Worker[]> {
  return [];
}

export async function getActiveWorkers(): Promise<Worker[]> {
  return [];
}

export async function getWorkersEntering(): Promise<Worker[]> {
  return [];
}

export async function getWorkersLeaving(): Promise<Worker[]> {
  return [];
}

export async function getFarms(): Promise<Farm[]> {
  return [];
}

export async function getWorkersByFarm(): Promise<Worker[]> {
  return [];
}

export async function getSupervisorById(): Promise<{ id: string; nom: string } | null> {
  return null;
}

export async function getAllSupervisors(): Promise<Array<{ id: string; nom: string }>> {
  return [];
}

export async function getDashboardSummary() {
  try {
    const response = await fetch(apiUrl("/api/workforce"));
    if (!response.ok) {
      console.error("Failed to fetch workforce data");
      return {
        totalWorkers: 0,
        totalFarms: 0,
        workersEntering: 0,
        workersLeaving: 0,
        farms: [],
        workers: [],
      };
    }

    const data = await response.json();

    // Transform the API response to match the expected summary format
    if (Array.isArray(data)) {
      const uniqueFarms = new Set(data.map((w: any) => w.fermeId || w.farm).filter(Boolean));

      return {
        totalWorkers: data.length,
        totalFarms: uniqueFarms.size,
        workersEntering: 0, // Can be calculated from dates if needed
        workersLeaving: 0,   // Can be calculated from dates if needed
        farms: Array.from(uniqueFarms).map(farmId => ({
          id: farmId as string,
          nom: farmId as string,
          totalOuvriers: data.filter((w: any) => (w.fermeId || w.farm) === farmId).length,
          totalChambres: 0,
          admins: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        workers: data,
      };
    }

    return {
      totalWorkers: 0,
      totalFarms: 0,
      workersEntering: 0,
      workersLeaving: 0,
      farms: [],
      workers: [],
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {
      totalWorkers: 0,
      totalFarms: 0,
      workersEntering: 0,
      workersLeaving: 0,
      farms: [],
      workers: [],
    };
  }
}
