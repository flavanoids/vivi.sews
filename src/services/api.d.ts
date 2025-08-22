export interface ApiService {
  setAuthToken: (token: string | null) => void;
  login: (credentials: { emailOrUsername: string; password: string }) => Promise<any>;
  signup: (data: { email: string; username: string; password: string }) => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
  getPendingUsers: () => Promise<any>;
  approveUser: (userId: string) => Promise<any>;
  rejectUser: (userId: string) => Promise<any>;
  createFabric: (fabric: any) => Promise<any>;
  updateFabric: (id: string, updates: any) => Promise<any>;
  deleteFabric: (id: string) => Promise<any>;
  toggleFabricPin: (id: string) => Promise<any>;
  recordFabricUsage: (fabricId: string, usage: any) => Promise<any>;
  getFabrics: () => Promise<any>;
  getUsageHistory: () => Promise<any>;
  
  // Upload endpoints
  uploadFabricImage: (formData: FormData) => Promise<any>;
  uploadProjectImage: (formData: FormData) => Promise<any>;
  deleteImage: (filename: string, type: string) => Promise<any>;
}

export declare const apiService: ApiService;
