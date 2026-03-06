import { genAI } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { dishName } = await request.json()

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const result = await model.generateContent(`
「${dishName}」のレシピを以下の形式で日本語で教えてください。

## レシピ
調理手順を番号付きで書いてください。

## 必要な食材
食材を箇条書きで書いてください。

## 買い物リスト
スーパーで買うべきものだけを箇条書きで書いてください。
  `)

  const text = result.response.text()

  return NextResponse.json({ recipe: text })
}
