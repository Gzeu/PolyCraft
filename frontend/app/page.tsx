'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { LoadingSpinner } from '@/components/loading-spinner'
import { GenerationResult } from '@/components/generation-result'
import { Header } from '@/components/header'
import { useGeneration } from '@/hooks/use-generation'
import { ImageIcon, TypeIcon, AudioLines, Sparkles, Wand2, Zap, Github } from 'lucide-react'
import Link from 'next/link'

const EXAMPLE_PROMPTS = {
  image: [
    "A futuristic city skyline at sunset with flying cars",
    "A magical forest with glowing mushrooms and fairy lights",
    "A steampunk robot reading a book in a library",
    "An underwater palace made of coral and pearls",
  ],
  text: [
    "Write a short story about time travel",
    "Explain quantum computing in simple terms",
    "Create a recipe for happiness",
    "Describe the perfect day from a cat's perspective",
  ],
  audio: [
    "Hello, welcome to PolyCraft!",
    "The future of AI is here",
    "Creativity meets technology",
    "Your imagination, powered by AI",
  ],
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedTab, setSelectedTab] = useState<'image' | 'text' | 'audio'>('image')
  const [imageParams, setImageParams] = useState({
    model: 'flux',
    width: 1024,
    height: 1024,
    seed: undefined as number | undefined,
    nologo: false,
    private: false
  })
  const [audioParams, setAudioParams] = useState({
    voice: 'alloy',
    speed: 1.0,
    response_format: 'mp3'
  })

  const { generateContent, isLoading, result, error } = useGeneration()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    const params = selectedTab === 'image' ? imageParams : 
                  selectedTab === 'audio' ? audioParams : 
                  { model: 'openai' }

    await generateContent(selectedTab, prompt, params)
  }

  const handleExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt)
  }

  const generateRandomSeed = () => {
    setImageParams(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Powered by Pollinations AI</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-gradient"
            >
              Craft the Future
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Generate stunning images, compelling text, and natural audio with cutting-edge AI technology.
              <br className="hidden md:block" />
              All in one unified platform.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Live</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span>Free to use</span>
                <Separator orientation="vertical" className="h-4" />
                <Link 
                  href="https://github.com/Gzeu/PolyCraft" 
                  target="_blank" 
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Github className="w-3 h-3" />
                  Open Source
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Generation Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Generation Panel */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  AI Generation Studio
                </CardTitle>
                <CardDescription>
                  Choose your generation type and craft your prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generation Type Tabs */}
                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'image' | 'text' | 'audio')}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <TypeIcon className="w-4 h-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="audio" className="flex items-center gap-2">
                      <AudioLines className="w-4 h-4" />
                      Audio
                    </TabsTrigger>
                  </TabsList>

                  {/* Prompt Input */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="flex items-center justify-between">
                      <span>Prompt</span>
                      <span className="text-xs text-muted-foreground">
                        {prompt.length}/1000
                      </span>
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder={`Enter your ${selectedTab} generation prompt...`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
                      className="min-h-[120px] resize-none"
                    />
                    
                    {/* Example Prompts */}
                    <div className="space-y-2">
                      <Label className="text-xs">Example prompts:</Label>
                      <div className="flex flex-wrap gap-1">
                        {EXAMPLE_PROMPTS[selectedTab].slice(0, 2).map((example, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => handleExamplePrompt(example)}
                          >
                            {example.length > 40 ? `${example.slice(0, 40)}...` : example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Parameters */}
                  <TabsContent value="image" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select value={imageParams.model} onValueChange={(value) => setImageParams(prev => ({ ...prev, model: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flux">Flux (Recommended)</SelectItem>
                            <SelectItem value="dreamshaper">DreamShaper</SelectItem>
                            <SelectItem value="deliberate">Deliberate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center justify-between">
                          <span>Seed</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={generateRandomSeed}
                            className="h-6 px-2 text-xs"
                          >
                            Random
                          </Button>
                        </Label>
                        <Textarea
                          placeholder="Optional"
                          value={imageParams.seed || ''}
                          onChange={(e) => setImageParams(prev => ({ ...prev, seed: e.target.value ? parseInt(e.target.value) || undefined : undefined }))}
                          className="h-10 resize-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Width: {imageParams.width}px</Label>
                        <Slider
                          value={[imageParams.width]}
                          onValueChange={(value) => setImageParams(prev => ({ ...prev, width: value[0] }))}
                          max={2048}
                          min={256}
                          step={64}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height: {imageParams.height}px</Label>
                        <Slider
                          value={[imageParams.height]}
                          onValueChange={(value) => setImageParams(prev => ({ ...prev, height: value[0] }))}
                          max={2048}
                          min={256}
                          step={64}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="nologo"
                          checked={imageParams.nologo}
                          onCheckedChange={(checked) => setImageParams(prev => ({ ...prev, nologo: checked }))}
                        />
                        <Label htmlFor="nologo" className="text-sm">Remove Logo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="private"
                          checked={imageParams.private}
                          onCheckedChange={(checked) => setImageParams(prev => ({ ...prev, private: checked }))}
                        />
                        <Label htmlFor="private" className="text-sm">Private</Label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Text Parameters */}
                  <TabsContent value="text" className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-sm font-medium">Development Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Text generation is currently in development. You'll receive a placeholder response while we work on integrating advanced text generation capabilities.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Audio Parameters */}
                  <TabsContent value="audio" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Voice</Label>
                        <Select value={audioParams.voice} onValueChange={(value) => setAudioParams(prev => ({ ...prev, voice: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                            <SelectItem value="echo">Echo (Male)</SelectItem>
                            <SelectItem value="fable">Fable (British)</SelectItem>
                            <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                            <SelectItem value="nova">Nova (Female)</SelectItem>
                            <SelectItem value="shimmer">Shimmer (Soft)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Format</Label>
                        <Select value={audioParams.response_format} onValueChange={(value) => setAudioParams(prev => ({ ...prev, response_format: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mp3">MP3</SelectItem>
                            <SelectItem value="wav">WAV</SelectItem>
                            <SelectItem value="flac">FLAC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Speed: {audioParams.speed}x</Label>
                      <Slider
                        value={[audioParams.speed]}
                        onValueChange={(value) => setAudioParams(prev => ({ ...prev, speed: value[0] }))}
                        max={4.0}
                        min={0.25}
                        step={0.25}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.25x</span>
                        <span>1.0x</span>
                        <span>4.0x</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-sm font-medium">Development Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Audio generation is in development. The interface is ready, but audio synthesis capabilities are being implemented.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      Generating {selectedTab}...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Content</span>
                  {result && (
                    <Badge variant="secondary" className="capitalize">
                      {selectedTab}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Your AI-generated content will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenerationResult
                  type={selectedTab}
                  result={result}
                  error={error}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
