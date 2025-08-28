import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFabricStore } from '../store/fabricStore';
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

export default function EditFabric() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fabrics, updateFabric, isDarkMode } = useFabricStore();
  
  const fabric = fabrics.find(f => f.id === id);
  
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

  useEffect(() => {
    if (fabric) {
      setFormData({
        name: fabric.name,
        type: fabric.type,
        color: fabric.color,
        yardsTotal: fabric.total_yards,
        yardsLeft: fabric.total_yards,
        cost: fabric.total_cost || 0,
        notes: fabric.notes || '',
      });
    } else {
      navigate('/');
    }
  }, [fabric, navigate]);

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

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabric) return;
    
    let imageUrl: string | undefined = fabric.image_url;
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);
    }
    
    updateFabric(fabric.id, {
      name: formData.name,
      type: formData.type,
      color: formData.color,
      total_yards: formData.yardsTotal,
      cost_per_yard: formData.cost > 0 ? formData.cost / formData.yardsTotal : undefined,
      total_cost: formData.cost,
      notes: formData.notes,
      image_url: imageUrl,
    });
    navigate('/');
  };

  if (!fabric) {
    return null;
  }

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Fabric</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Fabric Photo
                </label>
                <ImageUpload 
                  onImageSelect={handleImageSelect} 
                  currentImage={fabric.image_url}
                  onImageRemove={handleImageRemove}
                />
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
                  Update Fabric
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