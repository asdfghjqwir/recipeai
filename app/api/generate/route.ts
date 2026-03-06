import { genAI } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { dishName } = await request.json()
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

  const result = await model.generateContent(`
以下の入力が料理名かどうか判断してください。
入力：「${dishName}」

料理名であれば以下のJSON形式で返してください。
料理名でなければ {"error": "料理名を入力してください"} のみ返してください。
マークダウン記法は使わないでください。
他の文章は一切不要です。

{
  "title": "料理の正式名称",
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