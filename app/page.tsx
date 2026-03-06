'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
      {/* ヘッダー */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 px-6 py-12 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-xl mx-auto text-center">
          <div className="text-5xl mb-3">🍱</div>
          <h1 className="text-4xl font-black tracking-tight mb-2">RecipeAI</h1>
          <p className="text-white/80 text-sm font-medium">
            料理名を入力するだけで<br />レシピ・食材・買い物リストを瞬時に生成
          </p>
        </div>
        {/* 装飾 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* 入力エリア */}
        <Card className="border-0 shadow-xl shadow-rose-100 mb-6 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400" />
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">
              料理名を入力
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="例）カルボナーラ、肉じゃが..."
                value={dishName}
                onChange={e => setDishName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              <Button
                onClick={generate}
                disabled={loading || !dishName}
                className="bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white border-0 shadow-lg shadow-rose-200 shrink-0 font-bold"
              >
                {loading ? '⏳' : '生成'}
              </Button>
            </div>
            {loading && (
              <div className="mt-4 flex items-center gap-2 text-rose-400">
                <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold">AIがレシピを考えています...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 選択中のレシピ */}
        {selected && (
          <Card className="border-0 shadow-xl shadow-orange-100 mb-6 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  <h2 className="text-xl font-black text-gray-800">{selected.dish_name}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕ 閉じる
                </Button>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                  {selected.recipe}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 履歴 */}
        {recipes.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
              📋 生成履歴
            </p>
            <div className="space-y-2">
              {recipes.map((recipe, i) => (
                <Card
                  key={recipe.id}
                  className="border-0 shadow-md shadow-rose-50 cursor-pointer hover:shadow-lg hover:shadow-rose-100 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                  onClick={() => setSelected(recipe)}
                >
                  <CardContent className="py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {['🍜','🍛','🍣','🥘','🍝','🍲','🥗','🍱'][i % 8]}
                      </span>
                      <span className="text-sm font-bold text-gray-700">{recipe.dish_name}</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-100 to-rose-100 text-rose-500 border-0 text-xs font-bold">
                      見る →
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {recipes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">👨‍🍳</div>
            <p className="text-gray-400 text-sm font-medium">
              料理名を入力して<br />レシピを生成してみましょう
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
