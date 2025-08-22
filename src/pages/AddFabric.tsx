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
  const { addFabric } = useFabricStore(state => ({ 
    addFabric: state.addFabric
  }));
  const { currentUser, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
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
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yardsTotal' || name === 'yardsLeft' || name === 'cost' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleImageSelect = (_file: File) => {
    // File is handled by ImageUpload component
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await addFabric({
        name: formData.name,
        type: formData.type,
        color: formData.color,
        yardsTotal: formData.yardsTotal,
        yardsLeft: formData.yardsTotal,
        cost: formData.cost,
        notes: formData.notes,
        imageUrl: imageUrl || undefined,
        isPinned: false,
      });
      
      if (result.success) {
        navigate('/');
      } else {
        alert(result.message || 'Error adding fabric. Please try again.');
      }
    } catch (error) {
      alert('Error adding fabric. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Collection
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Fabric</h1>
            <p className="text-sm text-gray-600 mt-2">
              Logged in as: {currentUser.username}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fabric Photo
                </label>
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  onImageUpload={handleImageUpload}
                  uploadType="fabric"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Fabric Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Soft Cotton Blend"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Fabric Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="cotton">Cotton</option>
                    <option value="linen">Linen</option>
                    <option value="silk">Silk</option>
                    <option value="wool">Wool</option>
                    <option value="polyester">Polyester</option>
                    <option value="denim">Denim</option>
                    <option value="fleece">Fleece</option>
                    <option value="knit">Knit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Color/Pattern
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Navy Blue, Floral Print"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="yardsTotal" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="yardsLeft" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any additional notes about this fabric..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Fabric'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
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