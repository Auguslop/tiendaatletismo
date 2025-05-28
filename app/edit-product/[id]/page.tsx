"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  stock: number
  image: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "/placeholder.svg?height=300&width=300",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Replace the existing useEffect with this:
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Proteger la ruta - redirigir si no es admin
    if (!isAdmin) {
      router.push("/")
      return
    }

    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return

    // Cargar el producto a editar
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      const foundProduct = products.find((p: Product) => p.id === params.id)

      if (foundProduct) {
        setProduct(foundProduct)
        setFormData({
          name: foundProduct.name,
          price: foundProduct.price.toString(),
          description: foundProduct.description,
          category: foundProduct.category,
          stock: foundProduct.stock.toString(),
          image: foundProduct.image,
        })
        setImagePreview(foundProduct.image)
      }
    }
    setLoading(false)
  }, [mounted, isAdmin, params.id, router])

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
    setImagePreview("/placeholder.svg?height=300&width=300")
    setFormData((prev) => ({
      ...prev,
      image: "/placeholder.svg?height=300&width=300",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.stock) {
      alert("Por favor completa todos los campos")
      return
    }

    if (!product) {
      alert("Error: Producto no encontrado")
      return
    }

    const updatedProduct = {
      ...product,
      name: formData.name,
      price: Number.parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      image: formData.image,
    }

    // Actualizar en localStorage
    const savedProducts = localStorage.getItem("products")
    const products = savedProducts ? JSON.parse(savedProducts) : []
    const updatedProducts = products.map((p: Product) => (p.id === product.id ? updatedProduct : p))
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // También actualizar el carrito si el producto está ahí
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      const updatedCart = cart.map((item: any) => (item.id === product.id ? { ...item, ...updatedProduct } : item))
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    }

    alert("Producto actualizado exitosamente!")
    router.push("/")
  }

  const handleDelete = () => {
    if (!product) return

    const confirmDelete = confirm(
      `¿Estás seguro de que quieres eliminar "${product.name}"? Esta acción no se puede deshacer.`,
    )

    if (confirmDelete) {
      // Eliminar de productos
      const savedProducts = localStorage.getItem("products")
      const products = savedProducts ? JSON.parse(savedProducts) : []
      const updatedProducts = products.filter((p: Product) => p.id !== product.id)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      // Eliminar del carrito si está ahí
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const updatedCart = cart.filter((item: any) => item.id !== product.id)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
      }

      alert("Producto eliminado exitosamente!")
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link href="/">
            <Button>Volver a la tienda</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">Editar Producto</h1>
            </div>

            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Eliminar Producto
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar: {product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="image">Imagen del Producto</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview && imagePreview !== "/placeholder.svg?height=300&width=300" ? (
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
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {imagePreview === "/placeholder.svg?height=300&width=300"
                              ? "Subir nueva imagen"
                              : "Cambiar imagen"}
                          </span>
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
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: iPhone 15 Pro Max"
                  required
                />
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($)</Label>
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
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electrónicos">Electrónicos</SelectItem>
                    <SelectItem value="Ropa">Ropa</SelectItem>
                    <SelectItem value="Hogar">Hogar</SelectItem>
                    <SelectItem value="Deportes">Deportes</SelectItem>
                    <SelectItem value="Libros">Libros</SelectItem>
                    <SelectItem value="Juguetes">Juguetes</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Cantidad en Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe las características principales del producto..."
                  rows={4}
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
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
