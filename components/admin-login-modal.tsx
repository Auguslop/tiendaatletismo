"use client"

import type React from "react"

import { useState } from "react"
import { X, Lock, User, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export function AdminLoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!showLoginModal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular un pequeño delay para mejor UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = login(username, password)

    if (!success) {
      setError("Usuario o contraseña incorrectos")
      setPassword("")
    } else {
      setUsername("")
      setPassword("")
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    setShowLoginModal(false)
    setUsername("")
    setPassword("")
    setError("")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center text-center">
            <Lock className="w-5 h-5 mr-2" />
            Acceso de Administrador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Iniciar Sesión"}
              </Button>

              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>💡 Combinación de teclas: Ctrl + Shift + A</p>
                <p className="text-gray-400">Demo: usuario "admin", contraseña "admin123"</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
