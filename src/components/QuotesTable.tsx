import React from "react"
import { Quote } from "../pages/QuotesPage"

interface QuotesTableProps {
  quotes: Quote[]
  isLoading: boolean
  setEditingQuote: (quote: Quote) => void
  setFormData: (data: any) => void
  setIsModalOpen: (value: boolean) => void
  getStatusBadgeClass: (status: Quote["status"]) => string
  getStatusText: (status: Quote["status"]) => string
}

const QuotesTable: React.FC<QuotesTableProps> = ({
  quotes,
  isLoading,
  setEditingQuote,
  setFormData,
  setIsModalOpen,
  getStatusBadgeClass,
  getStatusText
}) => {
  const handleRowClick = (quote: Quote) => {
    setEditingQuote(quote)
    setFormData({
      customer_name: quote.customer_name,
      phone: quote.phone,
      type: quote.type,
      address: quote.address,
      height: String(quote.height),
      width: String(quote.width),
      frame_width: quote.frame_width ? String(quote.frame_width) : "",
      needs_installation: quote.needs_installation,
      fechadura: quote.fechadura ?? false,
      dobradica: quote.dobradica ?? false,
      total_price: quote.total_price,
      status: quote.status
    })
    setIsModalOpen(true)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Carregando orçamentos...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Cliente",
                  "Contato",
                  "Dimensões",
                  "Instalação",
                  "Valor Total",
                  "Status"
                ].map(header => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map(quote => (
                <tr
                  key={quote.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(quote)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {quote.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">{quote.address}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {quote.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {quote.height}cm x {quote.width}cm
                    {quote.frame_width && (
                      <div className="text-gray-500">
                        Caixilho: {quote.frame_width}cm
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {quote.needs_installation ? "Sim" : "Não"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatCurrency(quote.total_price)}
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
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum orçamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default QuotesTable
