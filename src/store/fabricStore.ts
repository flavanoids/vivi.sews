import { create } from 'zustand';
import { apiService } from '../services/api.js';
import { useAuthStore } from './authStore';

export interface UsageEntry {
  id: string;
  fabricId: string;
  projectId?: string;
  yardsUsed: number;
  projectName: string;
  usageDate: string;
  notes?: string;
  userId: string;
}

export interface FabricEntry {
  id: string;
  name: string;
  type: string;
  color: string;
  total_yards: number;
  cost_per_yard?: number;
  total_cost?: number;
  notes?: string;
  is_pinned: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ProjectMaterial {
  id: string;
  fabricId: string;
  fabricName: string;
  fabricType: string;
  fabricColor: string;
  yardsUsed: number;
  notes?: string;
  addedAt: string;
}

export interface ProjectPattern {
  id: string;
  patternId: string;
  patternName: string;
  patternDesigner: string;
  patternCategory: Pattern['category'];
  patternDifficulty: Pattern['difficulty'];
  addedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  materials: ProjectMaterial[];
  patterns: ProjectPattern[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  targetDate?: string;
  notes?: string;
  userId: string;
}

export interface Pattern {
  id: string;
  name: string;
  description?: string;
  designer: string;
  patternNumber?: string;
  category: 'dresses' | 'tops' | 'bottoms' | 'outerwear' | 'accessories' | 'home-decor' | 'bags';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  sizeRange: string;
  fabricRequirements?: string;
  notions?: string;
  instructions?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  userId: string;
}

interface FabricStore {
  fabrics: FabricEntry[];
  projects: Project[];
  patterns: Pattern[];
  usageHistory: UsageEntry[];
  isDarkMode: boolean;
  
