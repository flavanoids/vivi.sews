import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, BookOpen } from 'lucide-react';
import { useFabricStore, type ProjectMaterial } from '../store/fabricStore';
import ImageUpload from '../components/ImageUpload';

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    fabrics, 
    patterns,
    updateProject, 
    addMaterialToProject, 
    removeMaterialFromProject,
    updateProjectMaterial,
    addPatternToProject,
    removePatternFromProject,
    isDarkMode 
  } = useFabricStore();
  
  const project = projects.find(p => p.id === id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as 'planning' | 'in-progress' | 'completed' | 'on-hold',
    targetDate: '',
    notes: '',
    imageUrl: '',
  });
  
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [showPatternSelector, setShowPatternSelector] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    fabricId: '',
    yardsUsed: 0,
    notes: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        targetDate: project.targetDate ? new Date(project.targetDate).toISOString().split('T')[0] : '',
        notes: project.notes || '',
        imageUrl: project.imageUrl || '',
      });
    }
  }, [project]);

  if (!project) {
    return (
      <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The project you're trying to edit doesn't exist.</p>
              <button
                onClick={() => navigate('/projects')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.fabricId && newMaterial.yardsUsed > 0) {
      const fabric = fabrics.find(f => f.id === newMaterial.fabricId);
      if (fabric) {
        addMaterialToProject(project.id, {
          fabricId: newMaterial.fabricId,
          fabricName: fabric.name,
          fabricType: fabric.type,
          fabricColor: fabric.color,
          yardsUsed: newMaterial.yardsUsed,
          notes: newMaterial.notes,
        });
        setNewMaterial({ fabricId: '', yardsUsed: 0, notes: '' });
        setShowMaterialSelector(false);
      }
    }
  };

  const handleRemoveMaterial = (materialId: string) => {
    removeMaterialFromProject(project.id, materialId);
  };

  const handleAddPattern = (patternId: string) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (pattern) {
      addPatternToProject(project.id, {
        patternId: pattern.id,
        patternName: pattern.name,
        patternDesigner: pattern.designer,
        patternCategory: pattern.category,
        patternDifficulty: pattern.difficulty,
      });
      setShowPatternSelector(false);
    }
  };

  const handleRemovePattern = (patternId: string) => {
    removePatternFromProject(project.id, patternId);
  };

  const handleUpdateMaterial = (materialId: string, updates: Partial<ProjectMaterial>) => {
    updateProjectMaterial(project.id, materialId, updates);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    updateProject(project.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      imageUrl: formData.imageUrl || undefined,
      targetDate: formData.targetDate || undefined,
      notes: formData.notes.trim() || undefined,
    });

    navigate(`/projects/${project.id}`);
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
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
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
                    onChange={(e) => handleInputChange('status', e.target.value as 'planning' | 'in-progress' | 'completed' | 'on-hold')}
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Materials ({project.materials.length})</h3>
                  <button
                    type="button"
                    onClick={() => setShowMaterialSelector(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Material
                  </button>
                </div>

                {project.materials.length > 0 ? (
                  <div className="space-y-3">
                    {project.materials.map((material) => (
                      <div key={material.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{material.fabricName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {material.fabricType} • {material.fabricColor}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400">Yards</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={material.yardsUsed}
                                  onChange={(e) => handleUpdateMaterial(material.id, { yardsUsed: parseFloat(e.target.value) || 0 })}
                                  className="w-20 px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 dark:text-gray-400">Notes</label>
                                <input
                                  type="text"
                                  value={material.notes || ''}
                                  onChange={(e) => handleUpdateMaterial(material.id, { notes: e.target.value })}
                                  className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="Optional notes..."
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Added {new Date(material.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(material.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">🧵</div>
                    <p>No materials added yet</p>
                    <p className="text-sm">Add materials to track what you need for this project</p>
                  </div>
                )}
              </div>

              {/* Patterns Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Patterns ({project.patterns.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPatternSelector(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Pattern
                  </button>
                </div>

                {project.patterns.length > 0 ? (
                  <div className="space-y-3">
                    {project.patterns.map((pattern) => (
                      <div key={pattern.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{pattern.patternName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {pattern.patternDesigner} • {pattern.patternCategory.replace('-', ' ')} • {pattern.patternDifficulty}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Added {new Date(pattern.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePattern(pattern.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No patterns added yet</p>
                    <p className="text-sm">Add patterns to track which sewing patterns you're using for this project</p>
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
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
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
                      {fabric.name} ({fabric.type}, {fabric.color}) - {fabric.yardsLeft} yards left
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

      {/* Pattern Selector Modal */}
      {showPatternSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Pattern</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Pattern
                </label>
                <select
                  onChange={(e) => handleAddPattern(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a pattern...</option>
                  {patterns
                    .filter(pattern => !project.patterns.some(p => p.patternId === pattern.id))
                    .map(pattern => (
                      <option key={pattern.id} value={pattern.id}>
                        {pattern.name} by {pattern.designer} ({pattern.category.replace('-', ' ')}, {pattern.difficulty})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPatternSelector(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
