import React, { useState } from "react"

interface Order {
  id: string
  customer_name: string
  product: string
  quantity: number
  total_price: number
  paid: boolean
  created_at: string
}

const orders: Order[] = [
  {
    id: "1",
    customer_name: "João Silva",
    product: "Porta Completa",
    quantity: 1,
    total_price: 3000,
    paid: true,
    created_at: "2025-03-15T10:00:00Z"
  },
  {
    id: "2",
    customer_name: "Maria Santos",
    product: "Janela",
    quantity: 1,
    total_price: 1200,
    paid: false,
    created_at: "2025-03-14T09:30:00Z"
  }
]

const getStatusBadgeClass = () => "bg-gray-200 text-gray-800"
const getStatusText = () => "Entregue"

const HistoricoPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Histórico de Vendas
        </h1>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.product}
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
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass()}`}
                    >
                      {getStatusText()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.paid ? "Sim" : "Não"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200 relative">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={closeModal}
              aria-label="Fechar"
              title="Fechar"
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
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
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
              Detalhes do Pedido
            </h2>
            <div className="space-y-3 mb-6">
              <div>
                <span className="font-semibold text-gray-700">Cliente:</span>{" "}
                {selectedOrder.customer_name}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Produto:</span>{" "}
                {selectedOrder.product}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Quantidade:</span>{" "}
                {selectedOrder.quantity}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Valor Total:
                </span>{" "}
                <span className="text-green-700 font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(selectedOrder.total_price)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Pago:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedOrder.paid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedOrder.paid ? "Sim" : "Não"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Data:</span>{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString("pt-BR")}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                  Entregue
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                onClick={closeModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoricoPage
