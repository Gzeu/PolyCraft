"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Copy, ExternalLink, FileText, Volume2, AlertCircle, CheckCircle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner, LoadingShimmer } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { GenerationResult as GenerationResultType, GenerationType } from "@/types"
import { downloadFile, copyToClipboard, formatRelativeTime } from "@/lib/utils"

interface GenerationResultProps {
  type: GenerationType
  result: GenerationResultType | null
  error: string | null
  isLoading: boolean
}

export function GenerationResult({ type, result, error, isLoading }: GenerationResultProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const { toast } = useToast()

  const handleDownload = useCallback(async () => {
    if (!result?.url) return
    
    try {
      const filename = `polycraft-${type}-${Date.now()}.${getFileExtension(type)}`
      downloadFile(result.url, filename)
      
      toast({
        title: "Download Started",
        description: `Your ${type} is being downloaded.`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive"
      })
    }
  }, [result?.url, type, toast])

  const handleCopy = useCallback(async () => {
    const content = result?.text || result?.url || ''
    if (!content) return
    
    const success = await copyToClipboard(content)
    
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      
      toast({
        title: "Copied to Clipboard",
        description: `${type === 'text' ? 'Text' : 'URL'} has been copied to your clipboard.`,
      })
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive"
      })
    }
  }, [result?.text, result?.url, type, toast])

  const handleOpenExternal = useCallback(() => {
    if (result?.url) {
      window.open(result.url, '_blank', 'noopener,noreferrer')
    }
  }, [result?.url])

  const getFileExtension = (type: GenerationType) => {
    switch (type) {
      case 'image': return 'png'
      case 'audio': return 'mp3'
      case 'text': return 'txt'
      default: return 'file'
    }
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Generating {type}...</p>
            <p className="text-sm text-muted-foreground">
              {type === 'image' && 'Creating your visual masterpiece'}
              {type === 'text' && 'Crafting your text content'}
              {type === 'audio' && 'Synthesizing your audio'}
            </p>
          </div>
        </div>
        
        {type === 'image' && (
          <LoadingShimmer className="w-full h-64" />
        )}
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-destructive">Generation Failed</p>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
      </motion.div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          {type === 'image' && <ImageIcon className="w-8 h-8" />}
          {type === 'text' && <FileText className="w-8 h-8" />}
          {type === 'audio' && <Volume2 className="w-8 h-8" />}
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Ready to Generate</p>
          <p className="text-sm max-w-md">
            Enter a prompt above and click generate to create amazing {type} content with AI
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Result Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {type === 'image' && result.url && (
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <AnimatePresence>
                {imageLoading && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-muted"
                  >
                    <LoadingSpinner size="lg" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Image
                src={result.url}
                alt="Generated image"
                fill
                className={`object-contain transition-all duration-500 ${imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  toast({
                    title: "Image Load Error",
                    description: "Failed to load the generated image.",
                    variant: "destructive"
                  })
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}

          {type === 'text' && result.text && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Text</h3>
                <div className="flex items-center gap-2">
                  {result.source && (
                    <Badge variant="secondary" className="text-xs">
                      {result.source}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {result.text.length} chars
                  </Badge>
                </div>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed m-0">
                    {result.text}
                  </p>
                </div>
              </div>
              
              {result.metadata?.timestamp && (
                <p className="text-xs text-muted-foreground">
                  Generated {formatRelativeTime(new Date(result.metadata.timestamp))}
                </p>
              )}
            </div>
          )}

          {type === 'audio' && result.url && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Audio</h3>
                <Badge variant="secondary" className="text-xs">
                  MP3
                </Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <audio
                  controls
                  className="w-full"
                  preload="metadata"
                  controlsList="nodownload"
                >
                  <source src={result.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={!result.url && !result.text}
        >
          <AnimatePresence mode="wait">
            {copySuccess ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy {type === 'text' ? 'Text' : 'URL'}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {result.url && (
          <>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            <Button
              onClick={handleOpenExternal}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}
