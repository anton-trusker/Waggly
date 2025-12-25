import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  heroImage: string
  heroAlt: string
  heroTitle: string
  heroSubtitle: string
}

export function AuthLayout({ children, heroImage, heroAlt, heroTitle, heroSubtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 sm:px-8 sm:py-12 bg-white dark:bg-gray-900 min-h-screen">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Hero Image (Desktop only) */}
      <div className="hidden lg:block lg:flex-1 relative">
        <img
          src={heroImage}
          alt={heroAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-2xl xl:text-3xl font-bold mb-2">
            {heroTitle}
          </h2>
          <p className="text-lg opacity-90">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="lg:hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 px-6 py-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {heroTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {heroSubtitle}
          </p>
        </div>
      </div>
    </div>
  )
}