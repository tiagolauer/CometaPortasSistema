import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import { ArrowRightIcon } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value.trim(),
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
        general: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setErrors({
            general: 'Email ou senha incorretos',
          });
        } else if (signInError.message.includes('Email not confirmed')) {
          setErrors({
            general: 'Por favor, confirme seu email antes de fazer login',
          });
        } else {
          setErrors({
            general: 'Erro ao fazer login. Tente novamente.',
          });
        }
        return;
      }

      // Auth context will handle navigation
    } catch (error) {
      setErrors({
        general: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Branding Side */}
      <div className="hidden md:flex md:w-1/2 bg-primary-700 text-white p-8 items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <Logo size={60} showText={false} />
          </div>
          <h1 className="text-4xl font-bold mb-3">COMETA</h1>
          <p className="text-xl mb-6">Portas & Janelas</p>
          <p className="text-primary-100 mb-8">
            Sistema de vendas exclusivo para nossa equipe comercial. 
            Acesse sua conta para gerenciar pedidos, consultar estoque e acompanhar entregas.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-medium">1</span>
              </div>
              <p className="text-primary-100 text-sm">Acesse com seu email e senha</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-medium">2</span>
              </div>
              <p className="text-primary-100 text-sm">Gerencie pedidos de forma rápida</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-medium">3</span>
              </div>
              <p className="text-primary-100 text-sm">Acompanhe métricas e vendas em tempo real</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Form Side */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 flex justify-center">
            <Logo size={40} showText={true} />
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Bem-vindo de volta</h2>
              <p className="text-gray-500">Acesse sua conta para continuar</p>
            </div>
            
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <InputField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                
                <InputField
                  id="password"
                  name="password"
                  label="Senha"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                
                <div className="flex items-center justify-between pt-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    label="Lembrar-me"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-100 rounded"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-2"
                >
                  Entrar 
                  <ArrowRightIcon className="ml-2" size={18} />
                </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
              Não tem uma conta?{' '}
              <button 
                type="button"
                className="text-primary-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-100 rounded"
              >
                Fale com o administrador
              </button>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Cometa Portas & Janelas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;