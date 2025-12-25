import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, Settings } from 'lucide-react'

export function Dashboard() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/logo.png" alt="Pawzly" className="w-8 h-8 mr-3 rounded-full" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pawzly Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've successfully logged in to Pawzly. Your session is active.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Remember Me Status</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {localStorage.getItem('remember_me') === 'true' ? 'Active' : 'Not active'}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Session Status</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Active</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">User Email</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}