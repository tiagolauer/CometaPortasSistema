import React, { useState } from "react"
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

// Dados de exemplo para o gráfico financeiro
const data = [
  { mes: "Jan", receitas: 5000, despesas: 3200 },
  { mes: "Fev", receitas: 4800, despesas: 2900 },
  { mes: "Mar", receitas: 5300, despesas: 3400 },
  { mes: "Abr", receitas: 6000, despesas: 4100 },
  { mes: "Mai", receitas: 6200, despesas: 3900 },
  { mes: "Jun", receitas: 5800, despesas: 3700 },
]

interface Despesa {
  descricao: string
  valor: number
  data: string
}

const FinanceiroPage: React.FC = () => {
  const { profile } = useAuth()

  // Estado para despesas
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [novaDespesa, setNovaDespesa] = useState<Despesa>({
    descricao: "",
    valor: 0,
    data: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNovaDespesa(prev => ({
      ...prev,
      [name]: name === "valor" ? Number(value) : value,
    }))
  }

  const handleAddDespesa = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.data) return
    setDespesas(prev => [...prev, novaDespesa])
    setNovaDespesa({ descricao: "", valor: 0, data: "" })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Financeiro
        </h1>
        <p className="text-gray-600">Visão geral financeira da empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contas a Receber
          </h3>
          <p className="text-3xl font-bold text-primary-600">R$ 0,00</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contas a Pagar
          </h3>
          <p className="text-3xl font-bold text-primary-600">R$ 0,00</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Saldo Atual
          </h3>
          <p className="text-3xl font-bold text-primary-600">R$ 0,00</p>
        </div>
      </div>

      {/* Gráfico financeiro */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fluxo de Caixa (Exemplo)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="receitas" stroke="#22c55e" strokeWidth={3} name="Receitas" />
            <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={3} name="Despesas" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Área de cadastro e listagem de despesas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cadastrar Despesa
        </h3>
        <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleAddDespesa}>
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            className="border rounded px-3 py-2 flex-1"
            value={novaDespesa.descricao}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="valor"
            placeholder="Valor"
            className="border rounded px-3 py-2 w-32"
            value={novaDespesa.valor || ""}
            onChange={handleChange}
            min={0}
            step="0.01"
            required
          />
          <input
            type="date"
            name="data"
            className="border rounded px-3 py-2 w-40"
            value={novaDespesa.data}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition"
          >
            Adicionar
          </button>
        </form>

        <h4 className="text-md font-semibold text-gray-800 mb-2">Despesas Cadastradas</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Descrição</th>
                <th className="px-4 py-2 text-left">Valor</th>
                <th className="px-4 py-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {despesas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-gray-500">Nenhuma despesa cadastrada.</td>
                </tr>
              ) : (
                despesas.map((d, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{d.descricao}</td>
                    <td className="px-4 py-2">R$ {d.valor.toFixed(2)}</td>
                    <td className="px-4 py-2">{d.data}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FinanceiroPage