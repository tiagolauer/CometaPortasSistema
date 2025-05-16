import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

interface Profile {
  id: string
  role_id: string
  full_name: string
  active: boolean
  roles?: {
    name: string
  }
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: false
})

// ✅ Hook primeiro (boa prática pro Vite HMR)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// 👇 Depois o provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Começa carregando

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          role_id,
          full_name,
          active,
          roles:role_id (
            name
          )
        `
        )
        .eq("id", userId)
        .single()

      if (error) throw error

      setProfile(data)
      setIsAdmin(data?.roles?.name === "admin")
    } catch (error) {
      console.error("Erro ao buscar o perfil:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        fetchProfile(currentUser.id)
      } else {
        setProfile(null)
        setIsAdmin(false)
        setIsLoading(false)
      }
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        await fetchProfile(currentUser.id)
      } else {
        setProfile(null)
        setIsAdmin(false)
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
