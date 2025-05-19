import React from "react"
import InputField from "./InputField"
import Checkbox from "./Checkbox"
import Button from "./Button"
import { Cliente } from "../pages/QuotesPage"

interface QuoteFormProps {
  formData: any
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
  setFormData: (fn: (prev: any) => any) => void
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
  const handleSubmitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tipo de Produto
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleSubmitChange} // Use handleSubmitChange aqui
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
          required
        >
          <option value="">Selecionar...</option>
          <option value="porta_completa">Porta Completa</option>
          <option value="folha_de_porta">Folha de Porta</option>
          <option value="janela">Janela</option>
        </select>
        {errors.type && (
          <div className="text-red-600 text-xs mt-1">{errors.type}</div>
        )}
      </div>
    <div className="relative">
      <InputField
        id="cliente"
        name="cliente"
        label="Cliente"
        type="text"
        autoComplete="off"
        value={clienteInput}
        onFocus={() => setShowSuggestions(true)}
        onChange={e => {
          setClienteInput(e.target.value)
          setShowSuggestions(true)
          setSelectedCliente(null)
          setFormData(prev => ({
            ...prev,
            customer_name: "",
            phone: "",
            address: ""
          }))
        }}
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
    <div className="grid grid-cols-2 gap-4">
      <InputField
        id="height"
        name="height"
        label="Altura (cm)"
        type="number"
        value={formData.height}
        onChange={handleInputChange}
        error={errors.height}
        required
      />
      <InputField
        id="width"
        name="width"
        label="Largura (cm)"
        type="number"
        value={formData.width}
        onChange={handleInputChange}
        error={errors.width}
        required
      />
    </div>
    {formData.type === "porta_completa" && (
      <InputField
        id="frame_width"
        name="frame_width"
        label="Largura do Caixilho (cm)"
        type="number"
        value={formData.frame_width}
        onChange={handleInputChange}
        error={errors.frame_width}
      />
    )}
    <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-700">
      <div>
        <strong>Altura:</strong> {formData.height || "-"} cm
      </div>
      <div>
        <strong>Largura:</strong> {formData.width || "-"} cm
      </div>
      {formData.type === "porta_completa" && (
        <div>
          <strong>Caixilho:</strong> {formData.frame_width || "-"} cm
        </div>
      )}
    </div>
    <Checkbox
      id="needs_installation"
      name="needs_installation"
      label="+ Instalação (R$ 120,00)"
      checked={formData.needs_installation}
      onChange={handleInputChange}
    />
    {formData.type === "folha_de_porta" && (
      <div className="flex flex-col gap-2 mt-2">
        <Checkbox
          id="fechadura"
          name="fechadura"
          label="+ Fechadura (R$ 75,00)"
          checked={formData.fechadura}
          onChange={handleInputChange}
        />
        <Checkbox
          id="dobradica"
          name="dobradica"
          label="+ Dobradiça (R$ 75,00)"
          checked={formData.dobradica}
          onChange={handleInputChange}
        />
      </div>
    )}
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-lg font-medium text-gray-900">
        Valor Total:{" "}
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        }).format(formData.total_price)}
      </div>
    </div>
    <div className="space-y-1">
      <label
        htmlFor="status"
        className="block text-sm font-medium text-gray-700"
      >
        Status do Orçamento
      </label>
      <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleSubmitChange} // Troque handleSelectChange por handleSubmitChange
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
        required
      >
        <option value="pending">Pendente</option>
        <option value="approved">Aprovado</option>
        <option value="rejected">Cancelado</option>
      </select>
    </div>
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
        Cancelar
      </Button>
      <Button
        type="submit"
        className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 font-semibold"
      >
        {editingQuote ? "Atualizar" : "Criar"} Orçamento
      </Button>
    </div>
  </form>
) // <-- Adicione este parêntese para fechar o return corretamente
}

export default QuoteForm