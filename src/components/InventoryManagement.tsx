import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext'; // You can create a separate InventoryContext if needed
import { 
  PlusCircle, 
  XCircle 
} from 'lucide-react';

interface InventoryItem {
  id: string;
  itemName: string;
  quantity: number;
  category: string;
}

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const { /* You can add inventory-related functions from useQueue or a new context */ } = useQueue();
  const [newInventory, setNewInventory] = useState({
    itemName: '',
    quantity: 0,
    category: ''
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);

  // Simulate fetching inventory data (replace with API call in real app)
  useEffect(() => {
    // This is a mock; replace with actual API call or context data
    const mockInventory: InventoryItem[] = [
      { id: '1', itemName: 'Syringes', quantity: 100, category: 'supplies' },
      { id: '2', itemName: 'Stethoscope', quantity: 50, category: 'equipment' },
      { id: '3', itemName: 'Painkillers', quantity: 200, category: 'medication' },
    ];
    setInventoryItems(mockInventory);
  }, []);

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInventory.itemName || !newInventory.quantity || !newInventory.category) return;

    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9), // Simple unique ID generator
      itemName: newInventory.itemName,
      quantity: newInventory.quantity,
      category: newInventory.category
    };

    setInventoryItems([...inventoryItems, newItem]);
    setNewInventory({ itemName: '', quantity: 0, category: '' });
  };

  const handleUpdateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventory || !newInventory.itemName || !newInventory.quantity || !newInventory.category) return;

    setInventoryItems(inventoryItems.map(item =>
      item.id === selectedInventory.id ? { ...item, ...newInventory } : item
    ));
    setNewInventory({ itemName: '', quantity: 0, category: '' });
    setSelectedInventory(null);
  };

  const handleDeleteInventory = (id: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <button 
          onClick={() => navigate('/admin')} // Back to Admin Panel
          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          <XCircle size={16} className="mr-2" />
          Back to Admin
        </button>
      </div>

      {/* Add/Update Inventory Form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {selectedInventory ? 'Update Inventory Item' : 'Add Inventory Item'}
        </h2>
        <form onSubmit={selectedInventory ? handleUpdateInventory : handleAddInventory}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
              Item Name
            </label>
            <input
              id="itemName"
              type="text"
              value={newInventory.itemName}
              onChange={(e) => setNewInventory({...newInventory, itemName: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={newInventory.quantity}
              onChange={(e) => setNewInventory({...newInventory, quantity: parseInt(e.target.value) || 0})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              min="0"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={newInventory.category}
              onChange={(e) => setNewInventory({...newInventory, category: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Category</option>
              <option value="medication">Medication</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
            </select>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setNewInventory({ itemName: '', quantity: 0, category: '' });
                setSelectedInventory(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {selectedInventory ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Inventory Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInventory(item);
                          setNewInventory({ ...item, quantity: item.quantity }); // Ensure quantity is a number
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <PlusCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteInventory(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;