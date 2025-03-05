import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { RefreshCw, TrendingUp, Clock, Users, BarChart2 } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { analytics, predictions, departments, loading, error, refreshData } = useQueue();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Format data for charts
  const patientVolumeData = analytics.map(day => ({
    date: format(parseISO(day.date), 'MMM d'),
    patients: day.patientsServed
  }));

  const waitTimeData = analytics.map(day => ({
    date: format(parseISO(day.date), 'MMM d'),
    waitTime: day.averageWaitTime
  }));

  // Combine all peak hours data
  const peakHoursData = Array.from({ length: 12 }, (_, i) => i + 8).map(hour => {
    const hourLabel = hour <= 12 ? `${hour}am` : `${hour - 12}pm`;
    const count = analytics.reduce((sum, day) => {
      const peakHour = day.peakHours.find(peak => peak.hour === hour);
      return sum + (peakHour ? peakHour.count : 0);
    }, 0);
    return { hour: hourLabel, count };
  });

  // Department comparison data
  const departmentData = departments.map(dept => ({
    name: dept.name,
    waitTime: dept.averageWaitTime,
    patients: dept.patientsWaiting
  }));

  // Prediction accuracy data
  const predictionAccuracyData = predictions
    .filter(p => p.actualArrivals !== undefined)
    .map(p => ({
      hour: `${p.hour}:00`,
      predicted: p.predictedArrivals,
      actual: p.actualArrivals
    }));

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Queue Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'day' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'week' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'month' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
          </div>
          <button 
            onClick={refreshData}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <Users size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Total Patients</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {analytics.reduce((sum, day) => sum + day.patientsServed, 0)}
          </div>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <Clock size={20} className="text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold">Avg. Wait Time</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {Math.round(analytics.reduce((sum, day) => sum + day.averageWaitTime, 0) / analytics.length)} min
          </div>
          <p className="text-sm text-gray-600">Across all departments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <TrendingUp size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg font-semibold">Busiest Day</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {format(parseISO(analytics.reduce((max, day) => 
              day.patientsServed > max.patientsServed ? day : max, analytics[0]
            ).date), 'EEE')}
          </div>
          <p className="text-sm text-gray-600">Based on patient volume</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <BarChart2 size={20} className="text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold">Peak Hour</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {(() => {
              const peakHour = peakHoursData.reduce((max, hour) => 
                hour.count > max.count ? hour : max, peakHoursData[0]
              ).hour;
              return peakHour;
            })()}
          </div>
          <p className="text-sm text-gray-600">Highest patient arrivals</p>
        </div>
      </div>

      {/* Patient Volume Chart */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Patient Volume Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={patientVolumeData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="patients" stroke="#3b82f6" fill="#93c5fd" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wait Time and Peak Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Average Wait Time Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={waitTimeData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="waitTime" stroke="#f59e0b" name="Wait Time (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Peak Hours Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={peakHoursData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Patient Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Comparison and Prediction Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Department Comparison</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="waitTime" fill="#ef4444" name="Wait Time (min)" />
                <Bar dataKey="patients" fill="#10b981" name="Patients Waiting" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Prediction Accuracy</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={predictionAccuracyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" name="Predicted Arrivals" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" name="Actual Arrivals" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;