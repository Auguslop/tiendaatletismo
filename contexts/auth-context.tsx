"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAdmin: boolean
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Credenciales de administrador (en producción, esto debería estar en el servidor)
  const ADMIN_USERNAME = "Auguslop"
  const ADMIN_PASSWORD = "Rulosvamoscuq137!"

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return

    // Verificar si ya está autenticado al cargar la página
    const savedAuth = localStorage.getItem("isAdmin")
    if (savedAuth === "true") {
      setIsAdmin(true)
    }

    // Detectar combinación de teclas Ctrl + Shift + A
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "A") {
        event.preventDefault()
        if (!isAdmin) {
          setShowLoginModal(true)
        } else {
          // Si ya está autenticado, hacer logout
          logout()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAdmin])

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      setShowLoginModal(false)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
    setShowLoginModal(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        showLoginModal,
        setShowLoginModal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
