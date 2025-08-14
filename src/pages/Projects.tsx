import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Clock, Moon, Sun, Filter } from 'lucide-react';
import { useFabricStore, type Project } from '../store/fabricStore';
import { useAuthStore } from '../store/authStore';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default function Projects() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { 
    getUserProjects,
    projectSearchTerm, 
    setProjectSearchTerm,
    projectFilterStatus,
    setProjectFilterStatus,
    deleteProject,
    isDarkMode,
    toggleDarkMode
  } = useFabricStore();
  const [deleteDialogProject, setDeleteDialogProject] = useState<Project | null>(null);

  // Get user-specific projects
  const userProjects = currentUser ? getUserProjects(currentUser.id) : [];

  const filteredProjects = userProjects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(projectSearchTerm.toLowerCase()));
    
    const matchesFilter = !projectFilterStatus || project.status === projectFilterStatus;
    
    return matchesSearch && matchesFilter;
  });

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

  const handleDeleteConfirm = () => {
    if (deleteDialogProject) {
      deleteProject(deleteDialogProject.id);
      setDeleteDialogProject(null);
    }
  };

  const handleEdit = (project: Project) => {
    navigate(`/projects/edit/${project.id}`);
  };

  const handleView = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  to="/"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  ← Back to Fabrics
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Link 
                  to="/projects/add"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearchTerm}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-gray-400 mt-3" />
                <select
                  value={projectFilterStatus}
                  onChange={(e) => setProjectFilterStatus(e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onView={() => handleView(project)}
                onEdit={() => handleEdit(project)}
                onDelete={() => setDeleteDialogProject(project)}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {projectSearchTerm || projectFilterStatus ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {projectSearchTerm || projectFilterStatus 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by creating your first sewing project!'
                }
              </p>
              {!projectSearchTerm && !projectFilterStatus && (
                <Link 
                  to="/projects/add"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Project
                </Link>
              )}
            </div>
          )}
          
          <DeleteConfirmDialog
            fabric={null}
            project={deleteDialogProject}
            isOpen={!!deleteDialogProject}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteDialogProject(null)}
          />
        </div>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: Project['status']) => string;
  getStatusIcon: (status: Project['status']) => string;
}

function ProjectCard({ project, onView, onEdit, getStatusColor, getStatusIcon }: ProjectCardProps) {
  const totalMaterials = project.materials.length;
  const totalYards = project.materials.reduce((sum, material) => sum + material.yardsUsed, 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 relative">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🧵</div>
              <div className="text-sm">No image</div>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)} {project.status.replace('-', ' ')}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{totalMaterials} materials</span>
              <span>{totalYards.toFixed(1)} yards</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{project.name}</h3>
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          {project.targetDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(project.targetDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
