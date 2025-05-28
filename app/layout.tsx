import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminLoginModal } from "@/components/admin-login-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clasificados Online - Compra y Vende Fácil",
  description: "Encuentra productos únicos y contacta directamente con vendedores. Electrónicos, ropa, hogar y más.",
  keywords: "clasificados, compra, venta, productos, electrónicos, ropa, hogar",
  authors: [{ name: "Clasificados Online" }],
  openGraph: {
    title: "Clasificados Online - Compra y Vende Fácil",
    description: "Encuentra productos únicos y contacta directamente con vendedores",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <AdminLoginModal />
        </AuthProvider>
      </body>
    </html>
  )
}
