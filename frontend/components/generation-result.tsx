"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, Copy, ExternalLink, FileText, Volume2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { GenerationResult as GenerationResultType, GenerationType } from "@/types"
import { downloadFile, copyToClipboard } from "@/lib/utils"

interface GenerationResultProps {
  type: GenerationType
  result: GenerationResultType | null
  error: string | null
  isLoading: boolean
}

export function GenerationResult({ type, result, error, isLoading }: GenerationResultProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const { toast } = useToast()

  const handleDownload = () => {
    if (result?.url) {
      const filename = `polycraft-${type}-${Date.now()}.${type === 'image' ? 'png' : type === 'audio' ? 'mp3' : 'txt'}`
      downloadFile(result.url, filename)
      toast({
        title: "Download Started",
        description: `Your ${type} is being downloaded.`,
      })
    }
  }

  const handleCopy = () => {
    const content = result?.text || result?.url || ''
    copyToClipboard(content)
    toast({
      title: "Copied to Clipboard",
      description: `${type === 'text' ? 'Text' : 'URL'} has been copied to your clipboard.`,
    })
  }

  const handleOpenExternal = () => {
    if (result?.url) {
      window.open(result.url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="text-lg font-medium">Generating {type}...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
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
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Generation Failed</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </motion.div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          {type === 'image' && <FileText className="w-8 h-8" />}
          {type === 'text' && <FileText className="w-8 h-8" />}
          {type === 'audio' && <Volume2 className="w-8 h-8" />}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">No Content Generated</p>
          <p className="text-sm">Enter a prompt and click generate to create {type} content</p>
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
      <Card>
        <CardContent className="p-4">
          {type === 'image' && result.url && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              )}
              <Image
                src={result.url}
                alt="Generated image"
                fill
                className="object-contain transition-opacity duration-200"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
          )}

          {type === 'text' && result.text && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Text</h3>
                {result.source && (
                  <Badge variant="secondary">{result.source}</Badge>
                )}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.text}</p>
              </div>
            </div>
          )}

          {type === 'audio' && result.url && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Audio</h3>
                <Badge variant="secondary">MP3</Badge>
              </div>
              <audio
                controls
                className="w-full"
                preload="metadata"
              >
                <source src={result.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {(result.url || result.text) && (
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy {type === 'text' ? 'Text' : 'URL'}
          </Button>
        )}

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
