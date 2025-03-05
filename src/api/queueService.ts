import { 
  fetchPatients, 
  fetchDepartments, 
  fetchQueueAnalytics, 
  fetchPredictionData,
  updatePatientStatus,
  addNewPatient,
  authenticateUser,
  getPatientById
} from '../data/mockData';
import { Patient, Department, QueueAnalytics, PredictionData, User } from '../types';

// In a real application, these would be actual API calls to a backend service
export const QueueService = {
  getPatients: (): Promise<Patient[]> => {
    return fetchPatients();
  },
  
  getDepartments: (): Promise<Department[]> => {
    return fetchDepartments();
  },
  
  getQueueAnalytics: (): Promise<QueueAnalytics[]> => {
    return fetchQueueAnalytics();
  },
  
  getPredictionData: (): Promise<PredictionData[]> => {
    return fetchPredictionData();
  },
  
  updatePatientStatus: (patientId: string, status: Patient['status']): Promise<Patient> => {
    return updatePatientStatus(patientId, status);
  },
  
  addPatient: (name: string, department: string, priority: Patient['priority']): Promise<Patient> => {
    return addNewPatient(name, department, priority);
  },
  
  // This would connect to an AI model API in a real application
  getPredictedWaitTime: (departmentId: string, priority: Patient['priority']): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate AI prediction based on department and priority
        const baseTime = Math.floor(Math.random() * 30) + 15;
        let multiplier = 1;
        
        switch(priority) {
          case 'low':
            multiplier = 1.5;
            break;
          case 'medium':
            multiplier = 1;
            break;
          case 'high':
            multiplier = 0.7;
            break;
          case 'emergency':
            multiplier = 0.3;
            break;
        }
        
        resolve(Math.round(baseTime * multiplier));
      }, 300);
    });
  },

  // Authentication service
  login: (username: string, password: string): Promise<User | null> => {
    return authenticateUser(username, password);
  },

  // Get patient by ID
  getPatientById: (patientId: string): Promise<Patient | null> => {
    return getPatientById(patientId);
  }
};