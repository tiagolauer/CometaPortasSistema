import React, { useState } from "react"
import InputField from "../components/InputField"
import { CheckCircle, Edit, Trash2 } from "lucide-react"
import { mockClientes, Cliente } from "../mocks/mockClientes"

interface Cliente {
  id: string
  nome: string
  endereco: string
  telefone: string
}

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes)
  const [form, setForm] = useState({ nome: "", endereco: "", telefone: "" })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!form.endereco.trim()) newErrors.endereco = "Endereço é obrigatório"
    if (!/^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/.test(form.telefone.trim())) {
      newErrors.telefone = "Telefone inválido"
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      if (editIndex !== null) {
        const updated = [...clientes]
        updated[editIndex] = { ...updated[editIndex], ...form }
        setClientes(updated)
        setEditIndex(null)
      } else {
        setClientes([
          ...clientes,
          {
            id: (clientes.length + 1).toString(),
            nome: form.nome,
            endereco: form.endereco,
            telefone: form.telefone
          }
        ])
      }
      setForm({ nome: "", endereco: "", telefone: "" })
      setSuccess(true)
      setIsSubmitting(false)
      setTimeout(() => setSuccess(false), 2000)
    }, 800)
  }

  const handleEdit = (idx: number) => {
    setEditIndex(idx)
    setForm({
      nome: clientes[idx].nome,
      endereco: clientes[idx].endereco,
      telefone: clientes[idx].telefone
    })
    setErrors({})
  }

  const handleDelete = (idx: number) => {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      setClientes(clientes.filter((_, i) => i !== idx))
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Cadastro de Clientes
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 mb-8 max-w-lg"
      >
        <InputField
          id="nome"
          name="nome"
          label="Nome"
          type="text"
          value={form.nome}
          onChange={handleChange}
          error={errors.nome}
          required
        />
        <InputField
          id="endereco"
          name="endereco"
          label="Endereço"
          type="text"
          value={form.endereco}
          onChange={handleChange}
          error={errors.endereco}
          required
        />
        <InputField
          id="telefone"
          name="telefone"
          label="Número para Contato"
          type="text"
          value={form.telefone}
          onChange={handleChange}
          error={errors.telefone}
          required
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {editIndex !== null ? "Salvar Alterações" : "Cadastrar Cliente"}
          {isSubmitting && <span className="ml-2 animate-spin">⏳</span>}
        </button>
        {success && (
          <div className="flex items-center gap-2 mt-3 text-green-600">
            <CheckCircle size={18} /> Cliente salvo com sucesso!
          </div>
        )}
      </form>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Clientes Cadastrados</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endereço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente, idx) => (
              <tr key={cliente.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {cliente.nome}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {cliente.endereco}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {cliente.telefone}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(idx)}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(idx)}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientesPage
