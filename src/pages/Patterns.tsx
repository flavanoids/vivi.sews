import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Moon, Sun, Filter, FileText } from 'lucide-react';
import { useFabricStore, type Pattern } from '../store/fabricStore';
import { useAuthStore } from '../store/authStore';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default function Patterns() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { 
    getUserPatterns,
    patternSearchTerm, 
    setPatternSearchTerm,
    patternFilterCategory,
    setPatternFilterCategory,
    deletePattern,
    isDarkMode,
    toggleDarkMode
  } = useFabricStore();
  const [deleteDialogPattern, setDeleteDialogPattern] = useState<Pattern | null>(null);

  // Get user-specific patterns
  const userPatterns = currentUser ? getUserPatterns(currentUser.id) : [];

  const filteredPatterns = userPatterns.filter(pattern => {
    const matchesSearch = 
      pattern.name.toLowerCase().includes(patternSearchTerm.toLowerCase()) ||
      (pattern.description && pattern.description.toLowerCase().includes(patternSearchTerm.toLowerCase())) ||
      pattern.designer.toLowerCase().includes(patternSearchTerm.toLowerCase()) ||
      pattern.category.toLowerCase().includes(patternSearchTerm.toLowerCase());
    
    const matchesFilter = !patternFilterCategory || pattern.category === patternFilterCategory;
    
    return matchesSearch && matchesFilter;
  });

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

  const handleDeleteConfirm = () => {
    if (deleteDialogPattern) {
      deletePattern(deleteDialogPattern.id);
      setDeleteDialogPattern(null);
    }
  };

  const handleEdit = (pattern: Pattern) => {
    navigate(`/patterns/edit/${pattern.id}`);
  };

  const handleView = (pattern: Pattern) => {
    navigate(`/patterns/${pattern.id}`);
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Patterns</h1>
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
                  to="/patterns/add"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Pattern
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patterns by name, designer, or category..."
                  value={patternSearchTerm}
                  onChange={(e) => setPatternSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-gray-400 mt-3" />
                <select
                  value={patternFilterCategory}
                  onChange={(e) => setPatternFilterCategory(e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="dresses">Dresses</option>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="accessories">Accessories</option>
                  <option value="home-decor">Home Decor</option>
                  <option value="bags">Bags</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPatterns.map((pattern) => (
              <PatternCard 
                key={pattern.id} 
                pattern={pattern} 
                onView={() => handleView(pattern)}
                onEdit={() => handleEdit(pattern)}
                onDelete={() => setDeleteDialogPattern(pattern)}
                getCategoryColor={getCategoryColor}
                getCategoryIcon={getCategoryIcon}
              />
            ))}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {patternSearchTerm || patternFilterCategory ? 'No patterns found' : 'No patterns yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {patternSearchTerm || patternFilterCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by uploading your first sewing pattern!'
                }
              </p>
              {!patternSearchTerm && !patternFilterCategory && (
                <Link 
                  to="/patterns/add"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Upload Your First Pattern
                </Link>
              )}
            </div>
          )}
          
          <DeleteConfirmDialog
            fabric={null}
            project={null}
            pattern={deleteDialogPattern}
            isOpen={!!deleteDialogPattern}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteDialogPattern(null)}
          />
        </div>
      </div>
    </div>
  );
}

interface PatternCardProps {
  pattern: Pattern;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getCategoryColor: (category: Pattern['category']) => string;
  getCategoryIcon: (category: Pattern['category']) => string;
}

function PatternCard({ pattern, onView, onEdit, getCategoryColor, getCategoryIcon }: PatternCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 relative">
        {pattern.thumbnailUrl ? (
          <img src={pattern.thumbnailUrl} alt={pattern.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📄</div>
              <div className="text-sm">No thumbnail</div>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pattern.category)}`}>
            {getCategoryIcon(pattern.category)} {pattern.category.replace('-', ' ')}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{pattern.difficulty}</span>
              <span>{pattern.sizeRange}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{pattern.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">by {pattern.designer}</p>
        {pattern.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{pattern.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(pattern.createdAt).toLocaleDateString()}</span>
          </div>
          {pattern.patternNumber && (
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{pattern.patternNumber}</span>
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
