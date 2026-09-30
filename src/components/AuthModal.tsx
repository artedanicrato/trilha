import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login, register, loginAsGuest, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'GUEST'>('LOGIN');

  const [email, setEmail] = useState<string>('admin@trilhasonora.com.br');
  const [password, setPassword] = useState<string>('admin123');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('(88) 9');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'LOGIN') {
        await login(email, password);
      } else if (mode === 'REGISTER') {
        await register({ name, email, password, phone, role: 'CLIENT' });
      } else {
        await loginAsGuest(name || 'Cliente Visitante', phone);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro durante a autenticação. Verifique os dados informados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'ADMIN' | 'OPERATOR' | 'CLIENT' | 'GUEST') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await switchDemoUser(role);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao alternar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header in Trilha Royal Blue */}
        <div className="p-5 border-b border-blue-900 bg-[#004bbf] flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showSubtitle={false} />
            <div>
              <h2 className="font-heading text-base font-bold text-white">
                Autenticação · Trilha Sonora
              </h2>
              <p className="text-[11px] text-blue-100">
                Crato - CE · Criptografia JWT com Bcrypt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="bg-rose-950/80 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/50 text-xs font-bold">
          <button
            onClick={() => {
              setMode('LOGIN');
              setEmail('admin@trilhasonora.com.br');
              setPassword('admin123');
            }}
            className={`py-3 text-center transition-colors ${
              mode === 'LOGIN'
                ? 'border-b-2 border-[#ff6600] text-[#ff944d] bg-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Entrar
          </button>

          <button
            onClick={() => {
              setMode('REGISTER');
              setEmail('');
              setPassword('');
            }}
            className={`py-3 text-center transition-colors ${
              mode === 'REGISTER'
                ? 'border-b-2 border-[#ff6600] text-[#ff944d] bg-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadastrar
          </button>

          <button
            onClick={() => setMode('GUEST')}
            className={`py-3 text-center transition-colors ${
              mode === 'GUEST'
                ? 'border-b-2 border-[#ff6600] text-[#ff944d] bg-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Acesso Livre
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'REGISTER' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Nome Completo</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>
          )}

          {mode === 'GUEST' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Como prefere ser chamado?</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>
          )}

          {(mode === 'LOGIN' || mode === 'REGISTER') && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">E-mail Cadastrado</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>
          )}

          {(mode === 'REGISTER' || mode === 'GUEST') && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">WhatsApp (Cariri 88)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(88) 99225-0000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>
          )}

          {mode !== 'GUEST' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Senha de Acesso</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#ff6600] hover:bg-[#e65500] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Autenticando...' : mode === 'LOGIN' ? 'Acessar Minha Conta' : mode === 'REGISTER' ? 'Cadastrar e Continuar' : 'Entrar com Acesso Livre'}
          </button>
        </form>

        {/* Demo Fast Switch Panel for Testing */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
            <span>Perfis de Demonstração Rápidos:</span>
            <span className="text-[10px] text-[#ff944d]">Clique para alternar</span>
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo('ADMIN')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#ff6600] text-left transition-colors"
            >
              <p className="font-bold text-[#ff944d]">Diretoria (Admin)</p>
              <p className="text-[10px] text-slate-500 truncate">Acesso ao Dashboard e Estoque</p>
            </button>

            <button
              onClick={() => handleQuickDemo('OPERATOR')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#004bbf] text-left transition-colors"
            >
              <p className="font-bold text-blue-400">Produção Gráfica</p>
              <p className="text-[10px] text-slate-500 truncate">Ordens de serviço & status</p>
            </button>

            <button
              onClick={() => handleQuickDemo('CLIENT')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-left transition-colors"
            >
              <p className="font-bold text-white">Cliente (Crato)</p>
              <p className="text-[10px] text-slate-500 truncate">Com histórico de pedidos</p>
            </button>

            <button
              onClick={() => handleQuickDemo('GUEST')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left transition-colors"
            >
              <p className="font-bold text-emerald-400">Acesso Livre</p>
              <p className="text-[10px] text-slate-500 truncate">Navegação sem senha</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
