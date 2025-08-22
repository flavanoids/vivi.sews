// Test script for AdminDashboard component
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');

// Mock the required dependencies
const mockNavigate = jest.fn();
const mockUseAuthStore = {
  currentUser: {
    id: 'admin-1',
    email: 'admin@test.com',
    username: 'ADMIN',
    role: 'admin',
    status: 'active'
  },
  isAdmin: () => true,
  getPendingUsers: async () => ({ success: true, data: [] }),
  approveUser: async () => ({ success: true, message: 'User approved' }),
  rejectUser: async () => ({ success: true, message: 'User rejected' })
};

const mockUseLanguage = {
  t: (key) => key
};

// Mock the hooks
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../src/store/authStore', () => ({
  useAuthStore: () => mockUseAuthStore
}));

jest.mock('../src/contexts/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage
}));

// Test the AdminDashboard component
describe('AdminDashboard', () => {
  test('should render without crashing', () => {
    const AdminDashboard = require('../src/pages/AdminDashboard.tsx').default;
    
    // This should not throw an error
    expect(() => {
      renderToString(createElement(AdminDashboard));
    }).not.toThrow();
  });
});

console.log('AdminDashboard test completed successfully!');
