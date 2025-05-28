"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function AddProductPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "1",
    image: "/placeholder.svg?height=300&width=300",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Proteger la ruta - redirigir si no es admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Proteger la ruta - redirigir si no es admin
  useEffect(() => {
    if (mounted && !isAdmin) {
      router.push("/")
    }
  }, [isAdmin, router, mounted])

  // No renderizar nada si no está montado o no es admin
  if (!mounted || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      image: "/placeholder.svg?height=300&width=300",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number.parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      image: formData.image,
    }

    // Guardar en localStorage
    const savedProducts = localStorage.getItem("products")
    const products = savedProducts ? JSON.parse(savedProducts) : []
    products.push(newProduct)
    localStorage.setItem("products", JSON.stringify(products))

    alert("Producto publicado exitosamente!")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Publicar Nuevo Producto</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto y Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="image">Imagen del Producto</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="mx-auto h-48 w-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">Subir imagen</span>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Zapatillas Puma Running"
                  required
                />
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electrónicos">Electrónicos</SelectItem>
                    <SelectItem value="Ropa">Ropa y Calzado</SelectItem>
                    <SelectItem value="Hogar">Hogar y Jardín</SelectItem>
                    <SelectItem value="Deportes">Deportes y Fitness</SelectItem>
                    <SelectItem value="Vehículos">Vehículos</SelectItem>
                    <SelectItem value="Libros">Libros y Revistas</SelectItem>
                    <SelectItem value="Juguetes">Juguetes y Bebés</SelectItem>
                    <SelectItem value="Instrumentos">Instrumentos Musicales</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado del producto */}
              <div className="space-y-2">
                <Label htmlFor="stock">Estado del Producto</Label>
                <Select
                  value={formData.stock}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, stock: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Disponible</SelectItem>
                    <SelectItem value="0">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descripción con información del vendedor */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción e Información del Vendedor *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ejemplo:
Talle 42, usadas pocas veces. Ideales para running. Excelente estado.

Vendedor: Ana López
Ubicación: Quilmes Centro
Contacto: 11-2189-9342
Formas de pago: Efectivo, transferencia, MercadoPago
Entrega: Coordinar por zona"
                  rows={8}
                  required
                />
                <p className="text-xs text-gray-500">
                  Incluí: descripción del producto, estado, datos del vendedor, ubicación, contacto y formas de pago
                </p>
              </div>

              {/* Botones */}
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Publicar Producto
                </Button>
                <Link href="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
