import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Heart, Scissors, Moon, Sun, FolderOpen, User, Shield, LogOut, FileText } from 'lucide-react';
import { useFabricStore, type FabricEntry } from '../store/fabricStore';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';
import UsageDialog from '../components/UsageDialog';
import FabricCardMenu from '../components/FabricCardMenu';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import LanguageSelector from '../components/LanguageSelector';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useFabricStore();
  const { t } = useLanguage();
  const { 
    getUserFabrics,
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

  // Get user-specific fabrics
  const userFabrics = currentUser ? getUserFabrics(currentUser.id) : [];

  const filteredFabrics = userFabrics.filter(fabric => {
    const matchesSearch = 
      fabric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fabric.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fabric.color.toLowerCase().includes(searchTerm.toLowerCase());
    
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
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4`}>
        <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
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
                    console.log('User menu button clicked');
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
                        console.log('Logout button clicked');
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
              <Link 
                to="/add"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('fabrics.addFabric')}
              </Link>
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
              <option value="Cotton">{t('fabrics.fabricTypes.cotton')}</option>
              <option value="Linen">{t('fabrics.fabricTypes.linen')}</option>
              <option value="Silk">{t('fabrics.fabricTypes.silk')}</option>
              <option value="Wool">{t('fabrics.fabricTypes.wool')}</option>
              <option value="Polyester">{t('fabrics.fabricTypes.polyester')}</option>
              <option value="Denim">{t('fabrics.fabricTypes.denim')}</option>
              <option value="Fleece">{t('fabrics.fabricTypes.fleece')}</option>
              <option value="Knit">{t('fabrics.fabricTypes.knit')}</option>
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
              {pinnedFabrics.map((fabric) => (
                <FabricCard 
                  key={fabric.id} 
                  fabric={fabric} 
                  onTogglePin={togglePin}
                  onUseFabric={() => setUsageDialogFabric(fabric)}
                  onEdit={() => handleEdit(fabric)}
                  onDelete={() => setDeleteDialogFabric(fabric)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t('dashboard.allFabrics')} ({otherFabrics.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {otherFabrics.map((fabric) => (
              <FabricCard 
                key={fabric.id} 
                fabric={fabric} 
                onTogglePin={togglePin}
                onUseFabric={() => setUsageDialogFabric(fabric)}
                onEdit={() => handleEdit(fabric)}
                onDelete={() => setDeleteDialogFabric(fabric)}
              />
            ))}
          </div>
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 relative">
        {fabric.imageUrl ? (
          <img src={fabric.imageUrl} alt={fabric.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🧵</div>
            <div className="text-sm">No image</div>
          </div>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onTogglePin(fabric.id)}
            className={`p-2 rounded-full ${
              fabric.isPinned 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50' 
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-500'
            } transition-colors`}
          >
            <Heart className={`w-4 h-4 ${fabric.isPinned ? 'fill-current' : ''}`} />
          </button>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
            <FabricCardMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{fabric.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{fabric.type} • {fabric.color}</p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-600 dark:text-gray-400">{fabric.yardsLeft} yards left</span>
          <span className="font-semibold text-green-600 dark:text-green-400">${fabric.cost.toFixed(2)}</span>
        </div>
        
        <button
          onClick={onUseFabric}
          className="w-full bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
        >
          <Scissors className="w-4 h-4" />
          Use Fabric
        </button>
      </div>
    </div>
  );
}