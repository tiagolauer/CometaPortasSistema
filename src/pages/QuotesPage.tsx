import React, { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import Button from "../components/Button"
import Modal from "../components/Modal"
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

const initialFormData = {
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
}

const QuotesPage: React.FC = () => {
  const { user } = useAuth()

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [clienteInput, setClienteInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const filteredClientes =
    clienteInput.length === 0
      ? clientes.slice(0, 2)
      : clientes.filter(c =>
          c.nome.toLowerCase().includes(clienteInput.toLowerCase())
        )

  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) console.error("Erro ao buscar orçamentos:", error)
      else setQuotes((data || []).filter(q => q.status !== "approved"))

      setIsLoading(false)
    }

    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error) setClientes(data || [])
    }

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) window.location.href = "/login"
    }

    fetchQuotes()
    fetchClientes()
    checkSession()
  }, [])

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
      const updated = { ...prev, [name]: newValue }
      return {
        ...updated,
        total_price: calculateTotalPrice(updated)
      }
    })

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples (adicione mais conforme necessário)
    const newErrors: Record<string, string> = {};
    if (!formData.customer_name) newErrors.customer_name = "Cliente obrigatório";
    if (!formData.type) newErrors.type = "Tipo obrigatório";
    if (!formData.height) newErrors.height = "Altura obrigatória";
    if (!formData.width) newErrors.width = "Largura obrigatória";
    if (!formData.total_price) newErrors.total_price = "Preço obrigatório";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingQuote) {
      // Atualizar orçamento existente
      const quoteToUpdate = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        type: formData.type,
        address: formData.address,
        height: Number(formData.height),
        width: Number(formData.width),
        frame_width: formData.frame_width ? Number(formData.frame_width) : null,
        needs_installation: formData.needs_installation,
        fechadura: formData.fechadura,
        dobradica: formData.dobradica,
        total_price: Number(formData.total_price),
        status: formData.status,
      };

      const { error, data } = await supabase
        .from("quotes")
        .update(quoteToUpdate)
        .eq("id", editingQuote.id)
        .select();
    
      if (error) {
        alert("Erro ao atualizar orçamento: " + error.message);
        return;
      }
    
      // Se o orçamento foi aprovado, cria um pedido na tabela orders
      if (formData.status === "approved") {
        const orderToInsert = {
          customer_name: formData.customer_name,
          product: formData.type,
          quantity: 1, // ou ajuste conforme necessário
          total_price: Number(formData.total_price),
          paid: false,
          status: "na_fila",
          created_by: user.id,
        };
        const { error: orderError } = await supabase
          .from("orders")
          .insert([orderToInsert]);
        if (orderError) {
          alert("Erro ao criar pedido: " + orderError.message);
        }
      }
    
      // Atualiza lista local buscando novamente do banco
      const { data: updatedQuotes, error: fetchError } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
    
      if (!fetchError) setQuotes((updatedQuotes || []).filter(q => q.status !== "approved"));
    } else {
      // Criar novo orçamento
      const quoteToInsert = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        type: formData.type,
        address: formData.address,
        height: Number(formData.height),
        width: Number(formData.width),
        frame_width: formData.frame_width ? Number(formData.frame_width) : null,
        needs_installation: formData.needs_installation,
        fechadura: formData.fechadura,
        dobradica: formData.dobradica,
        total_price: Number(formData.total_price),
        status: formData.status,
        created_by: user.id
      };

      const { error, data } = await supabase.from("quotes").insert([quoteToInsert]);
      if (error) {
        alert("Erro ao cadastrar orçamento: " + error.message);
        return;
      }

      // Se já for aprovado na criação, cria o pedido também
      if (formData.status === "approved") {
        const orderToInsert = {
          customer_name: formData.customer_name,
          product: formData.type,
          quantity: 1, // ou ajuste conforme necessário
          total_price: Number(formData.total_price),
          paid: false,
          status: "na_fila",
          created_by: user.id,
        };
        const { error: orderError } = await supabase
          .from("orders")
          .insert([orderToInsert]);
        if (orderError) {
          alert("Erro ao criar pedido: " + orderError.message);
        }
      }

      // Atualiza lista local buscando novamente do banco
      const { data: updatedQuotes, error: fetchError } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!fetchError) setQuotes((updatedQuotes || []).filter(q => q.status !== "approved"));
    }

    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditingQuote(null);
    setSelectedCliente(null);
    setClienteInput("");
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-lg sm:text-xl font-semibold">Orçamentos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo orçamento
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <QuotesTable
          quotes={quotes}
          isLoading={isLoading}
          setEditingQuote={setEditingQuote}
          setFormData={setFormData}
          setIsModalOpen={setIsModalOpen}
          getStatusBadgeClass={status =>
            status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
          getStatusText={status =>
            status === "pending"
              ? "Pendente"
              : status === "approved"
              ? "Aprovado"
              : "Rejeitado"
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData(initialFormData)
          setEditingQuote(null)
          setSelectedCliente(null)
          setClienteInput("")
        }}
      >
        <QuoteForm
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          errors={errors}
          setErrors={setErrors}
          clienteInput={clienteInput}
          setClienteInput={setClienteInput}
          filteredClientes={filteredClientes}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          handleSelectCliente={handleSelectCliente}
          editingQuote={!!editingQuote}
          setIsModalOpen={setIsModalOpen}
          setSelectedCliente={setSelectedCliente}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </div>
  )
}

const calculateTotalPrice = (data: typeof initialFormData): number => {
  if (!data.type) return 0

  const width = Number(data.width) || 0
  const basePrices = {
    porta_completa: width <= 89 ? 480 : 1000,
    folha_de_porta: width <= 89 ? 200 : 800,
    janela: 1200
  }

  return basePrices[data.type as keyof typeof basePrices] || 0
}

export default QuotesPage
