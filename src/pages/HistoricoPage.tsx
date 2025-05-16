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
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Vendas</h1>
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass()}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-lg shadow-lg p-8 min-w-[340px] max-w-[90vw] border border-blue-200">
            <button
              className="absolute top-3 right-3 text-blue-600 hover:text-red-500 transition-colors text-2xl font-bold"
              onClick={closeModal}
              aria-label="Fechar"
              title="Fechar"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Detalhes do Pedido</h2>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Cliente:</span>
              <span className="text-gray-900">{selectedOrder.customer_name}</span>
            </div>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Produto:</span>
              <span className="text-blue-700 font-medium">{selectedOrder.product}</span>
            </div>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Quantidade:</span>
              <span className="text-gray-900">{selectedOrder.quantity}</span>
            </div>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Valor Total:</span>
              <span className="text-green-700 font-bold">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(selectedOrder.total_price)}
              </span>
            </div>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Status:</span>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold shadow">
                {getStatusText()}
              </span>
            </div>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Pago:</span>
              <span className={`font-bold ${selectedOrder.paid ? "text-green-600" : "text-red-600"}`}>
                {selectedOrder.paid ? "Sim" : "Não"}
              </span>
            </div>
            <div className="mb-3 flex items-center">
              <span className="font-semibold text-gray-700 w-28">Data:</span>
              <span className="text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
            <button
              className="mt-6 w-full py-2 rounded bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition-all"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoricoPage