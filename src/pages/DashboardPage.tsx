import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { useOrders } from "../hooks/useOrders"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Dados de exemplo para o gráfico semanal de vendas
const data = [
  { dia: "Seg", vendas: 1200 },
  { dia: "Ter", vendas: 2100 },
  { dia: "Qua", vendas: 800 },
  { dia: "Qui", vendas: 1600 },
  { dia: "Sex", vendas: 900 },
  { dia: "Sáb", vendas: 1700 },
  { dia: "Dom", vendas: 1100 },
]

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const DashboardPage: React.FC = () => {
  const { profile } = useAuth()
  const { orders } = useOrders()
  const [pendingQuotes, setPendingQuotes] = useState(0)

  useEffect(() => {
    // Buscar quantidade de orçamentos pendentes
    const fetchPendingQuotes = async () => {
      const { count, error } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
      setPendingQuotes(count || 0)
    }
    fetchPendingQuotes()
  }, [])

  // Pedidos em aberto: status diferente de "entregue" e "cancelado"
  const pedidosEmAberto = orders.filter(
    order => order.status !== "entregue" && order.status !== "cancelado"
  ).length

  // Função para verificar se a data está no mês atual
  function isCurrentMonth(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }

  // Função para verificar se a data está na semana atual
  function isCurrentWeek(dateString: string) {
    const now = new Date()
    const date = new Date(dateString)
    const firstDayOfWeek = new Date(now)
    firstDayOfWeek.setDate(now.getDate() - now.getDay())
    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
    return date >= firstDayOfWeek && date <= lastDayOfWeek
  }

  // Soma dos pedidos entregues no mês atual
  const vendasDoMes = orders
    .filter(
      order =>
        order.status === "entregue" &&
        isCurrentMonth(order.created_at)
    )
    .reduce((sum, order) => sum + (order.total_price || 0), 0)

  // Soma dos pedidos pagos
  const pagamentosRecebidos = orders
    .filter(order => order.paid)
    .reduce((sum, order) => sum + (order.total_price || 0), 0)

  // Gerar dados do gráfico da semana
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const vendasSemana = diasSemana.map((dia, idx) => {
    // idx: 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const total = orders
      .filter(
        order =>
          order.status === "entregue" &&
          isCurrentWeek(order.created_at) &&
          new Date(order.created_at).getDay() === idx
      )
      .reduce((sum, order) => sum + (order.total_price || 0), 0)
    return { dia, vendas: total }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {profile?.full_name}
        </h1>
        <p className="text-gray-600">Aqui está um resumo das suas atividades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Orçamentos Pendentes
          </h3>
          <p className="text-3xl font-bold text-primary-600">{pendingQuotes}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pedidos em Aberto
          </h3>
          <p className="text-3xl font-bold text-primary-600">{pedidosEmAberto}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vendas do Mês
          </h3>
          <p className="text-3xl font-bold text-primary-600">
            {vendasDoMes.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pagamento Recebido
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {pagamentosRecebidos.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </p>
        </div>
      </div>
      {/* Gráfico semanal de vendas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendas na Semana
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={vendasSemana}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="vendas" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DashboardPage
