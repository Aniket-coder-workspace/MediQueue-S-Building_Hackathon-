import { Patient, Department, QueueAnalytics, PredictionData, User } from '../types';
import { addMinutes, format, subDays } from 'date-fns';

// Generate a random wait time between min and max minutes
const randomWaitTime = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1) + min);

// Generate current date/time
const now = new Date();

// Mock Patients Data
export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'John Smith',
    status: 'waiting',
    priority: 'medium',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 25,
    department: 'Emergency',
    queuePosition: 3
  },
  {
    id: 'p2',
    name: 'Sarah Johnson',
    status: 'in-progress',
    priority: 'high',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 0,
    department: 'Emergency',
    queuePosition: 0
  },
  {
    id: 'p3',
    name: 'Michael Brown',
    status: 'waiting',
    priority: 'low',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 40,
    department: 'Radiology',
    queuePosition: 2
  },
  {
    id: 'p4',
    name: 'Emily Davis',
    status: 'waiting',
    priority: 'medium',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 15,
    department: 'Cardiology',
    queuePosition: 1
  },
  {
    id: 'p5',
    name: 'Robert Wilson',
    status: 'completed',
    priority: 'medium',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 0,
    department: 'Orthopedics',
    queuePosition: 0
  },
  {
    id: 'p6',
    name: 'Jennifer Lee',
    status: 'waiting',
    priority: 'emergency',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 5,
    department: 'Emergency',
    queuePosition: 1
  },
  {
    id: 'p7',
    name: 'David Miller',
    status: 'waiting',
    priority: 'low',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 55,
    department: 'General Practice',
    queuePosition: 4
  },
  {
    id: 'p8',
    name: 'Lisa Anderson',
    status: 'cancelled',
    priority: 'medium',
    arrivalTime: format(subDays(now, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    estimatedWaitTime: 0,
    department: 'Dermatology',
    queuePosition: 0
  }
];

// Mock Departments Data
export const departments: Department[] = [
  {
    id: 'd1',
    name: 'Emergency',
    currentLoad: 75,
    averageWaitTime: 30,
    patientsWaiting: 4
  },
  {
    id: 'd2',
    name: 'Radiology',
    currentLoad: 45,
    averageWaitTime: 40,
    patientsWaiting: 2
  },
  {
    id: 'd3',
    name: 'Cardiology',
    currentLoad: 30,
    averageWaitTime: 20,
    patientsWaiting: 1
  },
  {
    id: 'd4',
    name: 'Orthopedics',
    currentLoad: 60,
    averageWaitTime: 35,
    patientsWaiting: 3
  },
  {
    id: 'd5',
    name: 'General Practice',
    currentLoad: 80,
    averageWaitTime: 50,
    patientsWaiting: 6
  },
  {
    id: 'd6',
    name: 'Dermatology',
    currentLoad: 20,
    averageWaitTime: 15,
    patientsWaiting: 1
  }
];

// Mock Analytics Data
export const queueAnalytics: QueueAnalytics[] = [
  {
    date: format(subDays(now, 6), 'yyyy-MM-dd'),
    patientsServed: 87,
    averageWaitTime: 32,
    peakHours: [
      { hour: 9, count: 12 },
      { hour: 11, count: 15 },
      { hour: 14, count: 10 }
    ]
  },
  {
    date: format(subDays(now, 5), 'yyyy-MM-dd'),
    patientsServed: 92,
    averageWaitTime: 28,
    peakHours: [
      { hour: 10, count: 14 },
      { hour: 13, count: 16 },
      { hour: 15, count: 11 }
    ]
  },
  {
    date: format(subDays(now, 4), 'yyyy-MM-dd'),
    patientsServed: 78,
    averageWaitTime: 35,
    peakHours: [
      { hour: 9, count: 11 },
      { hour: 12, count: 13 },
      { hour: 16, count: 9 }
    ]
  },
  {
    date: format(subDays(now, 3), 'yyyy-MM-dd'),
    patientsServed: 85,
    averageWaitTime: 30,
    peakHours: [
      { hour: 10, count: 13 },
      { hour: 14, count: 14 },
      { hour: 17, count: 10 }
    ]
  },
  {
    date: format(subDays(now, 2), 'yyyy-MM-dd'),
    patientsServed: 95,
    averageWaitTime: 27,
    peakHours: [
      { hour: 9, count: 15 },
      { hour: 11, count: 17 },
      { hour: 15, count: 12 }
    ]
  },
  {
    date: format(subDays(now, 1), 'yyyy-MM-dd'),
    patientsServed: 82,
    averageWaitTime: 33,
    peakHours: [
      { hour: 10, count: 12 },
      { hour: 13, count: 15 },
      { hour: 16, count: 11 }
    ]
  },
  {
    date: format(now, 'yyyy-MM-dd'),
    patientsServed: 45, // Partial day
    averageWaitTime: 31,
    peakHours: [
      { hour: 9, count: 10 },
      { hour: 11, count: 12 },
      { hour: 14, count: 8 }
    ]
  }
];

// Mock Prediction Data
export const predictionData: PredictionData[] = [
  { hour: 8, predictedArrivals: 8, actualArrivals: 7 },
  { hour: 9, predictedArrivals: 12, actualArrivals: 10 },
  { hour: 10, predictedArrivals: 15, actualArrivals: 16 },
  { hour: 11, predictedArrivals: 18, actualArrivals: 17 },
  { hour: 12, predictedArrivals: 14, actualArrivals: 15 },
  { hour: 13, predictedArrivals: 12, actualArrivals: 13 },
  { hour: 14, predictedArrivals: 16, actualArrivals: 14 },
  { hour: 15, predictedArrivals: 13, actualArrivals: 12 },
  { hour: 16, predictedArrivals: 10, actualArrivals: 11 },
  { hour: 17, predictedArrivals: 8, actualArrivals: 9 },
  { hour: 18, predictedArrivals: 6 },
  { hour: 19, predictedArrivals: 4 },
  { hour: 20, predictedArrivals: 3 }
];

// Mock Users Data
export const users: User[] = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 'patient1',
    username: 'patient',
    password: 'patient123',
    role: 'patient',
    name: 'John Smith',
    patientId: 'p1'
  },
  {
    id: 'patient2',
    username: 'sarah',
    password: 'sarah123',
    role: 'patient',
    name: 'Sarah Johnson',
    patientId: 'p2'
  },
  {
    id: 'patient3',
    username: 'michael',
    password: 'michael123',
    role: 'patient',
    name: 'Michael Brown',
    patientId: 'p3'
  }
];

