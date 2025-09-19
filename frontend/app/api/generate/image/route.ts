export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 1024, height = 1024, model = "flux", seed, nologo = true } = await req.json();
    
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "prompt is required" }), 
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Build Pollinations URL
    const params = new URLSearchParams({
      width: String(width),
      height: String(height),
      model: String(model),
      nologo: nologo ? "1" : "0"
    });
    
    if (seed) {
      params.set("seed", String(seed));
    }

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
    
    const response = await fetch(url, { 
      cache: "no-store",
      headers: {
        'User-Agent': 'PolyCraft/1.0'
      }
    });
    
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return new Response(
        JSON.stringify({ 
          error: "Image generation failed", 
          status: response.status, 
          details: text 
        }), 
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const buffer = await response.arrayBuffer();
    
    return new Response(buffer, {
      status: 200,
      headers: {
        "content-type": response.headers.get("content-type") || "image/png",
        "cache-control": "public, max-age=3600",
        "x-generated-by": "pollinations-ai"
      }
    });
    
  } catch (error: any) {
    console.error('Image generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }), 
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
