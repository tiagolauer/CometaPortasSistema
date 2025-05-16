import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

import LoginPage from "../pages/LoginPage"
import MainLayout from "../layouts/MainLayout"
import DashboardPage from "../pages/DashboardPage"
import QuotesPage from "../pages/QuotesPage"
import OrdersPage from "../pages/OrdersPage"
import HistoricoPage from "../pages/HistoricoPage"
import ClientesPage from "../pages/ClientesPage"
import FinanceiroPage from "../pages/FinanceiroPage"

import ProtectedRoute from "./ProtectedRoute"

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route path="/" element={<ProtectedRoute element={<MainLayout />} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orcamentos" element={<QuotesPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="historico" element={<HistoricoPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
