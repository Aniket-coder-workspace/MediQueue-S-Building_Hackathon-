import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle, Bed, Package, Download } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend);

interface BedPrediction {
  hour: number;
  availableBeds: number;
  occupiedBeds: number;
  predictedNeed: number;
  confidenceLevel: number;
  department?: string;
}

interface InventoryPrediction {
  itemName: string;
  currentQuantity: number;
  predictedUsage: number;
  predictedRestockNeed: number;
  confidenceLevel: number;
  category: string;
}

const AIPredictions: React.FC = () => {
  const navigate = useNavigate();
  const [bedPredictions, setBedPredictions] = useState<BedPrediction[]>([]);
  const [inventoryPredictions, setInventoryPredictions] = useState<InventoryPrediction[]>([]);
  const [predictionType, setPredictionType] = useState<string>('beds');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('24h');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(50); // New feature: Confidence threshold
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockDepartments = [
    { id: '1', name: 'Emergency' },
    { id: '2', name: 'Surgery' },
    { id: '3', name: 'Pediatrics' },
  ];

  useEffect(() => {
    const simulatePredictions = () => {
      try {
        setLoading(true);
        const now = new Date();
        const bedPreds: BedPrediction[] = [];
        const inventoryPreds: InventoryPrediction[] = [];

        for (let i = 0; i < 24; i++) {
          const hour = (now.getHours() + i) % 24;
          const baseAvailable = Math.floor(Math.random() * 50) + 20;
          const baseOccupied = Math.floor(Math.random() * 30) + 10;
          const confidence = Math.floor(Math.random() * 100); // Full range 0-100

          bedPreds.push({
            hour,
            availableBeds: baseAvailable,
            occupiedBeds: baseOccupied,
            predictedNeed: Math.floor(Math.random() * 10),
            confidenceLevel: confidence,
          });

          mockDepartments.forEach(dept => {
            bedPreds.push({
              hour,
              availableBeds: Math.floor(baseAvailable * 0.7),
              occupiedBeds: Math.floor(baseOccupied * 0.8),
              predictedNeed: Math.floor(Math.random() * 5),
              confidenceLevel: confidence - Math.floor(Math.random() * 20), // Slightly varied
              department: dept.name,
            });
          });
        }

        const inventoryItems = [
          { itemName: 'Syringes', category: 'supplies' },
          { itemName: 'Stethoscopes', category: 'equipment' },
          { itemName: 'Painkillers', category: 'medication' },
          { itemName: 'Gauze', category: 'supplies' },
          { itemName: 'IV Fluids', category: 'medication' },
        ];

        inventoryPreds.push(
          ...inventoryItems.map(item => ({
            itemName: item.itemName,
            currentQuantity: Math.floor(Math.random() * 200) + 50,
            predictedUsage: Math.floor(Math.random() * 50) + 10,
            predictedRestockNeed: Math.max(0, Math.floor(Math.random() * 50) - Math.floor(Math.random() * 200) / 24),
            confidenceLevel: Math.floor(Math.random() * 100), // Full range 0-100
            category: item.category,
          }))
        );

        setBedPredictions(bedPreds);
        setInventoryPredictions(inventoryPreds);
        toast.success('AI predictions generated successfully');
      } catch (err) {
        console.error('Error in simulatePredictions:', err);
        setError('Failed to generate AI predictions');
        toast.error('Failed to generate predictions');
      } finally {
        setLoading(false);
      }
    };

    simulatePredictions();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    toast.promise(
      new Promise(resolve => setTimeout(() => {
        simulatePredictions();
        resolve(null);
      }, 1000)),
      {
        loading: 'Refreshing predictions...',
        success: 'Predictions refreshed!',
        error: 'Failed to refresh predictions',
      }
    );
  };

  const exportPredictions = () => {
    const data = predictionType === 'beds' ? filteredBedPredictions : filteredInventoryPredictions;
    const csv = [
      predictionType === 'beds'
        ? 'Hour,Available Beds,Occupied Beds,Predicted Need,Confidence Level,Department'
        : 'Item Name,Current Quantity,Predicted Usage,Predicted Restock Need,Confidence Level,Category',
      ...data.map(p =>
        predictionType === 'beds'
          ? `${p.hour}:00,${p.availableBeds},${p.occupiedBeds},${p.predictedNeed},${p.confidenceLevel}%,${p.department || 'All'}`
          : `${p.itemName},${p.currentQuantity},${p.predictedUsage},${p.predictedRestockNeed},${p.confidenceLevel}%,${p.category}`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${predictionType}_predictions_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Exported predictions to CSV');
  };

  // Filter predictions based on all options including confidence
  const filteredBedPredictions = bedPredictions
    .filter(p => (departmentFilter === 'all' || p.department === departmentFilter) && p.confidenceLevel >= confidenceThreshold)
    .slice(0, dateRange === '24h' ? 24 : dateRange === '12h' ? 12 : 6);

  const filteredInventoryPredictions = inventoryPredictions
    .filter(p => (departmentFilter === 'all' || p.category === departmentFilter.toLowerCase()) && p.confidenceLevel >= confidenceThreshold);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow manual sizing for smaller charts
    height: 300, // Reduced height for smaller charts
    plugins: {
      legend: { position: 'top' as const, labels: { font: { size: 12 } } },
      title: { display: true, font: { size: 14 }, padding: 15 },
      tooltip: { backgroundColor: '#333', titleFont: { size: 12 }, bodyFont: { size: 10 } },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    },
  };

  // Chart Data with Filters Applied
  const bedsChartData = {
    labels: predictionType === 'beds'
      ? filteredBedPredictions.map(p => `${p.hour}:00`)
      : filteredInventoryPredictions.map(p => p.itemName),
    datasets: predictionType === 'beds'
      ? [
          { label: 'Available Beds', data: filteredBedPredictions.map(p => p.availableBeds), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)', tension: 0.4, pointRadius: 2 },
          { label: 'Occupied Beds', data: filteredBedPredictions.map(p => p.occupiedBeds), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', tension: 0.4, pointRadius: 2 },
        ]
      : [
          { label: 'Current Quantity', data: filteredInventoryPredictions.map(p => p.currentQuantity), backgroundColor: '#3b82f6', borderColor: '#1d4ed8', borderWidth: 1, barThickness: 20 },
        ],
  };

  const needsChartData = {
    labels: predictionType === 'beds'
      ? filteredBedPredictions.map(p => `${p.hour}:00`)
      : filteredInventoryPredictions.map(p => p.itemName),
    datasets: [
      {
        label: predictionType === 'beds' ? 'Predicted Bed Need' : 'Predicted Restock Need',
        data: predictionType === 'beds'
          ? filteredBedPredictions.map(p => p.predictedNeed)
          : filteredInventoryPredictions.map(p => p.predictedRestockNeed),
        backgroundColor: '#f59e0b',
        borderColor: '#d97706',
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  const deptLoadChartData = {
    labels: predictionType === 'beds'
      ? mockDepartments.map(d => d.name)
      : ['Medication', 'Equipment', 'Supplies'],
    datasets: [
      {
        label: predictionType === 'beds' ? 'Department Bed Occupancy' : 'Inventory Category Distribution',
        data: predictionType === 'beds'
          ? mockDepartments.map(dept => {
              const deptPreds = filteredBedPredictions.filter(p => p.department === dept.name);
              return deptPreds.length > 0 ? deptPreds.reduce((sum, p) => sum + p.occupiedBeds, 0) / deptPreds.length : 0;
            })
          : ['medication', 'equipment', 'supplies'].map(cat => {
              const catPreds = filteredInventoryPredictions.filter(p => p.category === cat);
              return catPreds.length > 0 ? catPreds.reduce((sum, p) => sum + p.currentQuantity, 0) / catPreds.length : 0;
            }),
        backgroundColor: ['#ef4444', '#3b82f6', '#10b981'],
        borderColor: ['#dc2626', '#1d4ed8', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <div className="flex items-center text-red-700">
          <AlertCircle className="mr-2" size={20} />
          <p><strong>Error:</strong> {error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">AI-Driven Predictions</h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportPredictions}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <AlertCircle size={18} className="mr-2" />
              Back to Admin
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter Predictions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prediction Type</label>
              <select
                value={predictionType}
                onChange={(e) => {
                  setPredictionType(e.target.value);
                  setDepartmentFilter('all'); // Reset filter when type changes
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beds">Bed Allocation</option>
                <option value="inventory">Inventory Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {predictionType === 'beds' ? 'Department' : 'Category'}
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All {predictionType === 'beds' ? 'Departments' : 'Categories'}</option>
                {predictionType === 'beds' &&
                  mockDepartments.map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                {predictionType === 'inventory' && (
                  <>
                    <option value="medication">Medication</option>
                    <option value="equipment">Equipment</option>
                    <option value="supplies">Supplies</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">24 Hours</option>
                <option value="12h">12 Hours</option>
                <option value="6h">6 Hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confidence Threshold (%)</label>
              <input
                type="number"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {predictionType === 'beds' ? 'Bed Availability Over Time' : 'Inventory Levels'}
            </h3>
            <div className="h-60"> {/* Reduced height for smaller charts */}
              {predictionType === 'beds' ? (
                <Line data={bedsChartData} options={chartOptions} />
              ) : (
                <Bar data={bedsChartData} options={chartOptions} />
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {predictionType === 'beds' ? 'Predicted Bed Needs' : 'Predicted Restock Needs'}
            </h3>
            <div className="h-60"> {/* Reduced height for smaller charts */}
              <Bar data={needsChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {predictionType === 'beds' ? 'Department Bed Distribution' : 'Inventory Category Distribution'}
          </h3>
          <div className="h-60"> {/* Reduced height for smaller charts */}
            <Pie data={deptLoadChartData} options={chartOptions} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {predictionType === 'beds' ? 'Bed Allocation Predictions' : 'Inventory Management Predictions'}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {predictionType === 'beds' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hour</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Need</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(predictionType === 'beds' ? filteredBedPredictions : filteredInventoryPredictions).map((pred, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {predictionType === 'beds' ? (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-900">{pred.hour}:00</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.availableBeds}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.occupiedBeds}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.predictedNeed}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.confidenceLevel}%</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.department || 'All'}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-900">{pred.itemName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.currentQuantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.predictedUsage}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.predictedRestockNeed}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.confidenceLevel}%</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{pred.category}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;