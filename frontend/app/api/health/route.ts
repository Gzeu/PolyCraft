export const runtime = "nodejs";

export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: "ok", 
      source: "vercel-serverless",
      timestamp: new Date().toISOString(),
      services: {
        image_generation: "operational",
        text_generation: "operational", 
        audio_generation: "operational"
      }
    }), 
    {
      headers: { "content-type": "application/json" }
    }
  );
}
