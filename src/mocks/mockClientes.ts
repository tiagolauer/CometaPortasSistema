export interface Cliente {
  id: string
  nome: string
  endereco: string
  telefone: string
}

export const mockClientes: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    endereco: "Rua das Flores, 123",
    telefone: "(11) 98765-4321"
  },
  {
    id: "2",
    nome: "Maria Santos",
    endereco: "Av. Paulista, 1000",
    telefone: "(11) 91234-5678"
  },
  {
    id: "3",
    nome: "Carlos Oliveira",
    endereco: "Rua das Palmeiras, 456",
    telefone: "(11) 99876-5432"
  }
]