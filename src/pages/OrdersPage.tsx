import React, { useState, useEffect } from "react"
import { supabase } from "../lib/supabase" // Certifique-se de importar o supabase
import { Edit, Trash } from "lucide-react" // Importa os ícones desejados

interface Order {
  id: string
  customer_name: string
  product: string
  quantity: number
  total_price: number
  paid: boolean
  created_at: string
  status: string
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderStatus, setOrderStatus] = useState<string>("na_fila") // Define o status padrão como "na_fila"

  useEffect(() => {
    const fetchApprovedQuotes = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("status", "approved")

      if (error) {
        console.error("Erro ao buscar orçamentos aprovados:", error)
      } else {
        const approvedOrders = data.map(quote => ({
          id: quote.id,
          customer_name: quote.customer_name,
          product: quote.type,
          quantity: 1, // Ajuste conforme necessário
          total_price: quote.total_price,
          paid: false, // Ajuste conforme necessário
          created_at: quote.created_at,
          status: "na_fila" // Define o status padrão como "na_fila"
        }))
        setOrders(approvedOrders)
      }
    }

    fetchApprovedQuotes()
  }, [])

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order)
    setOrderStatus(order.status || "fila")
    setIsModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedOrder(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(e.target.value)
  }

  const handleSaveChanges = async () => {
    if (selectedOrder) {
      try {
        const { error } = await supabase
          .from("orders")
          .update({
            customer_name: selectedOrder.customer_name,
            product: selectedOrder.product,
            quantity: selectedOrder.quantity,
            total_price: selectedOrder.total_price,
            paid: selectedOrder.paid,
            status: orderStatus
          })
          .eq("id", selectedOrder.id)

        if (error) {
          console.error("Erro ao atualizar pedido:", error)
          return
        }

        setOrders(prev =>
          prev.map(o =>
            o.id === selectedOrder.id
              ? { ...selectedOrder, status: orderStatus }
              : o
          )
        )
        setIsModalOpen(false)
      } catch (error) {
        console.error("Erro ao salvar alterações:", error)
      }
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Deseja realmente excluir este pedido?")) {
      const { error } = await supabase.from("orders").delete().eq("id", orderId)
      if (!error) {
        setOrders(orders.filter(order => order.id !== orderId))
      } else {
        console.error("Erro ao excluir pedido:", error)
      }
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order)} // Adicione aqui
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.product.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    }).format(order.total_price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.paid ? "Sim" : "Não"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Edit className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edição do pedido */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl border border-gray-300 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-5 4h18"
                />
              </svg>
              Visualizar Pedido
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="font-semibold text-gray-700">Cliente:</label>
                <input
                  type="text"
                  name="customer_name"
                  value={selectedOrder.customer_name}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Produto:</label>
                <input
                  type="text"
                  name="product"
                  value={selectedOrder.product}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  Quantidade:
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={selectedOrder.quantity}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  Valor Total:
                </label>
                <input
                  type="number"
                  name="total_price"
                  value={selectedOrder.total_price}
                  onChange={handleInputChange}
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex items-center">
                <label className="font-semibold text-gray-700 mr-2">
                  Pago:
                </label>
                <input
                  type="checkbox"
                  name="paid"
                  checked={selectedOrder.paid}
                  onChange={e =>
                    setSelectedOrder(prev =>
                      prev ? { ...prev, paid: e.target.checked } : null
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={orderStatus}
                  onChange={handleStatusChange}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                onClick={handleSaveChanges}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "na_fila":
      return "bg-blue-100 text-blue-800"
    case "em_producao":
      return "bg-yellow-100 text-yellow-800"
    case "pronto":
      return "bg-green-100 text-green-800"
    case "entregue":
      return "bg-purple-100 text-purple-800"
    case "cancelado":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  const statusMap = {
    na_fila: "Na Fila",
    em_producao: "Em Produção",
    pronto: "Pronto",
    entregue: "Entregue",
    cancelado: "Cancelado"
  }
  return statusMap[status] || "Desconhecido"
}

const statusOptions = [
  { value: "na_fila", label: "Na Fila" },
  { value: "em_producao", label: "Em Produção" },
  { value: "pronto", label: "Pronto" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" }
]

useEffect(() => {
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar pedidos:", error)
    } else {
      setOrders(data || [])
    }
  }

  fetchOrders()
}, [])
