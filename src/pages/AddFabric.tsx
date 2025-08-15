import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFabricStore } from '../store/fabricStore';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/ImageUpload';

interface FabricFormData {
  name: string;
  type: string;
  color: string;
  yardsTotal: number;
  yardsLeft: number;
  cost: number;
  notes: string;
}

export default function AddFabric() {
  const navigate = useNavigate();
  const { addFabric, isDarkMode } = useFabricStore(state => ({ 
    addFabric: state.addFabric, 
    isDarkMode: state.isDarkMode 
  }));
  const { currentUser, isAuthenticated } = useAuthStore();
  
  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    navigate('/login');
    return null;
  }
  const [formData, setFormData] = useState<FabricFormData>({
    name: '',
    type: '',
    color: '',
    yardsTotal: 0,
    yardsLeft: 0,
    cost: 0,
    notes: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yardsTotal' || name === 'yardsLeft' || name === 'cost' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl: string | undefined;
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }
    
    try {
      addFabric({
        ...formData,
        isPinned: false,
        imageUrl,
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding fabric:', error);
      // You could add a toast notification here
      alert('Error adding fabric. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Collection
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add New Fabric</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Fabric Photo
                </label>
                <ImageUpload onImageSelect={handleImageSelect} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fabric Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Soft Cotton Blend"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fabric Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Linen">Linen</option>
                    <option value="Silk">Silk</option>
                    <option value="Wool">Wool</option>
                    <option value="Polyester">Polyester</option>
                    <option value="Denim">Denim</option>
                    <option value="Fleece">Fleece</option>
                    <option value="Knit">Knit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color/Pattern
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Navy Blue, Floral Print"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="yardsTotal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Yards
                  </label>
                  <input
                    type="number"
                    id="yardsTotal"
                    name="yardsTotal"
                    step="0.25"
                    min="0"
                    value={formData.yardsTotal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="yardsLeft" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yards Left
                  </label>
                  <input
                    type="number"
                    id="yardsLeft"
                    name="yardsLeft"
                    step="0.25"
                    min="0"
                    value={formData.yardsLeft}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any additional notes about this fabric..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Save Fabric
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}