import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  let html = ''
  try {
    const res = await fetch(url.startsWith('http') ? url : `https://${url}`, {
      headers: { 'User-Agent': 'CreatorFlow Bot/1.0' },
      signal: AbortSignal.timeout(5000),
    })
    html = (await res.text()).slice(0, 5000)
  } catch {
    html = `Website: ${url}`
  }

  const prompt = `Analyze this brand website and return ONLY valid JSON (no markdown, no code blocks, no backticks):
${html}

Return exactly this JSON structure with real values extracted from the website:
{
  "company_name": "extracted company name",
  "industry": "one of: ecommerce, saas, mobile_app, food, beauty, fitness, finance, gaming, other",
  "description": "one sentence about what the brand does",
  "target_audience": "who their customers are",
  "brand_voice": "casual, professional, edgy, or playful",
  "suggested_campaigns": [
    {
      "title": "campaign title",
      "objective": "awareness",
      "description": "2 sentences describing the campaign",
      "brief": "Detailed creative brief with hook ideas, talking points, visual requirements, dos and donts, and CTA script. Use bullet points.",
      "budget": 2000,
      "budget_per_creator": 400,
      "video_count": 3,
      "duration": "30s",
      "niches": ["Beauty", "Lifestyle"]
    },
    {
      "title": "second campaign idea",
      "objective": "conversion",
      "description": "2 sentences",
      "brief": "Another detailed brief with bullet points",
      "budget": 1500,
      "budget_per_creator": 300,
      "video_count": 2,
      "duration": "15s",
      "niches": ["Tech", "Gaming"]
    }
  ]
}`

  const apiKey = process.env.GEMINI_API_KEY
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const geminiRes = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })

  const data = await geminiRes.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Failed to parse brand data', raw: text }, { status: 500 })
  }
}
