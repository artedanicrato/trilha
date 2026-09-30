import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { Api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOperator: boolean;
  isGuest: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<void>;
  loginAsGuest: (name?: string, phone?: string) => Promise<void>;
  switchDemoUser: (targetRole: 'ADMIN' | 'OPERATOR' | 'CLIENT' | 'GUEST') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = Api.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await Api.getMe();
      setUser(data.user);
    } catch (err) {
      console.warn('Sessão expirada ou inválida, resetando token:', err);
      Api.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await Api.login(email, pass);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    setLoading(true);
    try {
      const res = await Api.register(data);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async (name?: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await Api.guestLogin(name, phone);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const switchDemoUser = async (targetRole: 'ADMIN' | 'OPERATOR' | 'CLIENT' | 'GUEST') => {
    setLoading(true);
    try {
      if (targetRole === 'ADMIN') {
        const res = await Api.login('admin@trilhasonora.com.br', 'admin123');
        setUser(res.user);
      } else if (targetRole === 'OPERATOR') {
        const res = await Api.login('producao@trilhasonora.com.br', 'operador123');
        setUser(res.user);
      } else if (targetRole === 'CLIENT') {
        const res = await Api.login('cliente@cariri.com.br', 'cliente123');
        setUser(res.user);
      } else {
        const res = await Api.guestLogin('Visitante Cariri', '(88) 98800-0000');
        setUser(res.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Api.clearToken();
    setUser(null);
  };

  const role: UserRole = user?.role || 'GUEST';
  const isAuthenticated = !!user && role !== 'GUEST';
  const isAdmin = role === 'ADMIN';
  const isOperator = role === 'OPERATOR' || role === 'ADMIN';
  const isGuest = !user || role === 'GUEST';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        isOperator,
        isGuest,
        loading,
        login,
        register,
        loginAsGuest,
        switchDemoUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
