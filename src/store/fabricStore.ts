import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  yardsTotal: number;
  yardsLeft: number;
  cost: number;
  notes?: string;
  isPinned: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
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

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  materials: ProjectMaterial[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  targetDate?: string;
  notes?: string;
  userId: string;
}

interface FabricStore {
  fabrics: FabricEntry[];
  projects: Project[];
  usageHistory: UsageEntry[];
  isDarkMode: boolean;
  
  // Fabric methods
  addFabric: (fabric: Omit<FabricEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateFabric: (id: string, updates: Partial<FabricEntry>) => void;
  deleteFabric: (id: string) => void;
  togglePin: (id: string) => void;
  recordUsage: (fabricId: string, yardsUsed: number, projectName: string, notes?: string) => void;
  
  // Project methods
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMaterialToProject: (projectId: string, material: Omit<ProjectMaterial, 'id' | 'addedAt'>) => void;
  removeMaterialFromProject: (projectId: string, materialId: string) => void;
  updateProjectMaterial: (projectId: string, materialId: string, updates: Partial<ProjectMaterial>) => void;
  
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
  
  // User-specific data
  getUserFabrics: (userId: string) => FabricEntry[];
  getUserProjects: (userId: string) => Project[];
  getUserUsageHistory: (userId: string) => UsageEntry[];
}

const initialFabrics: FabricEntry[] = [
  {
    id: '1',
    name: 'Soft Cotton Blend',
    type: 'Cotton',
    color: 'Navy Blue',
    yardsTotal: 5,
    yardsLeft: 3.5,
    cost: 12.99,
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-001',
  },
  {
    id: '2',
    name: 'Floral Print',
    type: 'Cotton',
    color: 'Pink',
    yardsTotal: 3,
    yardsLeft: 2.25,
    cost: 8.50,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-001',
  },
  {
    id: '3',
    name: 'Denim Stretch',
    type: 'Denim',
    color: 'Blue',
    yardsTotal: 2,
    yardsLeft: 1.75,
    cost: 15.99,
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-001',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Summer Tote Bag',
    description: 'A spacious tote bag perfect for beach days',
    status: 'in-progress',
    materials: [
      {
        id: '1',
        fabricId: '1',
        fabricName: 'Soft Cotton Blend',
        fabricType: 'Cotton',
        fabricColor: 'Navy Blue',
        yardsUsed: 1.5,
        notes: 'Main body fabric',
        addedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'user-001',
  },
  {
    id: '2',
    name: 'Floral Dress',
    description: 'A beautiful summer dress with floral pattern',
    status: 'planning',
    materials: [
      {
        id: '2',
        fabricId: '2',
        fabricName: 'Floral Print',
        fabricType: 'Cotton',
        fabricColor: 'Pink',
        yardsUsed: 2.25,
        notes: 'Main dress fabric',
        addedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-001',
  }
];

export const useFabricStore = create<FabricStore>()(
  persist(
    (set, get) => ({
      fabrics: initialFabrics,
      projects: initialProjects,
      usageHistory: [],
      isDarkMode: false,
      searchTerm: '',
      filterType: '',
      projectSearchTerm: '',
      projectFilterStatus: '',
      
      // Fabric methods
      addFabric: (fabricData) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        const newFabric: FabricEntry = {
          ...fabricData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: currentUser.id,
        };
        set((state) => ({
          fabrics: [...state.fabrics, newFabric]
        }));
      },
      
      updateFabric: (id, updates) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          fabrics: state.fabrics.map((fabric) =>
            fabric.id === id && fabric.userId === currentUser.id
              ? { ...fabric, ...updates, updatedAt: new Date().toISOString() }
              : fabric
          )
        }));
      },
      
      deleteFabric: (id) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          fabrics: state.fabrics.filter((fabric) => 
            fabric.id !== id || fabric.userId !== currentUser.id
          )
        }));
      },
      
      togglePin: (id) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        set((state) => ({
          fabrics: state.fabrics.map((fabric) =>
            fabric.id === id && fabric.userId === currentUser.id
              ? { ...fabric, isPinned: !fabric.isPinned, updatedAt: new Date().toISOString() }
              : fabric
          )
        }));
      },
      
      recordUsage: (fabricId, yardsUsed, projectName, notes) => {
        const currentUser = useAuthStore.getState().currentUser;
        if (!currentUser) return;
        
        const newUsage: UsageEntry = {
          id: Date.now().toString(),
          fabricId,
          yardsUsed,
          projectName,
          usageDate: new Date().toISOString(),
          notes,
          userId: currentUser.id,
        };
        
        set((state) => ({
          usageHistory: [...state.usageHistory, newUsage],
          fabrics: state.fabrics.map((fabric) =>
            fabric.id === fabricId && fabric.userId === currentUser.id
              ? { 
                  ...fabric, 
                  yardsLeft: Math.max(0, fabric.yardsLeft - yardsUsed),
                  updatedAt: new Date().toISOString()
                }
              : fabric
          )
        }));
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
      
      // UI state methods
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilterType: (type) => set({ filterType: type }),
      setProjectSearchTerm: (term) => set({ projectSearchTerm: term }),
      setProjectFilterStatus: (status) => set({ projectFilterStatus: status }),
      
      // User-specific data methods
      getUserFabrics: (userId) => {
        const { fabrics } = get();
        return fabrics.filter(fabric => fabric.userId === userId);
      },
      
      getUserProjects: (userId) => {
        const { projects } = get();
        return projects.filter(project => project.userId === userId);
      },
      
      getUserUsageHistory: (userId) => {
        const { usageHistory } = get();
        return usageHistory.filter(usage => usage.userId === userId);
      },
    }),
    {
      name: 'fabric-store',
    }
  )
);