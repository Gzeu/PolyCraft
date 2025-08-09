import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [audioPrompt, setAudioPrompt] = useState("")
  const { toast } = useToast()

  const handleGenerateImage = async () => {
    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      })
      const data = await response.json()
      window.open(data.url, "_blank")
      toast({
        title: "Success",
        description: "Image generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateText = async () => {
    try {
      const response = await fetch("/api/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      toast({
        title: "Success",
        description: "Text generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate text.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateAudio = async () => {
    try {
      const response = await fetch("/api/generate/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: audioPrompt }),
      })
      const data = await response.json()
      window.open(data.url, "_blank")
      toast({
        title: "Success",
        description: "Audio generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate audio.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Pollinations MCP Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Text Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Text Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={handleGenerateText}>
                Generate Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Image Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Image Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Enter your prompt..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
              <Button onClick={handleGenerateImage}>
                Generate Image
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audio Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Audio Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Enter your prompt..."
                value={audioPrompt}
                onChange={(e) => setAudioPrompt(e.target.value)}
              />
              <Button onClick={handleGenerateAudio}>
                Generate Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
