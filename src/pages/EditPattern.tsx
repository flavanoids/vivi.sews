import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import { useFabricStore, type Pattern } from '../store/fabricStore';
import { useAuthStore } from '../store/authStore';

export default function EditPattern() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { } = useAuthStore();
  const { patterns, updatePattern, isDarkMode } = useFabricStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const pattern = patterns.find(p => p.id === id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    designer: '',
    patternNumber: '',
    category: 'dresses' as Pattern['category'],
    difficulty: 'beginner' as Pattern['difficulty'],
    sizeRange: '',
    fabricRequirements: '',
    notions: '',
    instructions: '',
    notes: ''
  });
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load pattern data when component mounts
  useEffect(() => {
    if (pattern) {
      setFormData({
        name: pattern.name,
        description: pattern.description || '',
        designer: pattern.designer,
        patternNumber: pattern.patternNumber || '',
        category: pattern.category,
        difficulty: pattern.difficulty,
        sizeRange: pattern.sizeRange,
        fabricRequirements: pattern.fabricRequirements || '',
        notions: pattern.notions || '',
        instructions: pattern.instructions || '',
        notes: pattern.notes || ''
      });
      setThumbnailUrl(pattern.thumbnailUrl || '');
    }
  }, [pattern]);

  if (!pattern) {
    return (
      <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pattern Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The pattern you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/patterns')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Patterns
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, pdfFile: 'Please select a PDF file' }));
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setErrors(prev => ({ ...prev, pdfFile: 'File size must be less than 50MB' }));
        return;
      }
      
      setPdfFile(file);
      setErrors(prev => ({ ...prev, pdfFile: '' }));
      
      // Generate thumbnail from first page of PDF
      generateThumbnail(file);
    }
  };

  const generateThumbnail = async (file: File) => {
    setIsUploading(true);
    try {
      // In a real app, you would upload the PDF to a server and generate thumbnail
      // For now, we'll create a placeholder thumbnail
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 300;
        canvas.height = 400;
        
        // Create a placeholder thumbnail
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, 300, 400);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PDF Pattern', 150, 200);
        ctx.font = '12px Arial';
        ctx.fillText(file.name, 150, 220);
        
        const thumbnailUrl = canvas.toDataURL();
        setThumbnailUrl(thumbnailUrl);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, pdfFile: 'Error generating thumbnail' }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Pattern name is required';
    }
    
    if (!formData.designer.trim()) {
      newErrors.designer = 'Designer is required';
    }
    
    if (!formData.sizeRange.trim()) {
      newErrors.sizeRange = 'Size range is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // In a real app, you would upload the PDF to a server if a new file is selected
      // For now, we'll keep the existing PDF URL or create a mock one
      const pdfUrl = pdfFile ? URL.createObjectURL(pdfFile) : pattern.pdfUrl;
      
      const updates = {
        ...formData,
        pdfUrl,
        thumbnailUrl: thumbnailUrl || pattern.thumbnailUrl
      };
      
      updatePattern(pattern.id, updates);
      navigate(`/patterns/${pattern.id}`);
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Error updating pattern' }));
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate(`/patterns/${pattern.id}`)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Pattern</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pattern Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g., Classic A-Line Dress"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="designer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Designer *
                  </label>
                  <input
                    type="text"
                    id="designer"
                    name="designer"
                    value={formData.designer}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.designer ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g., Simplicity, McCalls, Vogue"
                  />
                  {errors.designer && <p className="text-red-500 text-sm mt-1">{errors.designer}</p>}
                </div>

                <div>
                  <label htmlFor="patternNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pattern Number
                  </label>
                  <input
                    type="text"
                    id="patternNumber"
                    name="patternNumber"
                    value={formData.patternNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., S1234, M5678"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="dresses">Dresses</option>
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="home-decor">Home Decor</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="sizeRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size Range *
                  </label>
                  <input
                    type="text"
                    id="sizeRange"
                    name="sizeRange"
                    value={formData.sizeRange}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.sizeRange ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g., XS-XXL (6-20), S-XL (8-16)"
                  />
                  {errors.sizeRange && <p className="text-red-500 text-sm mt-1">{errors.sizeRange}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="fabricRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fabric Requirements
                  </label>
                  <textarea
                    id="fabricRequirements"
                    name="fabricRequirements"
                    value={formData.fabricRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 2-3 yards of medium weight fabric"
                  />
                </div>

                <div>
                  <label htmlFor="notions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notions
                  </label>
                  <textarea
                    id="notions"
                    name="notions"
                    value={formData.notions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Zipper, thread, interfacing, buttons"
                  />
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any special instructions or notes"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Additional notes or personal observations"
                  />
                </div>
              </div>
            </div>

            {/* PDF Upload Section */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pattern PDF (Optional - only upload if you want to replace the current file)
                </label>
                <div className="space-y-4">
                  {!pdfFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Click to upload a new PDF or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        PDF files only, max 50MB
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{pdfFile.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {thumbnailUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail Preview:</p>
                      <img 
                        src={thumbnailUrl} 
                        alt="Pattern thumbnail" 
                        className="w-32 h-40 object-cover border border-gray-200 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                  )}
                  
                  {errors.pdfFile && <p className="text-red-500 text-sm">{errors.pdfFile}</p>}
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/patterns/${pattern.id}`)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Update Pattern'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
