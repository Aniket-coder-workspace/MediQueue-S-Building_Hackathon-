import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { User as UserIcon, Mail, Phone, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Patient } from '../types'; // Assuming Patient type exists

const PatientProfile: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // Include auth loading state
  const { patients, loading: queueLoading, error: queueError } = useQueue();
  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    if (user?.patientId && patients.length > 0) {
      const patient = patients.find((p) => p.id === user.patientId);
      setPatientData(patient || null);
    }
  }, [user, patients]);

  // Combine loading states from auth and queue
  const isLoading = authLoading || queueLoading;

  // Use queue error if present
  const displayError = queueError;

  if (!user) {
    return <div className="p-4 text-red-500">Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {displayError}</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <UserIcon size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">Patient ID: {user.patientId || 'Not available'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                Email: {user.email || 'Not provided'}
              </p>
              <p className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                Phone: {user.phone || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Queue Info (if available) */}
          {patientData ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Queue Status</h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  Status:
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      patientData.status === 'waiting'
                        ? 'bg-yellow-100 text-yellow-800'
                        : patientData.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : patientData.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : patientData.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {patientData.status.replace('-', ' ')}
                  </span>
                </p>
                {patientData.status === 'waiting' && (
                  <>
                    <p className="text-gray-600">Queue Position: {patientData.queuePosition ?? 'N/A'}</p>
                    <p className="text-gray-600">
                      Estimated Wait: {patientData.estimatedWaitTime ?? 'N/A'} minutes
                    </p>
                  </>
                )}
                <p className="text-gray-600">Department: {patientData.department || 'Not assigned'}</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Queue Status</h3>
              <p className="text-gray-600">No active queue information available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;