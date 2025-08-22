import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Heart, Scissors, Moon, Sun, FolderOpen, User, Shield, LogOut, FileText, Sparkles, Palette, Zap } from 'lucide-react';
import { useFabricStore, type FabricEntry } from '../store/fabricStore';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';
import UsageDialog from '../components/UsageDialog';
import FabricCardMenu from '../components/FabricCardMenu';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import LanguageSelector from '../components/LanguageSelector';
import AddFabricDialog from '../components/AddFabricDialog';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useFabricStore();
  const { t } = useLanguage();
  const { 
    fabrics,
    searchTerm, 
    setSearchTerm,
    filterType,
    setFilterType,
    togglePin,
    deleteFabric,
  } = useFabricStore();
  
  const [usageDialogFabric, setUsageDialogFabric] = useState<FabricEntry | null>(null);
  const [deleteDialogFabric, setDeleteDialogFabric] = useState<FabricEntry | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddFabricDialog, setShowAddFabricDialog] = useState(false);

  // Filter fabrics
  const filteredFabrics = fabrics.filter(fabric => {
    const matchesSearch = 
      fabric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fabric.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fabric.color?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterType || fabric.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const pinnedFabrics = filteredFabrics.filter(f => f.isPinned);
  const otherFabrics = filteredFabrics.filter(f => !f.isPinned);

  const handleDeleteConfirm = () => {
    if (deleteDialogFabric) {
      deleteFabric(deleteDialogFabric.id);
      setDeleteDialogFabric(null);
    }
  };

  const handleEdit = (fabric: FabricEntry) => {
    navigate(`/edit/${fabric.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark' : ''}`}>
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-green-200/20 to-teal-200/20 dark:from-green-800/10 dark:to-teal-800/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-1/4 left-1/4 text-purple-300/30 dark:text-purple-600/20 animate-bounce" style={{animationDelay: '0.5s'}}>
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute top-1/3 right-1/4 text-blue-300/30 dark:text-blue-600/20 animate-bounce" style={{animationDelay: '1.5s'}}>
          <Palette className="w-6 h-6" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-green-300/30 dark:text-green-600/20 animate-bounce" style={{animationDelay: '2.5s'}}>
          <Zap className="w-7 h-7" />
        </div>
      </div>

      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4 relative z-10`}>
        <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-6 animate-slide-in-up">
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text-animated mb-2">
              vivi.sews
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Fabric Management System
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{t('dashboard.title')}</h2>
              {currentUser && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dashboard.welcome')}, {currentUser.username}!
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="User menu"
                >
                  <User className="w-5 h-5" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      {t('navigation.profile')}
                    </Link>
                    
                    <div className="px-4 py-2">
                      <LanguageSelector />
                    </div>
                    
                    {currentUser?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="w-4 h-4" />
                        {t('navigation.admin')}
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('navigation.logout')}
                    </button>
                  </div>
                )}
              </div>
              
              <Link 
                to="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <FolderOpen className="w-4 h-4" />
                {t('navigation.projects')}
              </Link>
              <Link 
                to="/patterns"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                Patterns
              </Link>
              <button 
                onClick={() => setShowAddFabricDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('fabrics.addFabric')}
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('dashboard.searchFabrics')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-shrink-0 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">{t('dashboard.allTypes')}</option>
              <option value="cotton">{t('fabrics.fabricTypes.cotton')}</option>
              <option value="linen">{t('fabrics.fabricTypes.linen')}</option>
              <option value="silk">{t('fabrics.fabricTypes.silk')}</option>
              <option value="wool">{t('fabrics.fabricTypes.wool')}</option>
              <option value="polyester">{t('fabrics.fabricTypes.polyester')}</option>
              <option value="denim">{t('fabrics.fabricTypes.denim')}</option>
              <option value="fleece">{t('fabrics.fabricTypes.fleece')}</option>
              <option value="knit">{t('fabrics.fabricTypes.knit')}</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {pinnedFabrics.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              {t('dashboard.pinnedFabrics')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {pinnedFabrics.map((fabric, index) => (
                <div key={fabric.id} className="grid-item animate-fade-in-scale" style={{animationDelay: `${index * 0.1}s`}}>
                  <FabricCard 
                    fabric={fabric} 
                    onTogglePin={togglePin}
                    onUseFabric={() => setUsageDialogFabric(fabric)}
                    onEdit={() => handleEdit(fabric)}
                    onDelete={() => setDeleteDialogFabric(fabric)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('dashboard.allFabrics')} ({otherFabrics.length})
          </h2>
          
          {otherFabrics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {otherFabrics.map((fabric, index) => (
                <div key={fabric.id} className="grid-item animate-fade-in-scale" style={{animationDelay: `${index * 0.1}s`}}>
                  <FabricCard 
                    fabric={fabric} 
                    onTogglePin={togglePin}
                    onUseFabric={() => setUsageDialogFabric(fabric)}
                    onEdit={() => handleEdit(fabric)}
                    onDelete={() => setDeleteDialogFabric(fabric)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
        
        <UsageDialog
          fabric={usageDialogFabric!}
          isOpen={!!usageDialogFabric}
          onClose={() => setUsageDialogFabric(null)}
        />
        
        <DeleteConfirmDialog
          fabric={deleteDialogFabric}
          project={null}
          pattern={null}
          isOpen={!!deleteDialogFabric}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogFabric(null)}
        />
        
        <AddFabricDialog
          isOpen={showAddFabricDialog}
          onClose={() => setShowAddFabricDialog(false)}
        />
        </div>
      </div>
      

    </div>
  );
}

interface FabricCardProps {
  fabric: FabricEntry;
  onTogglePin: (id: string) => void;
  onUseFabric: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function FabricCard({ fabric, onTogglePin, onUseFabric, onEdit, onDelete }: FabricCardProps) {
  // Helper function to capitalize fabric type for display
  const capitalizeFabricType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-600/50">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 relative overflow-hidden">
        {fabric.imageUrl ? (
          <img 
            src={fabric.imageUrl} 
            alt={fabric.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400 group-hover:text-purple-400 transition-colors">
              <div className="text-4xl mb-2 animate-pulse">🧵</div>
              <div className="text-sm">No image</div>
            </div>
          </div>
        )}
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onTogglePin(fabric.id)}
            className={`p-2 rounded-full backdrop-blur-sm ${
              fabric.isPinned 
                ? 'bg-red-100/90 dark:bg-red-900/50 text-red-500 hover:bg-red-200/90 dark:hover:bg-red-900/70' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-500'
            } transition-all duration-200 hover:scale-110`}
          >
            <Heart className={`w-4 h-4 ${fabric.isPinned ? 'fill-current' : ''}`} />
          </button>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110">
            <FabricCardMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
        
        {/* Fabric type badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">
            {capitalizeFabricType(fabric.type)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {fabric.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{capitalizeFabricType(fabric.type)} • {fabric.color}</p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            {fabric.yardsLeft} yards left
          </span>
          <span className="font-semibold text-green-600 dark:text-green-400">${fabric.cost.toFixed(2)}</span>
        </div>
        
        <button
          onClick={onUseFabric}
          className="w-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 text-purple-700 dark:text-purple-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm font-medium hover:shadow-md hover:scale-[1.02] border border-purple-200/50 dark:border-purple-700/50"
        >
          <Scissors className="w-4 h-4" />
          Use Fabric
        </button>
      </div>
    </div>
  );
}

// Enhanced empty state component
function EmptyState() {
  
  return (
    <div className="text-center py-16 px-4 animate-slide-in-up">
      {/* Decorative background elements for empty state */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-8xl mb-4 animate-float" style={{animationDelay: '0.5s'}}>
            🧵
          </div>
          <div className="text-6xl animate-float" style={{animationDelay: '1s'}}>
            ✂️
          </div>
        </div>
      </div>
      

      
      {/* Quick tips */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300 animate-fade-in-scale" style={{animationDelay: '0.2s'}}>
          <div className="text-2xl mb-2 animate-float">📸</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Take Photos</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Capture your fabric textures and colors</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300 animate-fade-in-scale" style={{animationDelay: '0.4s'}}>
          <div className="text-2xl mb-2 animate-float" style={{animationDelay: '0.5s'}}>🏷️</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Track Details</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Record type, color, and yardage</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300 animate-fade-in-scale" style={{animationDelay: '0.6s'}}>
          <div className="text-2xl mb-2 animate-float" style={{animationDelay: '1s'}}>💡</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Get Inspired</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Plan your next sewing project</p>
        </div>
      </div>
    </div>
  );
}