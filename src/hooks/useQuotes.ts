import { useState, useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase"

export interface Quote {
  id: string
  customer_name: string
  product: string
  quantity: number
  total_price: number
  paid: boolean
  created_at: string
  status: string
}

// Tipo bruto vindo do banco
interface SupabaseQuote {
  id: string
  customer_name: string
  type: string
  quantity?: number
  total_price: number
  paid?: boolean
  created_at: string
  status?: string
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApprovedQuotes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (error) throw new Error(error.message)

      const formatted = (data as SupabaseQuote[]).map(quote => ({
        id: quote.id,
        customer_name: quote.customer_name,
        product: quote.type,
        quantity: typeof quote.quantity === "number" ? quote.quantity : 1,
        total_price: quote.total_price,
        paid: typeof quote.paid === "boolean" ? quote.paid : false,
        created_at: quote.created_at,
        status: quote.status ?? "na_fila"
      }))

      setQuotes(formatted)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar orçamentos.")
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApprovedQuotes()
  }, [fetchApprovedQuotes])

  const updateQuote = useCallback(async (quote: Quote) => {
    const { error } = await supabase
      .from("quotes")
      .update({
        customer_name: quote.customer_name,
        type: quote.product,
        quantity: quote.quantity,
        total_price: quote.total_price,
        paid: quote.paid,
        status: quote.status
      })
      .eq("id", quote.id)

    if (!error) {
      setQuotes(prev =>
        prev.map(q => (q.id === quote.id ? { ...quote } : q))
      )
    }

    return error
  }, [])

  const deleteQuote = useCallback(async (id: string) => {
    const { error } = await supabase.from("quotes").delete().eq("id", id)

    if (!error) {
      setQuotes(prev => prev.filter(q => q.id !== id))
    }

    return error
  }, [])

  return {
    quotes,
    setQuotes,
    loading,
    error,
    updateQuote,
    deleteQuote,
    refetch: fetchApprovedQuotes
  }
}
