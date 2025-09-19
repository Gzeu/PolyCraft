"use client"

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sparkles, Zap, Github, ExternalLink } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b glass-effect-strong sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PolyCraft</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Multi-Modal Generation</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Gallery
              </Link>
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API
              </Link>
              <Link 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:inline-flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Powered by Pollinations AI
            </Badge>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link 
                  href="https://github.com/Gzeu/PolyCraft" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="sm:hidden"
              >
                <Link 
                  href="https://github.com/Gzeu/PolyCraft" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                </Link>
              </Button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
