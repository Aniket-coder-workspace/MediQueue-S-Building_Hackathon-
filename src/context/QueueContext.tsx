import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Department, QueueAnalytics, PredictionData } from '../types';
import { QueueService } from '../api/queueService';

interface QueueContextType {
  patients: Patient[];
  departments: Department[];
  analytics: QueueAnalytics[];
  predictions: PredictionData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updatePatientStatus: (patientId: string, status: Patient['status']) => Promise<void>;
  addPatient: (name: string, department: string, priority: Patient['priority']) => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [analytics, setAnalytics] = useState<QueueAnalytics[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsData, departmentsData, analyticsData, predictionsData] = await Promise.all([
        QueueService.getPatients(),
        QueueService.getDepartments(),
        QueueService.getQueueAnalytics(),
        QueueService.getPredictionData()
      ]);
      
      setPatients(patientsData);
      setDepartments(departmentsData);
      setAnalytics(analyticsData);
      setPredictions(predictionsData);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = async () => {
    await fetchAllData();
  };

  const updatePatientStatus = async (patientId: string, status: Patient['status']) => {
    try {
      await QueueService.updatePatientStatus(patientId, status);
      // Refresh data to get updated queue positions
      await refreshData();
    } catch (err) {
      setError('Failed to update patient status. Please try again.');
      console.error('Error updating patient status:', err);
    }
  };

  const addPatient = async (name: string, department: string, priority: Patient['priority']) => {
    try {
      await QueueService.addPatient(name, department, priority);
      // Refresh data to include the new patient
      await refreshData();
    } catch (err) {
      setError('Failed to add new patient. Please try again.');
      console.error('Error adding patient:', err);
    }
  };

  const value = {
    patients,
    departments,
    analytics,
    predictions,
    loading,
    error,
    refreshData,
    updatePatientStatus,
    addPatient
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};