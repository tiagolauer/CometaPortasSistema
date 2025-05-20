import React, { useState } from "react"
import { useOrders, Order } from "../hooks/useOrders"

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "entregue":
      return "bg-purple-100 text-purple-800"
    case "cancelado":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    entregue: "Entregue",
    cancelado: "Cancelado"
  }
  return statusMap[status] || "Desconhecido"
}

const HistoricoPage: React.FC = () => {
  const { orders, loading } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtra apenas pedidos entregues ou cancelados
  const filteredOrders = orders.filter(
    order => order.status === "entregue" || order.status === "cancelado"
  )

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Histórico de Vendas
        </h1>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pago
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Carregando pedidos...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum pedido entregue ou cancelado.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                    <div>{order.customer_name}</div>
                    <div className="text-xs text-gray-500">{order.address}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {order.product.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    }).format(order.total_price)}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {order.paid ? "Sim" : "Não"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-2xl border border-gray-200 relative mx-2">
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors"
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
                {selectedOrder.product.replace(/_/g, " ")}
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
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {getStatusText(selectedOrder.status)}
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
