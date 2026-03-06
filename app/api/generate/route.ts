import { genAI } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { dishName } = await request.json()
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const result = await model.generateContent(`
「${dishName}」のレシピをJSON形式で返してください。
マークダウン記法は使わないでください。
必ず以下のJSON形式のみで返してください。他の文章は不要です。

{
  "title": "料理の正式名称をここに入れる",
  "steps": ["手順1", "手順2", "手順3"],
  "ingredients": ["食材1 適量", "食材2 少々"],
  "shopping": ["買うもの1", "買うもの2"]
}
  `)

  const text = result.response.text()
  const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim()
  
  try {
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ 
      title: dishName,
      steps: [text], 
      ingredients: [], 
      shopping: [] 
    })
  }
}
