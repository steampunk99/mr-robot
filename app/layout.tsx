import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { PageTransition } from "@/components/page-transition"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "Lukwiya Bonnie | 3D Web Developer",
  description: "Portfolio of Lukwiya Bonnie, a 3D Web Developer based in Kampala",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body className={`${orbitron.className} font-sans bg-black text-white`}>
        <div className="fixed inset-0 bg-black"></div>
        <Navigation />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}