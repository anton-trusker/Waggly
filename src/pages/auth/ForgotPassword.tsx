import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Success Message */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md text-center">
            {/* Logo Header */}
            <div className="flex items-center justify-center mb-8">
              <img 
                src="/logo.png" 
                alt="Pawzly" 
                className="w-8 h-8 mr-3 rounded-full"
              />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                pawzly
              </span>
            </div>

            {/* Success Icon */}
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Check your email
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We've sent a password reset link to {email}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Click the link in the email to reset your password. The link expires in 24 hours.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2"
              >
                Try a different email
              </button>
              <Link
                to="/auth/login"
                className="w-full inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Hero Image */}
        <div className="hidden lg:block lg:flex-1 relative">
          <img
            src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20sleeping%20dog%20in%20cozy%20bed%20with%20soft%20natural%20lighting%20professional%20photography%20style%20high%20quality%20calm%20serene%20atmosphere&image_size=portrait_4_3"
            alt="Peaceful sleeping dog"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Password Reset Sent
            </h2>
            <p className="text-lg opacity-90">
              Check your email to continue
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo Header */}
          <div className="flex items-center mb-8">
            <img 
              src="/logo.png" 
              alt="Pawzly" 
              className="w-8 h-8 mr-3 rounded-full"
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              pawzly
            </span>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset your password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send reset link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <img
          src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20sleeping%20dog%20in%20cozy%20bed%20with%20soft%20natural%20lighting%20professional%20photography%20style%20high%20quality%20calm%20serene%20atmosphere&image_size=portrait_4_3"
          alt="Peaceful sleeping dog"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Forgot Password?
          </h2>
          <p className="text-lg opacity-90">
            No worries, we'll help you get back in
          </p>
        </div>
      </div>
    </div>
  )
}