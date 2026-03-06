import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ recipes: data })
}

export async function POST(request: Request) {
  const { dish_name, steps, ingredients, shopping } = await request.json()

  const { data, error } = await supabase
    .from('recipes')
    .insert([{ 
      dish_name, 
      recipe: JSON.stringify({ steps, ingredients, shopping }),
      ingredients: '',
      shopping_list: ''
    }])
    .select()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ recipe: data[0] })
}