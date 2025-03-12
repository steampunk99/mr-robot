import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Cinzel, Major_Mono_Display } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { PageTransition } from "@/components/page-transition"
import { SmoothScrollProvider } from "@/context/smooth-scroll"

import "./globals.css"
import CustomCursor from "@/components/custom-cursor"
import InteractiveRobot from "@/components/robot/interactive-robot"
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-unbounded",
})

const majorMono = Major_Mono_Display({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-unique",
})

export const metadata: Metadata = {
  title: "steampunk99 | Software Engineer",
  description: "Software Engineer based in Kampala",
  generator: 'steampunk99'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${cinzel.variable} ${majorMono.variable}`}>
      <body className={`${spaceGrotesk.className} font-sans bg-black text-white`}> 
        <SmoothScrollProvider>
          <main> 
          
            <Navigation />
            <InteractiveRobot />
            {/* <CustomCursor/> */}
            <PageTransition>{children}</PageTransition>
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}