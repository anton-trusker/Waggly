import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons'

interface PasswordStrength {
  score: number
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    requirements: {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
    },
  })

  const { signUp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (password) {
      const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      }

      const score = Object.values(requirements).filter(Boolean).length
      setPasswordStrength({ score, requirements })
    } else {
      setPasswordStrength({
        score: 0,
        requirements: {
          minLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false,
        },
      })
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: 'google' | 'apple') => {
    // Social signup is handled by the SocialLoginButtons component
    console.log(`Social signup initiated with ${provider}`)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'text-red-500 bg-red-50 dark:bg-red-900/20'
    if (passwordStrength.score <= 3) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-green-500 bg-green-50 dark:bg-green-900/20'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak'
    if (passwordStrength.score <= 3) return 'Fair'
    if (passwordStrength.score <= 4) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Signup Form */}
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
              Create your account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of pet owners who trust Pawzly
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Signup Form */}
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

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Password strength
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  
                  {/* Strength Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2 ? 'bg-red-500 w-1/3' :
                        passwordStrength.score <= 3 ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.minLength ? (
                        <Check className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400 mr-1" />
                      )}
                      <span className={passwordStrength.requirements.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.hasUppercase ? (
                        <Check className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400 mr-1" />
                      )}
                      <span className={passwordStrength.requirements.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.hasLowercase ? (
                        <Check className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400 mr-1" />
                      )}
                      <span className={passwordStrength.requirements.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                        Lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.hasNumber ? (
                        <Check className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400 mr-1" />
                      )}
                      <span className={passwordStrength.requirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                        Number
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.hasSpecial ? (
                        <Check className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <X className="w-3 h-3 text-gray-400 mr-1" />
                      )}
                      <span className={passwordStrength.requirements.hasSpecial ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                        Special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password && password === confirmPassword && (
                <div className="mt-1 flex items-center text-xs text-green-600 dark:text-green-400">
                  <Check className="w-3 h-3 mr-1" />
                  Passwords match
                </div>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading || passwordStrength.score < 3}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Social Signup */}
          <SocialLoginButtons isLoading={isLoading} onSocialLogin={handleSocialSignup} />

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
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
          src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20fluffy%20cat%20sitting%20in%20modern%20living%20room%20with%20soft%20natural%20lighting%20professional%20photography%20style%20high%20quality%20warm%20inviting%20atmosphere&image_size=portrait_4_3"
          alt="Cute cat in cozy home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Join Pawzly Today
          </h2>
          <p className="text-lg opacity-90">
            Connect with trusted pet care professionals
          </p>
        </div>
      </div>
    </div>
  )
}