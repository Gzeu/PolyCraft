'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
import { useGeneration } from '@/hooks/use-generation'
import { ImageIcon, TypeIcon, AudioLines, Sparkles, Wand2, Zap } from 'lucide-react'

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedTab, setSelectedTab] = useState('image')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PolyCraft</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Multi-Modal Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Zap className="w-3 h-3 mr-1" />
                Powered by Pollinations AI
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            >
              Craft the Future
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Generate stunning images, compelling text, and natural audio with cutting-edge AI technology.
              All in one unified platform.
            </motion.p>
          </div>

          {/* Generation Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8"
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
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
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
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder={`Enter your ${selectedTab} generation prompt...`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
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
                            <SelectItem value="flux">Flux</SelectItem>
                            <SelectItem value="dreamshaper">DreamShaper</SelectItem>
                            <SelectItem value="deliberate">Deliberate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Seed (Optional)</Label>
                        <Textarea
                          placeholder="Random seed"
                          value={imageParams.seed || ''}
                          onChange={(e) => setImageParams(prev => ({ ...prev, seed: e.target.value ? parseInt(e.target.value) : undefined }))}
                          className="h-10 resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
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
                        <Label htmlFor="nologo">Remove Logo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="private"
                          checked={imageParams.private}
                          onCheckedChange={(checked) => setImageParams(prev => ({ ...prev, private: checked }))}
                        />
                        <Label htmlFor="private">Private</Label>
                      </div>
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
                            <SelectItem value="alloy">Alloy</SelectItem>
                            <SelectItem value="echo">Echo</SelectItem>
                            <SelectItem value="fable">Fable</SelectItem>
                            <SelectItem value="onyx">Onyx</SelectItem>
                            <SelectItem value="nova">Nova</SelectItem>
                            <SelectItem value="shimmer">Shimmer</SelectItem>
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
                      />
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
                      Generating...
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
                <CardTitle>Generated Content</CardTitle>
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
