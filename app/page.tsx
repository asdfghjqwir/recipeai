'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Recipe = {
  id: string
  dish_name: string
  recipe: string
  created_at: string
}

export default function Home() {
  const [dishName, setDishName] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Recipe | null>(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    const res = await fetch('/api/recipes')
    const data = await res.json()
    setRecipes(data.recipes || [])
  }

  const generate = async () => {
    if (!dishName) return
    setLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishName })
    })
    const data = await res.json()

    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dish_name: dishName,
        recipe: data.recipe,
        ingredients: '',
        shopping_list: ''
      })
    })

    setDishName('')
    await fetchRecipes()
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">🍱 RecipeAI</h1>
          <p className="text-zinc-400 text-sm">料理名を入力するだけでレシピ・食材・買い物リストを自動生成</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input
                placeholder="例）カルボナーラ、肉じゃが、麻婆豆腐..."
                value={dishName}
                onChange={e => setDishName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <Button
                onClick={generate}
                disabled={loading || !dishName}
                className="bg-white text-black hover:bg-zinc-200 shrink-0"
              >
                {loading ? '生成中...' : '生成する'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {selected && (
          <Card className="bg-zinc-900 border-zinc-700 mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selected.dish_name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  閉じる
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {selected.recipe}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <p className="text-xs text-zinc-500 mb-3">履歴</p>
          {recipes.map(recipe => (
            <Card
              key={recipe.id}
              className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={() => setSelected(recipe)}
            >
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <span className="text-sm font-medium">{recipe.dish_name}</span>
                <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
                  タップして表示
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
