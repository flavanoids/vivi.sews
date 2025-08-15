import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useFabricStore } from '../store/fabricStore';
import ImageUpload from './ImageUpload';
import { useLanguage } from '../contexts/LanguageContext';

interface AddFabricDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FabricFormData {
  name: string;
  type: string;
  color: string;
  yardsTotal: number;
  yardsLeft: number;
  cost: number;
  notes: string;
}

export default function AddFabricDialog({ isOpen, onClose }: AddFabricDialogProps) {
  const { addFabric } = useFabricStore();
  const { t } = useLanguage();
  
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

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      
      // Reset form
      setFormData({
        name: '',
        type: '',
        color: '',
        yardsTotal: 0,
        yardsLeft: 0,
        cost: 0,
        notes: '',
      });
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error('Error adding fabric:', error);
      alert('Error adding fabric. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      type: '',
      color: '',
      yardsTotal: 0,
      yardsLeft: 0,
      cost: 0,
      notes: '',
    });
    setSelectedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('fabrics.addFabric')}</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fabrics.fabricName')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Floral Cotton"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fabrics.fabricType')} *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select type</option>
                  <option value="cotton">{t('fabrics.fabricTypes.cotton')}</option>
                  <option value="linen">{t('fabrics.fabricTypes.linen')}</option>
                  <option value="silk">{t('fabrics.fabricTypes.silk')}</option>
                  <option value="wool">{t('fabrics.fabricTypes.wool')}</option>
                  <option value="polyester">{t('fabrics.fabricTypes.polyester')}</option>
                  <option value="denim">{t('fabrics.fabricTypes.denim')}</option>
                  <option value="fleece">{t('fabrics.fabricTypes.fleece')}</option>
                  <option value="knit">{t('fabrics.fabricTypes.knit')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fabrics.fabricColor')} *
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Blue, Red, Multi"
                  required
                />
              </div>

              <div>
                <label htmlFor="yardsTotal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fabrics.yardsTotal')} *
                </label>
                <input
                  type="number"
                  id="yardsTotal"
                  name="yardsTotal"
                  step="0.25"
                  min="0"
                  value={formData.yardsTotal || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label htmlFor="yardsLeft" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fabrics.yardsLeft')} *
                </label>
                <input
                  type="number"
                  id="yardsLeft"
                  name="yardsLeft"
                  step="0.25"
                  min="0"
                  max={formData.yardsTotal}
                  value={formData.yardsLeft || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('fabrics.cost')} *
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  step="0.01"
                  min="0"
                  value={formData.cost || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fabrics.notes')}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Any additional notes about this fabric..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fabrics.image')}
              </label>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                selectedImage={selectedImage}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading || !formData.name || !formData.type || !formData.color || formData.yardsTotal <= 0 || formData.yardsLeft < 0 || formData.cost < 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Adding...' : t('fabrics.addFabric')}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
