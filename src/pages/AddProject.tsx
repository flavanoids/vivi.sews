import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useFabricStore } from '../store/fabricStore';
import ImageUpload from '../components/ImageUpload';

export default function AddProject() {
  const navigate = useNavigate();
  const { addProject, fabrics, isDarkMode } = useFabricStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    targetDate: '',
    notes: '',
    imageUrl: '',
  });
  
  const [selectedMaterials, setSelectedMaterials] = useState<Array<{
    fabricId: string;
    yardsUsed: number;
    notes: string;
  }>>([]);
  

  
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    fabricId: '',
    yardsUsed: 0,
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.fabricId && newMaterial.yardsUsed > 0) {
      setSelectedMaterials(prev => [...prev, { ...newMaterial }]);
      setNewMaterial({ fabricId: '', yardsUsed: 0, notes: '' });
      setShowMaterialSelector(false);
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setSelectedMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    addProject({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      materials: [],
      patterns: [],
      imageUrl: formData.imageUrl || undefined,
      targetDate: formData.targetDate || undefined,
      notes: formData.notes.trim() || undefined,
    });

    // Add materials after project creation
    selectedMaterials.forEach(material => {
      const fabric = fabrics.find(f => f.id === material.fabricId);
      if (fabric) {
        // We'll need to add this material to the project after it's created
        // For now, we'll just create the project without materials
      }
    });

    navigate('/projects');
  };

  const getSelectedFabric = (fabricId: string) => {
    return fabrics.find(f => f.id === fabricId);
  };

  const handleImageSelect = (file: File) => {
    // For now, we'll just store the file name as a placeholder
    // In a real app, you'd upload this to a service like Cloudinary
    setFormData(prev => ({ ...prev, imageUrl: file.name }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/projects')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Summer Tote Bag"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Project Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Image
                </label>
                <ImageUpload
                  currentImage={formData.imageUrl}
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                />
              </div>

              {/* Materials Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Materials</h3>
                  <button
                    type="button"
                    onClick={() => setShowMaterialSelector(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Material
                  </button>
                </div>

                {selectedMaterials.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMaterials.map((material, index) => {
                      const fabric = getSelectedFabric(material.fabricId);
                      return (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{fabric?.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {fabric?.type} • {fabric?.color} • {material.yardsUsed} yards
                              </p>
                              {material.notes && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{material.notes}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMaterial(index)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">🧵</div>
                    <p>No materials added yet</p>
                    <p className="text-sm">Add materials to track what you'll need for this project</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any additional notes about your project..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Material Selector Modal */}
      {showMaterialSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Material</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Fabric
                </label>
                <select
                  value={newMaterial.fabricId}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, fabricId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a fabric...</option>
                  {fabrics.map(fabric => (
                    <option key={fabric.id} value={fabric.id}>
                      {fabric.name} ({fabric.type}, {fabric.color}) - {fabric.total_yards} yards left
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yards Needed
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={newMaterial.yardsUsed}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, yardsUsed: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={newMaterial.notes}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Main body fabric"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowMaterialSelector(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
