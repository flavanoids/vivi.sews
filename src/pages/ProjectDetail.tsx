import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Calendar, FileText, Scissors, BookOpen } from 'lucide-react';
import { useFabricStore, type Project } from '../store/fabricStore';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    fabrics, 
    usageHistory, 
    deleteProject, 
    removeMaterialFromProject,
    removePatternFromProject,
    isDarkMode 
  } = useFabricStore();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const project = projects.find(p => p.id === id);
  
  if (!project) {
    return (
      <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
              <Link 
                to="/projects"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'on-hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning': return '📋';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      case 'on-hold': return '⏸️';
      default: return '📋';
    }
  };

  const projectUsageHistory = usageHistory.filter(usage => 
    project.materials.some(material => material.fabricId === usage.fabricId)
  );

  const totalYardsUsed = project.materials.reduce((sum, material) => sum + material.yardsUsed, 0);
  const totalMaterials = project.materials.length;
  const totalPatterns = project.patterns.length;

  const handleDeleteConfirm = () => {
    deleteProject(project.id);
    navigate('/projects');
  };

  const handleRemoveMaterial = (materialId: string) => {
    removeMaterialFromProject(project.id, materialId);
  };

  const handleRemovePattern = (patternId: string) => {
    removePatternFromProject(project.id, patternId);
  };



  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative h-64 sm:h-80">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-2">🧵</div>
                    <div className="text-lg">No project image</div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <Link 
                  to="/projects"
                  className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/projects/edit/${project.id}`)}
                    className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteDialogOpen(true)}
                    className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Project Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalMaterials}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Materials</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalYardsUsed.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Yards</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPatterns}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Patterns</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Scissors className="w-5 h-5" />
                        Materials ({totalMaterials})
                      </h2>
                      <button
                        onClick={() => navigate(`/projects/edit/${project.id}`)}
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
                                <h3 className="font-medium text-gray-900 dark:text-white">{material.fabricName}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {material.fabricType} • {material.fabricColor} • {material.yardsUsed} yards
                                </p>
                                {material.notes && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{material.notes}</p>
                                )}
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  Added {new Date(material.addedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveMaterial(material.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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

                  {/* Patterns */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Patterns ({totalPatterns})
                      </h2>
                      <button
                        onClick={() => navigate(`/projects/edit/${project.id}`)}
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
                                <h3 className="font-medium text-gray-900 dark:text-white">{pattern.patternName}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  by {pattern.patternDesigner} • {pattern.patternCategory.replace('-', ' ')} • {pattern.patternDifficulty}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  Added {new Date(pattern.addedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemovePattern(pattern.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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

                  {/* Usage History */}
                  {projectUsageHistory.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Usage History
                      </h2>
                      <div className="space-y-3">
                        {projectUsageHistory.map((usage) => {
                          const fabric = fabrics.find(f => f.id === usage.fabricId);
                          return (
                            <div key={usage.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">{fabric?.name}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {usage.yardsUsed} yards used • {usage.projectName}
                                  </p>
                                  {usage.notes && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{usage.notes}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(usage.usageDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Project Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Created:</span>
                        <div className="text-gray-900 dark:text-white">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                        <div className="text-gray-900 dark:text-white">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      {project.targetDate && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Target Date:</span>
                          <div className="text-gray-900 dark:text-white">
                            {new Date(project.targetDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {project.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Notes
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{project.notes}</p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate(`/projects/edit/${project.id}`)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Edit Project
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        View Fabrics
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        fabric={null}
        project={project}
        pattern={null}
        isOpen={deleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
