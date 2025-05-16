import React, { useState } from "react"
import { Plus } from "lucide-react"
import Button from "../components/Button"
import Modal from "../components/Modal"
import InputField from "../components/InputField"
import Checkbox from "../components/Checkbox"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"

interface Quote {
  id: string
  customer_name: string
  phone: string
  type: "porta_completa" | "folha_de_porta" | "janela"
  address: string
  height: number
  width: number
  frame_width?: number
  needs_installation: boolean
  total_price: number
  created_at: string
  status: "pending" | "approved" | "rejected"
}

import { mockClientes } from "../mocks/mockClientes"

const QuotesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    type: "",
    address: "",
    height: "",
    width: "",
    frame_width: "",
    needs_installation: false,
    total_price: 0
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [clienteInput, setClienteInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  // Filtra clientes para o autocomplete
  const filteredClientes =
    clienteInput.length === 0
      ? mockClientes.slice(0, 2)
      : mockClientes.filter(c =>
          c.nome.toLowerCase().includes(clienteInput.toLowerCase())
        )

  const handleSelectCliente = (cliente: any) => {
    setSelectedCliente(cliente)
    setClienteInput(cliente.nome)
    setShowSuggestions(false)
    setFormData(prev => ({
      ...prev,
      customer_name: cliente.nome,
      phone: cliente.telefone,
      address: cliente.endereco
    }))
    setErrors(prev => ({
      ...prev,
      customer_name: "",
      phone: "",
      address: ""
    }))
  }

  // Dados temporários de orçamentos
  const quotes: Quote[] = [
    {
      id: "1",
      customer_name: "João Silva",
      phone: "(11) 98765-4321",
      address: "Rua das Flores, 123 - São Paulo, SP",
      height: 100,
      width: 150,
      frame_width: 10,
      needs_installation: true,
      total_price: 1500,
      created_at: "2025-03-14T10:00:00Z",
      status: "pending"
    },
    {
      id: "2",
      customer_name: "Maria Santos",
      phone: "(11) 91234-5678",
      address: "Av. Paulista, 1000 - São Paulo, SP",
      height: 200,
      width: 180,
      needs_installation: false,
      total_price: 2000,
      created_at: "2025-03-13T15:30:00Z",
      status: "approved"
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: newValue }
      const total = calculateTotalPrice(updatedForm)
      return { ...updatedForm, total_price: total }
    })

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: value }
      const total = calculateTotalPrice(updatedForm)
      return { ...updatedForm, total_price: total }
    })
  }

  // Calcula o valor total do orçamento
  const calculateTotalPrice = (data: typeof formData) => {
    if (!data.type) return 0
    const widthNum = Number(data.width)
    const typePrices = {
      porta_completa: widthNum <= 89 ? 480 : 1000,
      folha_de_porta: widthNum <= 89 ? 200 : 800,
      janela: 1200
    }

    const basePrice = typePrices[data.type]
    const areaPrice = ((Number(data.height) * widthNum) / 10000) * 100
    return basePrice + areaPrice + (data.needs_installation ? 120 : 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.customer_name) newErrors.customer_name = "Nome é obrigatório"
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório"
    if (!formData.address) newErrors.address = "Endereço é obrigatório"
    if (!formData.height) newErrors.height = "Altura é obrigatória"
    if (!formData.width) newErrors.width = "Largura é obrigatória"
    if (!formData.type) newErrors.type = "Tipo é obrigatório"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      if (editingQuote) {
        const { error } = await supabase
          .from("quotes")
          .update({
            ...formData,
            height: Number(formData.height),
            width: Number(formData.width),
            frame_width: formData.frame_width
              ? Number(formData.frame_width)
              : null
          })
          .eq("id", editingQuote.id)
      } else {
        const { error } = await supabase.from("quotes").insert([
          {
            ...formData,
            height: Number(formData.height),
            width: Number(formData.width),
            frame_width: formData.frame_width
              ? Number(formData.frame_width)
              : null,
            created_by: user?.id // <-- Aqui vinculamos o orçamento ao usuário autenticado
          }
        ])
      }

      if (error) throw error

      setIsModalOpen(false)
      setFormData({
        customer_name: "",
        phone: "",
        address: "",
        height: "",
        width: "",
        frame_width: "",
        needs_installation: false,
        total_price: 0
      })
    } catch (error) {
      console.error("Error creating quote:", error)
    }
  }

  const getStatusBadgeClass = (status: Quote["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Quote["status"]) => {
    const statusMap = {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado"
    }
    return statusMap[status]
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Orçamentos
        </h1>
        <Button
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              total_price: calculateTotalPrice(prev)
            }))
            setIsModalOpen(true)
          }}
          className="flex items-center px-6 py-3 text-base font-semibold shadow bg-blue-600 hover:bg-blue-700 text-white transition rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2 text-white" />
          Novo Orçamento
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instalação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map(quote => (
                <tr
                  key={quote.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setEditingQuote(quote)
                    setFormData({
                      customer_name: quote.customer_name,
                      phone: quote.phone,
                      type: quote.type,
                      address: quote.address,
                      height: String(quote.height),
                      width: String(quote.width),
                      frame_width: quote.frame_width
                        ? String(quote.frame_width)
                        : "",
                      needs_installation: quote.needs_installation,
                      total_price: quote.total_price
                    })
                    setIsModalOpen(true)
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {quote.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">{quote.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quote.height}cm x {quote.width}cm
                    {quote.frame_width && (
                      <div className="text-gray-500">
                        Caixilho: {quote.frame_width}cm
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.needs_installation ? "Sim" : "Não"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    }).format(quote.total_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        quote.status
                      )}`}
                    >
                      {getStatusText(quote.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingQuote(null)
          setFormData({
            customer_name: "",
            phone: "",
            type: "",
            address: "",
            height: "",
            width: "",
            frame_width: "",
            needs_installation: false,
            total_price: 0
          })
        }}
        title={editingQuote ? "Editar Orçamento" : "Novo Orçamento"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Produto
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
              required
            >
              <option value="">Selecionar...</option>
              <option value="porta_completa">Porta Completa</option>
              <option value="folha_de_porta">Folha de Porta</option>
              <option value="janela">Janela</option>
            </select>
            {errors.type && (
              <div className="text-red-600 text-xs mt-1">{errors.type}</div>
            )}
          </div>
          <div className="relative">
            <InputField
              id="cliente"
              name="cliente"
              label="Cliente"
              type="text"
              autoComplete="off"
              value={clienteInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={e => {
                setClienteInput(e.target.value)
                setShowSuggestions(true)
                setSelectedCliente(null)
                setFormData(prev => ({
                  ...prev,
                  customer_name: "",
                  phone: "",
                  address: ""
                }))
              }}
              error={errors.customer_name}
              required
            />
            {showSuggestions && filteredClientes.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow max-h-40 overflow-auto">
                {filteredClientes.map(cliente => (
                  <li
                    key={cliente.id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
                    onMouseDown={() => handleSelectCliente(cliente)}
                  >
                    <span className="font-medium">{cliente.nome}</span>
                    <div className="text-xs text-gray-500">
                      {cliente.telefone} - {cliente.endereco}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="height"
              name="height"
              label="Altura (cm)"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              error={errors.height}
              required
            />
            <InputField
              id="width"
              name="width"
              label="Largura (cm)"
              type="number"
              value={formData.width}
              onChange={handleInputChange}
              error={errors.width}
              required
            />
          </div>
          {formData.type === "porta_completa" && (
            <InputField
              id="frame_width"
              name="frame_width"
              label="Largura do Caixilho (cm)"
              type="number"
              value={formData.frame_width}
              onChange={handleInputChange}
              error={errors.frame_width}
            />
          )}
          <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-700">
            <div>
              <strong>Altura:</strong> {formData.height || "-"} cm
            </div>
            <div>
              <strong>Largura:</strong> {formData.width || "-"} cm
            </div>
            {formData.type === "porta_completa" && (
              <div>
                <strong>Caixilho:</strong> {formData.frame_width || "-"} cm
              </div>
            )}
          </div>
          <Checkbox
            id="needs_installation"
            name="needs_installation"
            label="Incluir instalação"
            checked={formData.needs_installation}
            onChange={handleInputChange}
          />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-medium text-gray-900">
              Valor Total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(formData.total_price)}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 font-semibold"
            >
              Criar Orçamento
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default QuotesPage
