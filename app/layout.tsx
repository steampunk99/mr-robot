import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { PageTransition } from "@/components/page-transition"
import { NavigationProvider } from "@/context/navigation-context"
import { SmoothScrollProvider } from "@/context/smooth-scroll"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ScrollProgress } from "@/components/scroll-progress"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "steampunk99 | Software Engineer",
  description: "Portfolio of Steampunk99, a Software Engineer based in Kampala",
  generator: 'steampunk99'
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
        <SmoothScrollProvider>
          <NavigationProvider>
            <ScrollProgress />
            <ScrollToTop />
            <Navigation />
            <PageTransition>{children}</PageTransition>
          </NavigationProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}