import React, { useState } from "react"
import { Plus } from "lucide-react"
import Button from "../components/Button"
import Modal from "../components/Modal"
import InputField from "../components/InputField"
import Checkbox from "../components/Checkbox"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import QuoteForm from "../components/QuoteForm"
import QuotesTable from "../components/QuotesTable"

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
  fechadura?: boolean
  dobradica?: boolean
  total_price: number
  created_at: string
  status: "pending" | "approved" | "rejected"
}

interface Cliente {
  id: string
  nome: string
  telefone: string
  endereco: string
}

import { mockClientes } from "../mocks/mockClientes"

const QuotesPage: React.FC = () => {
  const { user } = useAuth()
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
    fechadura: false,
    dobradica: false,
    total_price: 0,
    status: "pending" as const
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [clienteInput, setClienteInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([]) // <-- agora vem do banco
  const [isLoading, setIsLoading] = useState(true)
  // Novo estado para clientes cadastrados
  const [clientes, setClientes] = useState<Cliente[]>([])

  // Buscar orçamentos do Supabase ao carregar a página
  React.useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) {
        console.error("Erro ao buscar orçamentos:", error)
      } else {
        setQuotes(data || [])
      }
      setIsLoading(false)
    }
    fetchQuotes()
  }, [])

  // Buscar clientes cadastrados ao carregar a página
  React.useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false })
      if (!error) setClientes(data || [])
    }
    fetchClientes()
  }, [])

  // Verificação de sessão ao carregar a página
  React.useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!data.session) {
        window.location.href = "/login"
      }
    }
    checkSession()
  }, [])

  // Filtra clientes para o autocomplete
  const filteredClientes =
    clienteInput.length === 0
      ? clientes.slice(0, 2)
      : clientes.filter(c =>
          c.nome.toLowerCase().includes(clienteInput.toLowerCase())
        )

  const handleSelectCliente = (cliente: Cliente) => {
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

  const calculateTotalPrice = (data: typeof formData) => {
    if (!data.type) return 0
    const widthNum = Number(data.width) || 0
    const typePrices = {
      porta_completa: widthNum <= 89 ? 480 : 1000,
      folha_de_porta: widthNum <= 89 ? 200 : 800,
      janela: 1200
    }

    const basePrice = typePrices[data.type as keyof typeof typePrices]
    const areaPrice = ((Number(data.height) * widthNum) / 10000) * 100
    let extras = 0
    if (data.needs_installation) extras += 120
    if (data.type === "folha_de_porta") {
      if (data.fechadura) extras += 75
      if (data.dobradica) extras += 75
    }
    return basePrice + areaPrice + extras
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
              : null,
            status: formData.status
          })
          .eq("id", editingQuote.id)

        if (error) throw error
      } else {
        console.log("user?.id:", user?.id) // <-- Adicionado para depuração
        const { error } = await supabase.from("quotes").insert([
          {
            ...formData,
            height: Number(formData.height),
            width: Number(formData.width),
            frame_width: formData.frame_width
              ? Number(formData.frame_width)
              : null,
            created_by: user?.id,
            status: formData.status
          }
        ])

        if (error) throw error
      }

      // Atualiza a lista após inserir/editar
      const { data, error: fetchError } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
      if (!fetchError) setQuotes(data || [])

      setIsModalOpen(false)
      setFormData({
        customer_name: "",
        phone: "",
        type: "",
        address: "",
        height: "",
        width: "",
        frame_width: "",
        needs_installation: false,
        fechadura: false,
        dobradica: false,
        total_price: 0,
        status: "pending"
      })
      setEditingQuote(null)
    } catch (error) {
      console.error("Error saving quote:", error)
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
    <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-0">
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
          className="flex items-center w-full sm:w-auto justify-center px-4 sm:px-6 py-2 sm:py-3 text-base font-semibold shadow bg-blue-600 hover:bg-blue-700 text-white transition rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2 text-white" />
          Novo Orçamento
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <QuotesTable
          quotes={quotes}
          isLoading={isLoading}
          setEditingQuote={setEditingQuote}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusText={getStatusText}
        />
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
            fechadura: false,
            dobradica: false,
            total_price: 0,
            status: "pending"
          })
        }}
        title={editingQuote ? "Editar Orçamento" : "Novo Orçamento"}
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <QuoteForm
            formData={formData}
            errors={errors}
            clienteInput={clienteInput}
            showSuggestions={showSuggestions}
            filteredClientes={filteredClientes}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSelectCliente={handleSelectCliente}
            setClienteInput={setClienteInput}
            setShowSuggestions={setShowSuggestions}
            setSelectedCliente={setSelectedCliente}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            editingQuote={!!editingQuote}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </Modal>
    </div>
  )
}

export default QuotesPage
