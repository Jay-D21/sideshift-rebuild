import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { title, category, description, duration, videoCount, productContext } = await req.json()

  const context = productContext ||
    `Title: ${title}, Objective: ${category}, Description: ${description}, Deliverables: ${videoCount}x ${duration} videos.`

  const prompt = `Write a professional UGC creative brief for this campaign:
${context}

Include:
- 3 hook ideas (opening lines that grab attention)
- Key talking points (what creators must mention)
- Visual requirements (lighting, setting, style)
- Do's and Don'ts
- CTA script (what to say at the end)

Use bullet points. Be specific and actionable. 200-300 words.`

  const apiKey = process.env.GEMINI_API_KEY
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })

  const data = await res.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  return NextResponse.json({ brief: text })
}
