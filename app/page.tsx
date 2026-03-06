'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type RecipeData = {
  title: string
  steps: string[]
  ingredients: string[]
  shopping: string[]
}

export default function Home() {
  const [dishName, setDishName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecipeData | null>(null)
  const [resultTitle, setResultTitle] = useState('')
  const [tab, setTab] = useState<'steps' | 'ingredients' | 'shopping'>('steps')
  const [error, setError] = useState('')

  const generate = async () => {
    if (!dishName.trim()) return
    setLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishName })
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
      setLoading(false)
      return
    }
    setError('')
    setResultTitle(data.title || dishName)
    setResult(data)
    setDishName('')
    setTab('steps')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 px-6 py-12 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-xl mx-auto text-center">
          <div className="text-5xl mb-3">🍱</div>
          <h1 className="text-4xl font-black tracking-tight mb-2">RecipeAI</h1>
          <p className="text-white/80 text-sm font-medium">
            料理名を入力するだけで<br />レシピ・食材・買い物リストを瞬時に生成
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-xl shadow-rose-100 mb-6 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400" />
          <CardContent className="pt-6 pb-6">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">
              食べたい料理を入力してください
            </p>
            <div className="flex flex-col gap-3">
              <textarea
                placeholder="例）カルボナーラ、肉じゃが、麻婆豆腐"
                value={dishName}
                onChange={e => setDishName(e.target.value)}
                rows={3}
                className="w-full border-2 border-rose-200 focus:border-rose-400 rounded-xl p-3 text-base resize-none outline-none font-sans"
              />
              <Button
                onClick={generate}
                disabled={loading || !dishName.trim()}
                className="w-full bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white border-0 shadow-lg shadow-rose-200 font-bold py-3"
              >
                {loading ? '⏳ AIが考えています...' : '🍳 レシピを生成する'}
              </Button>
              {error && (
                <p className="text-red-500 text-sm font-bold text-center">{error}</p>
              )}
            </div>
            {loading && (
              <div className="mt-4 flex items-center gap-2 text-rose-400">
                <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold">AIがレシピを考えています...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card className="border-0 shadow-xl shadow-orange-100 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400" />
            <CardContent className="pt-6">

              {/* タイトル */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  <h2 className="text-xl font-black text-gray-800">{resultTitle}</h2>
                </div>
              </div>

              {/* タブ */}
              <div className="flex gap-2 mb-4">
                {[
                  { key: 'steps', label: '📋 手順' },
                  { key: 'ingredients', label: '🥕 食材' },
                  { key: 'shopping', label: '🛒 買い物' }
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key as typeof tab)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tab === t.key
                        ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* タブコンテンツ */}
              <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-4 mb-4">
                {tab === 'steps' && (
                  <ol className="space-y-3">
                    {result.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 bg-gradient-to-r from-orange-400 to-rose-400 text-white rounded-full flex items-center justify-center text-xs font-black">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {tab === 'ingredients' && (
                  <ul className="space-y-2">
                    {result.ingredients.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-rose-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 'shopping' && (
                  <ul className="space-y-2">
                    {result.shopping.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-4 h-4 border-2 border-rose-300 rounded flex items-center justify-center shrink-0">
                          <span className="text-rose-400 text-xs">✓</span>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* XシェアとAmazonボタン */}
              <div className="flex gap-3 mb-3">
                
                 <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('「' + resultTitle + '」のレシピをAIで生成しました🍱\n手順・食材・買い物リストが一瞬で完成！\n\n👇 無料で使えます\nhttps://recipeai-ashen.vercel.app\n\n#RecipeAI #料理 #時短')}`}
                  target="_blank"
                  className="flex-1 text-center py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all"
                >
                  🐦 Xでシェア
                </a>
               <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(resultTitle + ' 食材 調理器具')}&tag=aicheck-22`}
  target="_blank"
  className="flex-1 text-center py-3 bg-amber-400 text-black text-sm font-bold rounded-xl hover:bg-amber-500 transition-all"
>
  📦 食材・調理器具を探す
</a>
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={() => setResult(null)}
                className="w-full py-3 border-2 border-gray-200 text-gray-500 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                ✕ 閉じる
              </button>

            </CardContent>
          </Card>
        )}

        {!result && !loading && (
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