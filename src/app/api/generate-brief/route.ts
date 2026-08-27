import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { productContext } = await req.json()

    if (!productContext) {
      return NextResponse.json({ error: 'Missing product context' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 })
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'You are an expert UGC (User Generated Content) strategist. Given the following context about a product or campaign, write a concise, highly-actionable creative brief for creators. Include specific talking points, visual hooks, and do\'s and don\'ts. Format it cleanly without markdown code blocks, just text.\n\nContext: ' + productContext
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error('Gemini API Error: ' + errorText)
    }

    const data = await response.json()
    const brief = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({ brief })
  } catch (error: any) {
    console.error('Error generating brief:', error)
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 })
  }
}
