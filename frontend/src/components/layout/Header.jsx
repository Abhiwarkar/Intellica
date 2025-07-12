import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={toggleSidebar}
              className="px-4 border-r text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              {sidebarOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <div className="flex-shrink-0 flex items-center">
              <span className="h-8 w-auto text-xl font-bold text-primary-600">Analytics Dashboard</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;