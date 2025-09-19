export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { prompt, model = "enhanced-template" } = await request.json().catch(() => ({}));
    
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "prompt is required" }), 
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Enhanced text generation with intelligent templates
    const responses = {
      story: [
        `Once upon a time, there was a tale about ${prompt.toLowerCase()}. This story unfolds in a world where imagination meets reality, and every word carries the power to transform thoughts into vivid experiences. The journey begins with curiosity and leads to discovery, where each chapter reveals new layers of meaning and connection.`,
        
        `In a realm where ${prompt.toLowerCase()} holds great significance, our story begins. The protagonist discovers that this concept is more than just an idea—it's a gateway to understanding deeper truths about existence and purpose. Through trials and revelations, they learn that every challenge is an opportunity for growth.`,
        
        `The narrative of ${prompt.toLowerCase()} takes us on an extraordinary adventure through landscapes of possibility. Our hero encounters wisdom in unexpected places, finding that the true treasure was not the destination, but the transformation that occurred along the way.`
      ],
      explanation: [
        `Let me explain ${prompt.toLowerCase()} in a comprehensive way. This concept involves multiple interconnected aspects that work together to create a complete understanding. At its core, it represents a fundamental principle that influences various domains of knowledge and application, offering insights that extend far beyond surface-level comprehension.`,
        
        `Understanding ${prompt.toLowerCase()} requires us to examine its key components and relationships. This topic connects to broader themes in science, philosophy, and practical application. By breaking it down into manageable parts, we can appreciate both its complexity and its elegant simplicity.`,
        
        `To grasp ${prompt.toLowerCase()}, we need to explore both its theoretical foundations and real-world implications. This multifaceted subject reveals layers of complexity that become clearer through systematic analysis and practical examples that demonstrate its relevance in everyday contexts.`
      ],
      creative: [
        `Imagine a world where ${prompt.toLowerCase()} becomes the centerpiece of innovation and artistic expression. In this creative space, boundaries dissolve and new possibilities emerge from the intersection of technology, art, and human imagination. Here, conventional rules bend to accommodate fresh perspectives and revolutionary ideas.`,
        
        `The creative potential of ${prompt.toLowerCase()} invites us to think beyond conventional limitations. This is where we explore uncharted territories of thought and expression, where each idea sparks new connections and insights. Innovation flourishes when we dare to question assumptions and embrace unconventional approaches.`,
        
        `Through the lens of creativity, ${prompt.toLowerCase()} transforms into a canvas for exploration and experimentation. This perspective opens doors to innovative solutions and fresh interpretations that challenge traditional thinking patterns and inspire breakthrough moments.`
      ],
      default: [
        `Regarding ${prompt.toLowerCase()}, there are numerous fascinating dimensions to explore. This topic touches on various interconnected themes that reveal the complexity and richness of the subject matter. Each aspect contributes to a deeper understanding of how different elements work together to create meaningful insights.`,
        
        `When we consider ${prompt.toLowerCase()}, we encounter a rich tapestry of ideas and possibilities. This exploration leads us to discover connections and patterns that enhance our understanding of the broader context. The interplay between different concepts creates opportunities for learning and growth.`,
        
        `The subject of ${prompt.toLowerCase()} presents us with opportunities to delve deeper into meaningful analysis. Through careful examination and thoughtful reflection, we uncover layers of significance that contribute to a more complete and nuanced perspective on this important topic.`
      ]
    };

    // Classify prompt type
    const promptLower = prompt.toLowerCase();
    let category = 'default';
    
    if (/\b(story|tale|narrative|once upon|character|plot|fiction)\b/.test(promptLower)) {
      category = 'story';
    } else if (/\b(explain|how|what is|define|describe|tell me about|why|when)\b/.test(promptLower)) {
      category = 'explanation';
    } else if (/\b(create|imagine|design|art|creative|invent|build|make)\b/.test(promptLower)) {
      category = 'creative';
    }

    const categoryResponses = responses[category as keyof typeof responses];
    const selectedResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    const result = {
      text: selectedResponse,
      source: "enhanced-template",
      metadata: {
        model,
        category,
        timestamp: new Date().toISOString(),
        word_count: selectedResponse.split(' ').length,
        character_count: selectedResponse.length
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { 
        "content-type": "application/json",
        "cache-control": "public, max-age=300"
      }
    });
    
  } catch (error: any) {
    console.error('Text generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }), 
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
