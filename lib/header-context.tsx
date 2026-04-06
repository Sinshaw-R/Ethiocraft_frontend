'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface HeaderContextType {
  isHovered: boolean
  setIsHovered: (hovered: boolean) => void
  isCompact: boolean
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  return (
    <HeaderContext.Provider value={{ isHovered, setIsHovered, isCompact }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within HeaderProvider')
  }
  return context
}