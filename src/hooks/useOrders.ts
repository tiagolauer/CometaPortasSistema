import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export type Order = {
  id: string
  customer_name: string
  product: string
  quantity: number
  total_price: number
  paid: boolean
  created_at: string
  status: string
  created_by: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from<Order>("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) setOrders(data)
    setLoading(false)
  }

  const updateOrder = async (order: Order) => {
    // Remover o campo id do objeto de atualização
    const { id, ...fieldsToUpdate } = order
    const { error, data } = await supabase
      .from<Order>("orders")
      .update(fieldsToUpdate)
      .eq("id", id)
      .select()
    if (!error && data) {
      setOrders(prev =>
        prev.map(o => (o.id === id ? { ...o, ...fieldsToUpdate } : o))
      )
    }
    return error
  }

  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase
      .from<Order>("orders")
      .delete()
      .eq("id", orderId)
    if (!error) {
      setOrders(prev => prev.filter(o => o.id !== orderId))
    }
    return error
  }

  return { orders, loading, updateOrder, deleteOrder }
}