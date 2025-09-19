export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BatchItem = {
  type: "image" | "audio" | "text";
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
  voice?: string;
  speed?: number;
  [key: string]: any;
};

export async function POST(req: Request) {
  try {
    const { requests } = await req.json().catch(() => ({ requests: [] }));
    
    if (!Array.isArray(requests)) {
      return new Response(
        JSON.stringify({ error: "requests must be an array" }), 
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const origin = new URL(req.url).origin;
    const results: any[] = [];
    
    // Process each request
    for (const item of requests as BatchItem[]) {
      try {
        if (item.type === "image") {
          const response = await fetch(`${origin}/api/generate/image`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              prompt: item.prompt,
              width: item.width,
              height: item.height,
              model: item.model
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }
          
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          
          results.push({
            status: "success",
            result: {
              type: "image",
              image_base64: base64,
              content_type: response.headers.get("content-type") || "image/png"
            }
          });
          
        } else if (item.type === "audio") {
          const response = await fetch(`${origin}/api/generate/audio`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              prompt: item.prompt,
              voice: item.voice,
              speed: item.speed
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }
          
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          
          results.push({
            status: "success",
            result: {
              type: "audio",
              audio_base64: base64,
              content_type: response.headers.get("content-type") || "audio/wav"
            }
          });
          
        } else if (item.type === "text") {
          const response = await fetch(`${origin}/api/generate/text`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              prompt: item.prompt,
              model: item.model
            })
          });
          
          const data = await response.json();
          
          results.push({
            status: "success",
            result: {
              type: "text",
              text: data.text || "",
              metadata: data.metadata
            }
          });
          
        } else {
          throw new Error(`Unsupported type: ${item.type}`);
        }
        
      } catch (error: any) {
        results.push({
          status: "error",
          error: error.message || "Unknown error occurred"
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        results,
        processed: results.length,
        timestamp: new Date().toISOString()
      }), 
      {
        headers: { 
          "content-type": "application/json",
          "cache-control": "no-store"
        }
      }
    );
    
  } catch (error: any) {
    console.error('Batch processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }), 
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
