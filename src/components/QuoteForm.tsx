import React from "react"
import InputField from "./InputField"
import Checkbox from "./Checkbox"
import Button from "./Button"
import { Cliente } from "../pages/QuotesPage"
import { Quote } from "../types" // <-- Ideal mover o tipo pra um lugar global

interface QuoteFormProps {
  formData: Partial<Quote>
  errors: Record<string, string>
  clienteInput: string
  showSuggestions: boolean
  filteredClientes: Cliente[]
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleSelectCliente: (cliente: Cliente) => void
  setClienteInput: (value: string) => void
  setShowSuggestions: (value: boolean) => void
  setSelectedCliente: (cliente: Cliente | null) => void
  setFormData: React.Dispatch<React.SetStateAction<Partial<Quote>>>
  handleSubmit: (e: React.FormEvent) => void
  editingQuote: boolean
  setIsModalOpen: (value: boolean) => void
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  formData,
  errors,
  clienteInput,
  showSuggestions,
  filteredClientes,
  handleInputChange,
  handleSelectChange,
  handleSelectCliente,
  setClienteInput,
  setShowSuggestions,
  setSelectedCliente,
  setFormData,
  handleSubmit,
  editingQuote,
  setIsModalOpen
}) => {
  const handleGenericChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleClienteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setClienteInput(value)
    setShowSuggestions(true)
    setSelectedCliente(null)
    setFormData(prev => ({
      ...prev,
      customer_name: "",
      phone: "",
      address: ""
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo de Produto */}
      <div className="space-y-1">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Produto
        </label>
        <select
          id="type"
          name="type"
          value={formData.type || ""}
          onChange={handleGenericChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
          required
        >
          <option value="">Selecionar...</option>
          <option value="porta_completa">Porta Completa</option>
          <option value="folha_de_porta">Folha de Porta</option>
          <option value="janela">Janela</option>
        </select>
        {errors.type && (
          <p className="text-red-600 text-xs mt-1">{errors.type}</p>
        )}
      </div>

      {/* Cliente com Autocomplete */}
      <div className="relative">
        <InputField
          id="cliente"
          name="cliente"
          label="Cliente"
          type="text"
          autoComplete="off"
          value={clienteInput}
          onFocus={() => setShowSuggestions(true)}
          onChange={handleClienteInputChange}
          error={errors.customer_name}
          required
        />
        {showSuggestions && filteredClientes.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow max-h-40 overflow-auto">
            {filteredClientes.map(cliente => (
              <li
                key={cliente.id}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
                onMouseDown={() => handleSelectCliente(cliente)}
              >
                <span className="font-medium">{cliente.nome}</span>
                <div className="text-xs text-gray-500">
                  {cliente.telefone} - {cliente.endereco}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Status do Orçamento */}
      <div>
        <label className="font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleSelectChange}
          className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Cancelado</option>
        </select>
      </div>
      {/* Altura e Largura */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-gray-700">Altura (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">Medida em centímetros</span> {/* Marcador de medida */}
        </div>

        <div>
          <label className="font-medium text-gray-700">Largura (cm)</label>
          <input
            type="number"
            name="width"
            value={formData.width}
            onChange={handleInputChange}
            className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">Medida em centímetros</span> {/* Marcador de medida */}
        </div>
      </div>

      {/* Caixilho (condicional) */}
      {formData.type === "porta_completa" && (
        <InputField
          id="frame_width"
          name="frame_width"
          label="Largura do Caixilho (cm)"
          type="number"
          value={formData.frame_width || ""}
          onChange={handleGenericChange}
          error={errors.frame_width}
        />
      )}

      {/* Checkboxes */}
      <div className="grid grid-cols-2 gap-4">
        <Checkbox
          id="needs_installation"
          name="needs_installation"
          label="Necessita instalação?"
          checked={formData.needs_installation || false}
          onChange={handleGenericChange}
        />
        <Checkbox
          id="fechadura"
          name="fechadura"
          label="Incluir fechadura?"
          checked={formData.fechadura || false}
          onChange={handleGenericChange}
        />
        <Checkbox
          id="dobradica"
          name="dobradica"
          label="Incluir dobradiça?"
          checked={formData.dobradica || false}
          onChange={handleGenericChange}
        />
      </div>

      {/* Preço Total */}
      <InputField
        id="total_price"
        name="total_price"
        label="Preço Total (R$)"
        type="number"
        value={formData.total_price || ""}
        onChange={handleGenericChange}
        error={errors.total_price}
        required
        disabled
      />

      {/* Botões */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsModalOpen(false)}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {editingQuote ? "Atualizar Orçamento" : "Criar Orçamento"}
        </Button>
      </div>
    </form>
  )
}

export default QuoteForm