  // Fabric methods
  addFabric: (fabric: Omit<FabricEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<{ success: boolean; message?: string }>;
  updateFabric: (id: string, updates: Partial<FabricEntry>) => Promise<{ success: boolean; message?: string }>;
  deleteFabric: (id: string) => Promise<{ success: boolean; message?: string }>;
  togglePin: (id: string) => Promise<{ success: boolean; message?: string }>;
  recordUsage: (fabricId: string, yardsUsed: number, projectName: string, notes?: string) => Promise<{ success: boolean; message?: string }>;
  loadFabrics: () => Promise<{ success: boolean; message?: string }>;
  
  // Project methods
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMaterialToProject: (projectId: string, material: Omit<ProjectMaterial, 'id' | 'addedAt'>) => void;
  removeMaterialFromProject: (projectId: string, materialId: string) => void;
  updateProjectMaterial: (projectId: string, materialId: string, updates: Partial<ProjectMaterial>) => void;
  addPatternToProject: (projectId: string, pattern: Omit<ProjectPattern, 'id' | 'addedAt'>) => void;
  removePatternFromProject: (projectId: string, patternId: string) => void;
  
  // Pattern methods
  addPattern: (pattern: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updatePattern: (id: string, updates: Partial<Pattern>) => void;
  deletePattern: (id: string) => void;
  togglePatternPin: (id: string) => void;
  
  // UI state
  toggleDarkMode: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  projectSearchTerm: string;
  setProjectSearchTerm: (term: string) => void;
  projectFilterStatus: string;
  setProjectFilterStatus: (status: string) => void;
  patternSearchTerm: string;
  setPatternSearchTerm: (term: string) => void;
  patternFilterCategory: string;
  setPatternFilterCategory: (category: string) => void;
  
  // User-specific data
  getUserFabrics: (userId: string) => FabricEntry[];
  getUserProjects: (userId: string) => Project[];
  getUserPatterns: (userId: string) => Pattern[];
  getUserUsageHistory: (userId: string) => UsageEntry[];
}

// const initialFabrics: FabricEntry[] = [
//   {
//     id: '1',
//     name: 'Soft Cotton Blend',
//     type: 'cotton',
//     color: 'Navy Blue',
//     yardsTotal: 5,
//     yardsLeft: 3.5,
//     cost: 12.99,
//     isPinned: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     userId: 'user-001',
//   },
//   {
//     id: '2',
//     name: 'Floral Print',
//     type: 'cotton',
//     color: 'Pink',
//     yardsTotal: 3,
//     yardsLeft: 2.25,
//     cost: 8.50,
//     isPinned: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     userId: 'user-001',
//   },
//   {
//     id: '3',
//     name: 'Denim Stretch',
//     type: 'denim',
//     color: 'Blue',
//     yardsTotal: 2,
//     yardsLeft: 1.75,
//     cost: 15.99,
//     isPinned: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     userId: 'user-001',
//   },
// ];

// const initialProjects: Project[] = [
//   {
//     id: '1',
//     name: 'Summer Tote Bag',
//     description: 'A spacious tote bag perfect for beach days',
//     status: 'in-progress',
//     materials: [
//       {
//         id: '1',
//         fabricId: '1',
//         fabricName: 'Soft Cotton Blend',
//         fabricType: 'cotton',
//         fabricColor: 'Navy Blue',
//         yardsUsed: 1.5,
//         notes: 'Main body fabric',
//         addedAt: new Date().toISOString(),
//       }
//     ],
//     patterns: [
//       {
//         id: '1',
//         patternId: '1',
//         patternName: 'Classic A-Line Dress',
//         patternDesigner: 'Simplicity',
//         patternCategory: 'dresses',
//         patternDifficulty: 'beginner',
//         addedAt: new Date().toISOString(),
//       }
//     ],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//     userId: 'user-001',
//   },
//   {
//     id: '2',
//     name: 'Floral Dress',
//     description: 'A beautiful summer dress with floral pattern',
//     status: 'planning',
//     materials: [
//       {
//         id: '2',
//         fabricId: '2',
//         fabricName: 'Floral Print',
//         fabricType: 'cotton',
//         fabricColor: 'Pink',
//         yardsUsed: 2.25,
//         notes: 'Main dress fabric',
//         addedAt: new Date().toISOString(),
//       }
//     ],
//     patterns: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     userId: 'user-001',
//   }
// ];

// const initialPatterns: Pattern[] = [
//   {
//     id: '1',
//     name: 'Classic A-Line Dress',
//     description: 'A timeless A-line dress pattern perfect for beginners',
//     designer: 'Simplicity',
//     patternNumber: 'S1234',
//     category: 'dresses',
//     difficulty: 'beginner',
//     sizeRange: 'XS-XXL (6-20)',
//     fabricRequirements: '2-3 yards of medium weight fabric',
//     notions: 'Zipper, thread, interfacing',
//     isPinned: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     userId: 'user-001',
//   },
//   {
//     id: '2',
//     name: 'Relaxed Fit Blouse',
//     description: 'A comfortable blouse with a relaxed fit',
//     designer: 'McCalls',
//     patternNumber: 'M5678',
//     category: 'tops',
//     difficulty: 'intermediate',
//     sizeRange: 'S-XL (8-16)',
//     fabricRequirements: '1.5-2 yards of lightweight fabric',
//     notions: 'Buttons, thread, interfacing',
//     isPinned: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     userId: 'user-001',
//   }
// ];

export const useFabricStore = create<FabricStore>()((set, get) => ({
  fabrics: [],
  projects: [],
  patterns: [],
  usageHistory: [],
  isDarkMode: false,
  searchTerm: '',
  filterType: '',
  projectSearchTerm: '',
  projectFilterStatus: '',
  patternSearchTerm: '',
  patternFilterCategory: '',
      
      // Fabric methods
      addFabric: async (fabricData) => {
        try {
          console.log('Fabric store: Creating fabric with data:', fabricData);
          const response = await apiService.createFabric(fabricData);
          console.log('Fabric store: API response:', response);
          set((state) => ({
            fabrics: [...state.fabrics, response.fabric]
          }));
          return { success: true, message: response.message };
        } catch (error) {
          console.error('Fabric store: Error creating fabric:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to add fabric';
          return { success: false, message: errorMessage };
        }
      },
      
      updateFabric: async (id, updates) => {
        try {
          const response = await apiService.updateFabric(id, updates);
          set((state) => ({
            fabrics: state.fabrics.map((fabric) =>
              fabric.id === id ? response.fabric : fabric
            )
          }));
          return { success: true, message: response.message };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update fabric';
          return { success: false, message: errorMessage };
        }
      },
      
      deleteFabric: async (id) => {
        try {
          await apiService.deleteFabric(id);
          set((state) => ({
            fabrics: state.fabrics.filter((fabric) => fabric.id !== id)
          }));
          return { success: true, message: 'Fabric deleted successfully' };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete fabric';
          return { success: false, message: errorMessage };
        }
      },
      
      togglePin: async (id) => {
        try {
          const response = await apiService.toggleFabricPin(id);
          set((state) => ({
            fabrics: state.fabrics.map((fabric) =>
              fabric.id === id ? { ...fabric, is_pinned: response.is_pinned } : fabric
            )
          }));
          return { success: true, message: response.message };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to toggle pin';
          return { success: false, message: errorMessage };
        }
      },
      
      recordUsage: async (fabricId, yardsUsed, projectName, notes) => {
        try {
          const response = await apiService.recordFabricUsage(fabricId, {
            yards_used: yardsUsed,
            project_name: projectName,
            notes
          });
          
          set((state) => ({
            fabrics: state.fabrics.map((fabric) =>
              fabric.id === fabricId
                ? { ...fabric, total_yards: response.yards_left }
                : fabric
            )
          }));
          
          return { success: true, message: response.message };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to record usage';
          return { success: false, message: errorMessage };
        }
      },
      
      // Project methods
      addProject: (projectData) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: currentUser.id,
        };
        set((state) => ({
          projects: [...state.projects, newProject]
        }));
      },
      
      updateProject: (id, updates) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id && project.userId === currentUser.id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          )
        }));
      },
      
