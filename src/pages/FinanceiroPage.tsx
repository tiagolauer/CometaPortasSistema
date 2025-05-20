import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useOrders } from "../hooks/useOrders"
import { supabase } from "../lib/supabase"

interface Despesa {
  descricao: string
  valor: number
  data: string
  pago: boolean
}

const CardResumo: React.FC<{ titulo: string; valor: string }> = ({ titulo, valor }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
    <p className="text-3xl font-bold text-primary-600">{valor}</p>
  </div>
)

const FormDespesa: React.FC<{
  novaDespesa: Despesa
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}> = ({ novaDespesa, onChange, onSubmit }) => (
  <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={onSubmit}>
    <input
      type="text"
      name="descricao"
      placeholder="Descrição"
      className="border rounded px-3 py-2 flex-1 min-w-[150px]"
      value={novaDespesa.descricao}
      onChange={onChange}
      required
    />
    <input
      type="number"
      name="valor"
      placeholder="Valor"
      className="border rounded px-3 py-2 w-full md:w-32"
      value={novaDespesa.valor || ""}
      onChange={onChange}
      min={0}
      step="0.01"
      required
    />
    <input
      type="date"
      name="data"
      className="border rounded px-3 py-2 w-full md:w-40"
      value={novaDespesa.data}
      onChange={onChange}
      required
    />
    <label className="flex items-center">
      <input
        type="checkbox"
        name="pago"
        checked={novaDespesa.pago}
        onChange={onChange}
        className="mr-2"
      />
      Pago
    </label>
    <button
      type="submit"
      className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition w-full md:w-auto"
    >
      Adicionar
    </button>
  </form>
)

const TabelaDespesas: React.FC<{ despesas: Despesa[], onEdit: (despesa: Despesa) => void }> = ({ despesas, onEdit }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Descrição</th>
          <th className="px-4 py-2 text-left">Valor</th>
          <th className="px-4 py-2 text-left">Data</th>
          <th className="px-4 py-2 text-left">Pago</th>
        </tr>
      </thead>
      <tbody>
        {despesas.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-4 py-2 text-gray-500">Nenhuma despesa cadastrada.</td>
          </tr>
        ) : (
          despesas.map((d, idx) => (
            <tr key={idx} onClick={() => onEdit(d)} className="cursor-pointer hover:bg-gray-100">
              <td className="px-4 py-2">{d.descricao}</td>
              <td className="px-4 py-2">R$ {d.valor.toFixed(2)}</td>
              <td className="px-4 py-2">{d.data}</td>
              <td className="px-4 py-2">{d.pago ? "Sim" : "Não"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)

const FinanceiroPage: React.FC = () => {
  const { profile } = useAuth()
  const { orders } = useOrders()

  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [novaDespesa, setNovaDespesa] = useState<Despesa>({
    descricao: "",
    valor: 0,
    data: "",
    pago: false
  })
  const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Soma dos pedidos não pagos e não cancelados
  const contasAReceber = orders
    ? orders
        .filter(order => !order.paid && order.status !== "cancelado")
        .reduce((sum, order) => sum + (order.total_price || 0), 0)
    : 0

  // Soma dos pedidos pagos
  const saldoAtual = orders
    ? orders
        .filter(order => order.paid)
        .reduce((sum, order) => sum + (order.total_price || 0), 0)
    : 0

  // Soma das despesas não pagas
  const contasAPagar = despesas
    .filter(despesa => !despesa.pago)
    .reduce((sum, despesa) => sum + despesa.valor, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setNovaDespesa(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "valor" ? Number(value) : value,
    }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    if (despesaEditando) {
      setDespesaEditando({
        ...despesaEditando,
        [name]: type === "checkbox" ? checked : name === "valor" ? Number(value) : value,
      })
    }
  }

  const handleEditDespesa = async () => {
    if (!despesaEditando) return

    const { error } = await supabase
      .from("despesas")
      .update(despesaEditando)
      .eq("id", despesaEditando.id)

    if (error) {
      alert("Erro ao editar despesa!")
      return
    }

    const { data, error: fetchError } = await supabase
      .from("despesas")
      .select("*")
      .order("data", { ascending: false })
    if (!fetchError && data) setDespesas(data)

    setIsModalOpen(false)
    setDespesaEditando(null)
  }

  React.useEffect(() => {
    const fetchDespesas = async () => {
      const { data, error } = await supabase
        .from("despesas")
        .select("*")
        .order("data", { ascending: false })
      if (!error && data) setDespesas(data)
    }
    fetchDespesas()
  }, [])

  const handleAddDespesa = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.data) return

    const { error } = await supabase
      .from("despesas")
      .insert([novaDespesa])
    if (error) {
      alert("Erro ao cadastrar despesa!")
      return
    }

    const { data, error: fetchError } = await supabase
      .from("despesas")
      .select("*")
      .order("data", { ascending: false })
    if (!fetchError && data) setDespesas(data)

    setNovaDespesa({ descricao: "", valor: 0, data: "", pago: false })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Financeiro
        </h1>
        <p className="text-gray-600">Visão geral financeira da empresa</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <CardResumo
          titulo="Contas a Receber"
          valor={contasAReceber.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        />
        <CardResumo
          titulo="Contas a Pagar"
          valor={contasAPagar.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        />
        <CardResumo
          titulo="Saldo Atual"
          valor={saldoAtual.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cadastrar Despesa
        </h3>
        <FormDespesa
          novaDespesa={novaDespesa}
          onChange={handleChange}
          onSubmit={handleAddDespesa}
        />
        <h4 className="text-md font-semibold text-gray-800 mb-2">Despesas Cadastradas</h4>
        <TabelaDespesas despesas={despesas} onEdit={(despesa) => {
          setDespesaEditando(despesa)
          setIsModalOpen(true)
        }} />
      </div>

      {isModalOpen && despesaEditando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Despesa</h3>
            <FormDespesa
              novaDespesa={despesaEditando}
              onChange={handleEditChange}
              onSubmit={(e) => {
                e.preventDefault()
                handleEditDespesa()
              }}
            />
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceiroPage