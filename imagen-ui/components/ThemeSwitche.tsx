"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    setIsAnimating(true)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${
        isHovered ? 'transform scale-110' : ''
      }`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isAnimating ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: 'hsl(var(--background))',
          boxShadow: `
            0 0 10px rgba(0,0,0,0.1),
            inset 0 0 5px rgba(255,255,255,0.5)
          `,
          transform: isHovered ? 'translateZ(5px)' : 'translateZ(0)',
        }}
      />
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isAnimating ? 'animate-spin' : ''
        } ${isHovered ? 'animate-spin-slow' : ''}`}
        style={{
          transform: isHovered ? 'translateZ(10px) rotateY(10deg)' : 'translateZ(0) rotateY(0)',
        }}
      >
        {theme === "dark" ? (
          <Moon className="text-red-500" size={16} />
        ) : (
          <Sun className="text-yellow-500" size={16} />
        )}
      </div>
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at 30% 30%, ${
            theme === "dark" ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
          } 0%, transparent 70%)`,
          transform: 'translateZ(15px)',
        }}
      />
    </Button>
  )
}

export function ModeToggle() {
  return (
    <div className="fixed top-4 right-4">
      <ThemeSwitcher />
    </div>
  )
}