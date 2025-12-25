import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UseRememberMeReturn {
  rememberMe: boolean
  setRememberMe: (value: boolean) => void
  isSessionPersistent: boolean
  clearPersistentSession: () => void
}

export function useRememberMe(): UseRememberMeReturn {
  const [rememberMe, setRememberMe] = useState(false)
  const [isSessionPersistent, setIsSessionPersistent] = useState(false)

  useEffect(() => {
    // Check if user previously selected remember me
    const storedPreference = localStorage.getItem('remember_me')
    setRememberMe(storedPreference === 'true')
    setIsSessionPersistent(storedPreference === 'true')

    // Monitor auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsSessionPersistent(false)
        localStorage.removeItem('remember_me')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSetRememberMe = (value: boolean) => {
    setRememberMe(value)
    if (value) {
      localStorage.setItem('remember_me', 'true')
    } else {
      localStorage.removeItem('remember_me')
    }
  }

  const clearPersistentSession = () => {
    localStorage.removeItem('remember_me')
    setRememberMe(false)
    setIsSessionPersistent(false)
  }

  return {
    rememberMe,
    setRememberMe: handleSetRememberMe,
    isSessionPersistent,
    clearPersistentSession,
  }
}