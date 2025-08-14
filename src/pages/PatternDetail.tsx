import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download, Eye, Heart, Calendar, FileText, Ruler, Scissors, Tag } from 'lucide-react';
import { useFabricStore, type Pattern } from '../store/fabricStore';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default function PatternDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    patterns, 
    deletePattern, 
    togglePatternPin,
    isDarkMode 
  } = useFabricStore();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const pattern = patterns.find(p => p.id === id);
  
  if (!pattern) {
    return (
      <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pattern Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The pattern you're looking for doesn't exist.</p>
              <Link 
                to="/patterns"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Patterns
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: Pattern['category']) => {
    switch (category) {
      case 'dresses': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      case 'tops': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'bottoms': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'outerwear': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'accessories': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'home-decor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'bags': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: Pattern['category']) => {
    switch (category) {
      case 'dresses': return '👗';
      case 'tops': return '👚';
      case 'bottoms': return '👖';
      case 'outerwear': return '🧥';
      case 'accessories': return '👜';
      case 'home-decor': return '🏠';
      case 'bags': return '👜';
      default: return '📋';
    }
  };

  const getDifficultyColor = (difficulty: Pattern['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleDeleteConfirm = () => {
    deletePattern(pattern.id);
    setDeleteDialogOpen(false);
    navigate('/patterns');
  };

  const handleEdit = () => {
    navigate(`/patterns/edit/${pattern.id}`);
  };

  const handleViewPDF = () => {
    if (pattern.pdfUrl) {
      window.open(pattern.pdfUrl, '_blank');
    }
  };

  const handleDownloadPDF = () => {
    if (pattern.pdfUrl) {
      const link = document.createElement('a');
      link.href = pattern.pdfUrl;
      link.download = `${pattern.name}.pdf`;
      link.click();
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link 
                  to="/patterns"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{pattern.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePatternPin(pattern.id)}
                  className={`p-2 rounded-full transition-colors ${
                    pattern.isPinned 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${pattern.isPinned ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Added {new Date(pattern.createdAt).toLocaleDateString()}</span>
              </div>
              {pattern.patternNumber && (
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{pattern.patternNumber}</span>
                </div>
              )}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pattern.category)}`}>
                {getCategoryIcon(pattern.category)} {pattern.category.replace('-', ' ')}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pattern.difficulty)}`}>
                {pattern.difficulty}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Pattern Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pattern Image/Thumbnail */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 relative">
                  {pattern.thumbnailUrl ? (
                    <img src={pattern.thumbnailUrl} alt={pattern.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-6xl mb-4">📄</div>
                        <div className="text-lg">No thumbnail</div>
                      </div>
                    </div>
                  )}
                  
                  {/* PDF Actions */}
                  {pattern.pdfUrl && (
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <button
                        onClick={handleViewPDF}
                        className="flex-1 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View PDF
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pattern Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pattern Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Designer</h3>
                    <p className="text-gray-600 dark:text-gray-400">{pattern.designer}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Size Range</h3>
                    <p className="text-gray-600 dark:text-gray-400">{pattern.sizeRange}</p>
                  </div>
                  
                  {pattern.fabricRequirements && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Fabric Requirements</h3>
                      <p className="text-gray-600 dark:text-gray-400">{pattern.fabricRequirements}</p>
                    </div>
                  )}
                  
                  {pattern.notions && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Notions</h3>
                      <p className="text-gray-600 dark:text-gray-400">{pattern.notions}</p>
                    </div>
                  )}
                  
                  {pattern.instructions && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Instructions</h3>
                      <p className="text-gray-600 dark:text-gray-400">{pattern.instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {pattern.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{pattern.description}</p>
                </div>
              )}

              {/* Notes */}
              {pattern.notes && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notes</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{pattern.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">{pattern.category.replace('-', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Difficulty</p>
                      <p className="font-medium text-gray-900 dark:text-white">{pattern.difficulty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {pattern.isPinned ? 'Pinned' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleEdit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Pattern
                  </button>
                  
                  {pattern.pdfUrl && (
                    <>
                      <button
                        onClick={handleViewPDF}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View PDF
                      </button>
                      
                      <button
                        onClick={handleDownloadPDF}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DeleteConfirmDialog
            fabric={null}
            project={null}
            pattern={pattern}
            isOpen={deleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteDialogOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
