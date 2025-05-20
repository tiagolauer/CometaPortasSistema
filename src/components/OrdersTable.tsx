import React from "react"

interface OrdersTableProps {
  orders: any[]
  getStatusBadgeClass: (status: string) => string
  getStatusText: (status: string) => string
  onEdit: (order: any) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders = [],
  getStatusBadgeClass,
  getStatusText,
  onEdit
}) => (
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
              onClick={() => onEdit(order)}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                <div>{order.customer_name}</div>
                <div className="text-xs text-gray-500">{order.address}</div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default OrdersTable