      deleteProject: (id) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          projects: state.projects.filter((project) => 
            project.id !== id || project.userId !== currentUser.id
          )
        }));
      },
      
      addMaterialToProject: (projectId, materialData) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        const newMaterial: ProjectMaterial = {
          ...materialData,
          id: Date.now().toString(),
          addedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && project.userId === currentUser.id
              ? { 
                  ...project, 
                  materials: [...project.materials, newMaterial],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      removeMaterialFromProject: (projectId, materialId) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && project.userId === currentUser.id
              ? { 
                  ...project, 
                  materials: project.materials.filter(m => m.id !== materialId),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      updateProjectMaterial: (projectId, materialId, updates) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && project.userId === currentUser.id
              ? { 
                  ...project, 
                  materials: project.materials.map(material =>
                    material.id === materialId
                      ? { ...material, ...updates }
                      : material
                  ),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      addPatternToProject: (projectId, patternData) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        const newPattern: ProjectPattern = {
          ...patternData,
          id: Date.now().toString(),
          addedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && project.userId === currentUser.id
              ? { 
                  ...project, 
                  patterns: [...project.patterns, newPattern],
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      removePatternFromProject: (projectId, patternId) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && project.userId === currentUser.id
              ? { 
                  ...project, 
                  patterns: project.patterns.filter(p => p.id !== patternId),
                  updatedAt: new Date().toISOString()
                }
              : project
          )
        }));
      },
      
      // Pattern methods
      addPattern: (patternData) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        const newPattern: Pattern = {
          ...patternData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: currentUser.id,
        };
        set((state) => ({
          patterns: [...state.patterns, newPattern]
        }));
      },
      
      updatePattern: (id, updates) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          patterns: state.patterns.map((pattern) =>
            pattern.id === id && pattern.userId === currentUser.id
              ? { ...pattern, ...updates, updatedAt: new Date().toISOString() }
              : pattern
          )
        }));
      },
      
      deletePattern: (id) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          patterns: state.patterns.filter((pattern) => 
            pattern.id !== id || pattern.userId !== currentUser.id
          )
        }));
      },
      
      togglePatternPin: (id) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          patterns: state.patterns.map((pattern) =>
            pattern.id === id && pattern.userId === currentUser.id
              ? { ...pattern, isPinned: !pattern.isPinned, updatedAt: new Date().toISOString() }
              : pattern
          )
        }));
      },
      
      // UI state methods
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilterType: (type) => set({ filterType: type }),
      setProjectSearchTerm: (term) => set({ projectSearchTerm: term }),
      setProjectFilterStatus: (status) => set({ projectFilterStatus: status }),
      setPatternSearchTerm: (term) => set({ patternSearchTerm: term }),
      setPatternFilterCategory: (category) => set({ patternFilterCategory: category }),
      
      // Load data methods
      loadFabrics: async () => {
        try {
          const response = await apiService.getFabrics();
          set({ fabrics: response.fabrics });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load fabrics';
          return { success: false, message: errorMessage };
        }
      },
      
      loadUsageHistory: async () => {
        try {
          const response = await apiService.getUsageHistory();
          set({ usageHistory: response.usage_history });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load usage history';
          return { success: false, message: errorMessage };
        }
      },
      
      // User-specific data methods
      getUserFabrics: (userId: string) => {
        return get().fabrics.filter(fabric => fabric.user_id === userId);
      },
      
      getUserProjects: (userId: string) => {
        return get().projects.filter(project => project.userId === userId);
      },
      
      getUserPatterns: (userId: string) => {
        return get().patterns.filter(pattern => pattern.userId === userId);
      },
      
      getUserUsageHistory: (userId: string) => {
        return get().usageHistory.filter(usage => usage.userId === userId);
      },
    })
  )
