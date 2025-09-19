export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, voice = "alloy", speed = 1.0 } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "prompt is required" }), 
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Limit text length for audio generation
    const textToSpeak = prompt.slice(0, 500);
    
    // Try Pollinations TTS first
    try {
      const params = new URLSearchParams({
        voice: String(voice),
        speed: String(speed)
      });

      const url = `https://audio.pollinations.ai/prompt/${encodeURIComponent(textToSpeak)}?${params.toString()}`;
      
      const response = await fetch(url, { 
        cache: "no-store",
        headers: {
          'User-Agent': 'PolyCraft/1.0'
        }
      });
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        
        return new Response(buffer, {
          status: 200,
          headers: {
            "content-type": response.headers.get("content-type") || "audio/wav",
            "cache-control": "public, max-age=1800",
            "x-generated-by": "pollinations-ai",
            "x-voice": voice,
            "x-speed": String(speed)
          }
        });
      }
    } catch (ttsError) {
      console.log('Pollinations TTS not available, using fallback');
    }
    
    // Fallback response if TTS service is unavailable
    return new Response(
      JSON.stringify({ 
        error: "Audio generation temporarily unavailable",
        fallback: true,
        text: textToSpeak,
        message: "TTS service is currently being implemented. Please try again later.",
        metadata: {
          voice,
          speed,
          timestamp: new Date().toISOString()
        }
      }), 
      { status: 202, headers: { "content-type": "application/json" } }
    );
    
  } catch (error: any) {
    console.error('Audio generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }), 
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
