import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "../hooks/useQuotes"

interface OrderEditModalProps {
  order: Quote
  isOpen: boolean
  orderStatus: string
  statusOptions: { value: string; label: string }[]
  onClose: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onSave: () => void
}

const OrderEditModal: React.FC<OrderEditModalProps> = ({
  order,
  isOpen,
  orderStatus,
  statusOptions,
  onClose,
  onChange,
  onStatusChange,
  onSave
}) => {
  return (
    <AnimatePresence>
      {isOpen && order && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl border border-gray-200 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={onClose}
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

            <h2 className="text-2xl font-semibold text-blue-600 mb-6 flex items-center gap-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="font-medium text-gray-700">Cliente</label>
                <input
                  type="text"
                  name="customer_name"
                  value={order.customer_name}
                  onChange={onChange}
                  className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Produto</label>
                <input
                  type="text"
                  name="product"
                  value={order.product}
                  onChange={onChange}
                  className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Quantidade</label>
                <input
                  type="number"
                  name="quantity"
                  value={order.quantity}
                  onChange={onChange}
                  className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Valor Total</label>
                <input
                  type="number"
                  name="total_price"
                  value={order.total_price}
                  onChange={onChange}
                  className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <label className="font-medium text-gray-700">Pago:</label>
                <input
                  type="checkbox"
                  name="paid"
                  checked={order.paid}
                  onChange={onChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={orderStatus}
                  onChange={onStatusChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OrderEditModal
