import React, { useState } from "react"
import { motion } from "framer-motion"
import { useQuotes, Quote } from "../hooks/useQuotes"
import OrdersTable from "../components/OrdersTable"
import OrderEditModal from "../components/OrderEditModal"
import { useOrders, Order } from "../hooks/useOrders" // Novo hook para pedidos

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

const OrdersPage: React.FC = () => {
  const { orders, updateOrder, deleteOrder } = useOrders() // Use o novo hook
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderStatus, setOrderStatus] = useState<string>("na_fila")

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order)
    setOrderStatus(order.status || "na_fila")
    setIsModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSelectedOrder(prev =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value
          }
        : null
    )
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(e.target.value)
  }

  const handleSaveChanges = async () => {
    if (selectedOrder) {
      console.log("Salvando pedido:", { ...selectedOrder, status: orderStatus })
      const error = await updateOrder({ ...selectedOrder, status: orderStatus })
      if (error) {
        alert("Erro ao atualizar pedido: " + error.message)
      } else {
        setIsModalOpen(false)
      }
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Deseja realmente excluir este pedido?")) {
      await deleteOrder(orderId)
    }
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pedidos</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <OrdersTable
          orders={orders}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusText={getStatusText}
          onEdit={handleRowClick}
        />
      </div>

      <OrderEditModal
        order={selectedOrder!}
        isOpen={isModalOpen}
        orderStatus={orderStatus}
        statusOptions={statusOptions}
        onClose={() => setIsModalOpen(false)}
        onChange={handleInputChange}
        onStatusChange={handleStatusChange}
        onSave={handleSaveChanges}
      />
    </motion.div>
  )
}

export default OrdersPage
