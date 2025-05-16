import React from "react"
import { useAuth } from "../contexts/AuthContext"

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

const DashboardPage: React.FC = () => {
  const { profile } = useAuth()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {profile?.full_name}
        </h1>
        <p className="text-gray-600">Aqui está um resumo das suas atividades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Placeholder cards for dashboard content */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Orçamentos Pendentes
          </h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pedidos em Aberto
          </h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vendas do Mês
          </h3>
          <p className="text-3xl font-bold text-primary-600">R$ 0,00</p>
        </div>
      </div>

      {/* Gráfico semanal de vendas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendas na Semana
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
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