// API simulation functions
export const fetchPatients = (): Promise<Patient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(patients);
    }, 500);
  });
};

export const fetchDepartments = (): Promise<Department[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(departments);
    }, 500);
  });
};

export const fetchQueueAnalytics = (): Promise<QueueAnalytics[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(queueAnalytics);
    }, 800);
  });
};

export const fetchPredictionData = (): Promise<PredictionData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(predictionData);
    }, 600);
  });
};

export const updatePatientStatus = (
  patientId: string, 
  newStatus: Patient['status']
): Promise<Patient> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        patient.status = newStatus;
        if (newStatus === 'in-progress') {
          patient.queuePosition = 0;
          patient.estimatedWaitTime = 0;
        } else if (newStatus === 'completed' || newStatus === 'cancelled') {
          patient.queuePosition = 0;
          patient.estimatedWaitTime = 0;
        }
        resolve({...patient});
      } else {
        throw new Error('Patient not found');
      }
    }, 300);
  });
};

export const addNewPatient = (
  name: string,
  department: string,
  priority: Patient['priority']
): Promise<Patient> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = `p${patients.length + 1}`;
      const departmentObj = departments.find(d => d.name === department);
      
      if (!departmentObj) {
        throw new Error('Department not found');
      }
      
      // Calculate queue position
      const queuePosition = patients.filter(
        p => p.department === department && p.status === 'waiting'
      ).length + 1;
      
      // Calculate estimated wait time based on priority and department average
      let estimatedWaitTime = departmentObj.averageWaitTime;
      if (priority === 'low') {
        estimatedWaitTime *= 1.5;
      } else if (priority === 'high') {
        estimatedWaitTime *= 0.7;
      } else if (priority === 'emergency') {
        estimatedWaitTime = 5; // Emergency cases get priority
      }
      
      const newPatient: Patient = {
        id: newId,
        name,
        status: 'waiting',
        priority,
        arrivalTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        estimatedWaitTime: Math.round(estimatedWaitTime),
        department,
        queuePosition
      };
      
      patients.push(newPatient);
      departmentObj.patientsWaiting += 1;
      
      resolve(newPatient);
    }, 500);
  });
};

export const authenticateUser = (
  username: string,
  password: string
): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find(
        u => u.username === username && u.password === password
      );
      resolve(user || null);
    }, 800);
  });
};

export const getPatientById = (patientId: string): Promise<Patient | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patient = patients.find(p => p.id === patientId);
      resolve(patient || null);
    }, 300);
  });
};