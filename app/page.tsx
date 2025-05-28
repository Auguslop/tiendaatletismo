"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search, Edit, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

export default function HomePage() {
  const { isAdmin, logout } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return

    // Cargar productos del localStorage
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Productos de ejemplo con información de vendedores
      const exampleProducts: Product[] = [
        {
          id: "1",
          name: "Smartphone Pro Max",
          price: 899,
          description:
            "Último modelo con cámara de 108MP y pantalla OLED. Estado: Nuevo en caja. Vendedor: María González - Palermo, CABA. Contacto: 11-2345-6789. Acepto efectivo y transferencia.",
          image: "/placeholder.svg?height=300&width=300",
          category: "Electrónicos",
          stock: 1,
        },
        {
          id: "2",
          name: "Auriculares Inalámbricos",
          price: 199,
          description:
            "Cancelación de ruido activa y 30h de batería. Poco uso, excelente estado. Vendedor: Carlos Ruiz - Villa Urquiza. WhatsApp: 11-9876-5432. Entrego en estación de subte.",
          image: "/placeholder.svg?height=300&width=300",
          category: "Electrónicos",
          stock: 1,
        },
        {
          id: "3",
          name: "Zapatillas Puma Running",
          price: 49,
          description:
            "Talle 42, usadas pocas veces. Ideales para running. Vendedor: Ana López - Quilmes Centro. Contactar al 11-2189-9342. Acepto mercado pago.",
          image: "/placeholder.svg?height=300&width=300",
          category: "Ropa",
          stock: 1,
        },
      ]
      setProducts(exampleProducts)
      localStorage.setItem("products", JSON.stringify(exampleProducts))
    }
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Clasificados Online</h1>
              {isAdmin && (
                <Badge variant="secondary" className="ml-3">
                  <Shield className="w-3 h-3 mr-1" />
                  Modo Admin
                </Badge>
              )}
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAdmin && (
                <>
                  <Link href="/add-product">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Publicar Producto
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Instrucciones para activar modo admin (solo si no está autenticado) */}
      {!isAdmin && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-sm text-blue-700 text-center">
              💡 Presiona <kbd className="px-2 py-1 bg-blue-100 rounded text-xs">Ctrl + Shift + A</kbd> para acceder al
              modo administrador
            </p>
          </div>
        </div>
      )}

      {/* Información para vendedores */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-green-700 text-center">
            📢 ¿Querés vender algo? Contactanos para publicar tu producto en nuestro sitio
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Disponibles</h2>
          <p className="text-gray-600">Encontrá lo que buscás y contactá directamente con cada vendedor</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No se encontraron productos</p>
            {isAdmin && (
              <Link href="/add-product">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar el primer producto
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  <Badge className="absolute top-2 right-2">{product.category}</Badge>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Vendido
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    <span className="text-sm text-gray-500">{product.stock > 0 ? "Disponible" : "Vendido"}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 space-x-2">
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href={`/edit-product/${product.id}`}>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Información para vendedores */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">¿Querés vender en nuestro sitio?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-medium mb-2">1. Contactanos</h4>
              <p className="text-sm text-gray-600">Envianos la información de tu producto y tus datos de contacto</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="font-medium mb-2">2. Publicamos</h4>
              <p className="text-sm text-gray-600">Subimos tu producto con fotos y toda la información necesaria</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-medium mb-2">3. Vendés</h4>
              <p className="text-sm text-gray-600">Los compradores te contactan directamente para coordinar la venta</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
