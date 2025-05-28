"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return

    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      const foundProduct = products.find((p: Product) => p.id === params.id)
      setProduct(foundProduct || null)
    }
    setLoading(false)
  }, [params.id])

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
            <Button>Volver a los clasificados</Button>
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
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a los clasificados
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Detalle del Producto</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-xl px-6 py-3">
                      Producto Vendido
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="text-4xl font-bold text-green-600 mb-6">${product.price}</div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? "Disponible" : "Vendido"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Información del Vendedor y Producto
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                ¿Cómo contactar al vendedor?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>📱 Usá el número de teléfono o WhatsApp que aparece en la descripción</li>
                <li>💬 Mencioná que viste el producto en "Clasificados Online"</li>
                <li>📍 Coordiná lugar y horario de encuentro con el vendedor</li>
                <li>💰 Acordá la forma de pago directamente con el vendedor</li>
              </ul>
            </div>

            {product.stock === 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800">Producto Vendido</h4>
                <p className="text-sm text-red-700">
                  Este producto ya fue vendido. Explorá otros productos similares en nuestros clasificados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Productos relacionados o sugerencias */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Consejos para compradores</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2">🔍 Verificá el producto</h4>
              <p className="text-sm text-gray-600">
                Pedí fotos adicionales y hacé todas las preguntas necesarias antes de encontrarte
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2">🤝 Lugar seguro</h4>
              <p className="text-sm text-gray-600">
                Encontrate en lugares públicos y seguros, preferiblemente durante el día
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium mb-2">💳 Forma de pago</h4>
              <p className="text-sm text-gray-600">
                Acordá la forma de pago con anticipación: efectivo, transferencia, etc.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
