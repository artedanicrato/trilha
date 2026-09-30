import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Palette, 
  Package, 
  LayoutDashboard, 
  MapPin, 
  Phone, 
  LogOut, 
  ChevronDown,
  Instagram,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme, SkinTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCustomizer: () => void;
  onOpenTracking: () => void;
  onSelectCategory: (cat: string | null) => void;
  onToggleDashboard: () => void;
  isDashboardOpen: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenCustomizer,
  onOpenTracking,
  onSelectCategory,
  onToggleDashboard,
  isDashboardOpen,
  searchQuery,
  onSearchChange,
}) => {
  const { user, role, isAdmin, isOperator, isAuthenticated, logout, switchDemoUser } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const { theme, setTheme, toggleNextTheme, themeLabels } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-xl">
      
      {/* Upper Info Bar: Official Orange bar with exact Address, Fixed Phone, WhatsApp & Instagram */}
      <div className="bg-[#ff6600] px-3 sm:px-4 py-1 text-xs text-white shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Location & Address: Rua Dr. João Pessoa, 91 - Centro, Crato - CE */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-white">
              <MapPin className="w-3.5 h-3.5 text-white/90 shrink-0" />
              <span>Rua Dr. João Pessoa, 91 · Centro · Crato - CE</span>
            </span>
            <span className="hidden lg:inline text-white/40">|</span>
            <span className="hidden lg:inline text-white/90 font-medium">
              Gráfica Rápida · Informática · Brindes
            </span>
          </div>

          {/* Contacts: Telefone Fixo (88) 3512-3426, WhatsApp (88) 99225-5256 e Instagram @trilhasonoracrato */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs">
            {/* Telefone Fixo */}
            <a 
              href="tel:558835123426" 
              className="flex items-center gap-1 text-white hover:text-blue-100 font-bold"
              title="Telefone Fixo Trilha Sonora"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>Fixo: (88) 3512-3426</span>
            </a>

            <span className="text-white/40">|</span>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/5588992255256" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-white hover:text-emerald-100 font-bold"
              title="WhatsApp Trilha Sonora"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-200" />
              <span>Whats: (88) 99225-5256</span>
            </a>

            <span className="hidden sm:inline text-white/40">|</span>

            {/* Instagram */}
            <a 
              href="https://instagram.com/trilhasonoracrato" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-white hover:text-blue-100 font-semibold"
              title="Instagram Oficial"
            >
              <Instagram className="w-3.5 h-3.5 text-white" />
              <span>@trilhasonoracrato</span>
            </a>
            
            {/* Quick Demo Switcher helper */}
            <div className="flex items-center gap-1 text-[10px] bg-black/20 px-1.5 py-0.5 rounded border border-white/20">
              <span className="text-white/80">Perfil:</span>
              <select
                aria-label="Alternar perfil de demonstração"
                className="bg-transparent text-white border-none text-[10px] focus:outline-none cursor-pointer font-bold"
                value={role}
                onChange={(e) => switchDemoUser(e.target.value as any)}
              >
                <option value="ADMIN" className="bg-slate-900 text-white">Admin</option>
                <option value="OPERATOR" className="bg-slate-900 text-white">Produção</option>
                <option value="CLIENT" className="bg-slate-900 text-white">Cliente</option>
                <option value="GUEST" className="bg-slate-900 text-white">Visitante</option>
              </select>
            </div>

            {/* Quick Skin Switcher (Clássica, Noturna, Clara) */}
            <div className="flex items-center gap-1 text-[10px] bg-black/25 px-1.5 py-0.5 rounded border border-white/25">
              <span className="text-white/80 flex items-center gap-0.5">
                {theme === 'light' ? (
                  <Sun className="w-3 h-3 text-amber-300" />
                ) : theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-cyan-200" />
                ) : (
                  <Sparkles className="w-3 h-3 text-orange-200" />
                )}
                Skin:
              </span>
              <select
                aria-label="Alternar Skin Visual"
                className="bg-transparent text-white border-none text-[10px] focus:outline-none cursor-pointer font-bold"
                value={theme}
                onChange={(e) => setTheme(e.target.value as SkinTheme)}
              >
                <option value="default" className="bg-slate-900 text-white">⚡ Clássica (Trilha)</option>
                <option value="dark" className="bg-slate-950 text-white">🌙 Noturna (Midnight)</option>
                <option value="light" className="bg-white text-slate-900">☀️ Clara (Clean)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation in iconic Royal Blue: Compact & Sleek (h-14 / 56px) without empty blue voids */}
      <div className="bg-[#004bbf] border-b border-[#003891]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-3 sm:gap-4">
            
            {/* Real Store Logo & Brand */}
            <button 
              onClick={() => {
                if (isDashboardOpen) onToggleDashboard();
                onSelectCategory(null);
              }}
              className="flex items-center group text-left focus:outline-none transition-transform active:scale-[0.99]"
            >
              <BrandLogo size="sm" showSubtitle={true} />
            </button>

            {/* Search bar with white/blue contrast */}
            <div className="hidden md:flex flex-1 max-w-md mx-2">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar camisas, canecas, plotagens, fones..."
                  className="w-full pl-9 pr-4 py-1.5 bg-white text-slate-900 placeholder-slate-500 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#ff6600]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-white">
              <button
                onClick={() => {
                  if (isDashboardOpen) onToggleDashboard();
                  onSelectCategory(null);
                }}
                className="hover:text-blue-100 transition-colors"
              >
                Catálogo
              </button>

              <button
                onClick={() => {
                  if (isDashboardOpen) onToggleDashboard();
                  onSelectCategory('GRAFICA_CAMISAS');
                }}
                className="hover:text-blue-100 transition-colors"
              >
                Gráfica & Camisas
              </button>

              <button
                onClick={() => {
                  if (isDashboardOpen) onToggleDashboard();
                  onSelectCategory('ELETRONICOS_AUDIO');
                }}
                className="hover:text-blue-100 transition-colors"
              >
                Informática & Tech
              </button>

              {/* Interactive Customizer Tool - Soft & Refined Button */}
              <button
                onClick={onOpenCustomizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white transition-all shadow-xs font-medium text-xs active:scale-[0.99]"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Simulador de Estampas</span>
              </button>

              {/* Track Orders */}
              <button
                onClick={onOpenTracking}
                className="flex items-center gap-1 hover:text-blue-100 transition-colors text-xs text-white/90"
              >
                <Package className="w-3.5 h-3.5 text-white/80" />
                <span>Rastrear</span>
              </button>
            </nav>

            {/* Actions: Skin Toggle + Admin Panel + Cart + User */}
            <div className="flex items-center gap-2">
              
              {/* Quick 1-click Skin Toggle Button */}
              <button
                onClick={toggleNextTheme}
                title={`Skin atual: ${themeLabels[theme].label}. Clique para alternar (Clássica / Noturna / Clara).`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
              >
                {theme === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline text-xs font-semibold">Clara</span>
                  </>
                ) : theme === 'dark' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="hidden sm:inline text-xs font-semibold">Noturna</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                    <span className="hidden sm:inline text-xs font-semibold">Clássica</span>
                  </>
                )}
              </button>
              
              {/* Admin / Operator Dashboard Button */}
              {(isAdmin || isOperator) && (
                <button
                  onClick={onToggleDashboard}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isDashboardOpen
                      ? 'bg-white text-[#004bbf] shadow-sm'
                      : 'bg-[#ff6600] text-white hover:bg-[#ea580c]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{isAdmin ? 'Painel' : 'Produção'}</span>
                </button>
              )}

              {/* Shopping Cart Trigger */}
              <button
                onClick={openDrawer}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all focus:outline-none"
                aria-label="Abrir carrinho de compras"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-[#ff6600] text-white text-[10px] font-bold rounded-full shadow-sm border border-[#004bbf]">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-left transition-colors text-white"
                    >
                      <div className="w-7 h-7 rounded-md bg-[#ff6600] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden xl:block text-xs leading-none">
                        <p className="font-semibold text-white truncate max-w-[90px]">{user?.name}</p>
                        <p className="text-white/70 text-[9px] mt-0.5">{user?.role}</p>
                      </div>
                      <ChevronDown className="w-3 h-3 text-white/70" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-800">
                          <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-[#ff6600] uppercase tracking-wider">
                            Nível: {user?.role}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenTracking();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          Meus Pedidos
                        </button>

                        {(isAdmin || isOperator) && (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              if (!isDashboardOpen) onToggleDashboard();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#ff944d] hover:bg-slate-800 transition-colors font-semibold"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Painel de Gestão
                          </button>
                        )}

                        <div className="border-t border-slate-800 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sair da Conta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-2 px-3.5 py-2 bg-[#ff6600] hover:bg-[#e65500] rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-[0.98]"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Entrar</span>
                  </button>
                )}
              </div>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar camisas, canecas, cabos..."
                className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-blue-400/30 py-3 space-y-2 text-white">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isDashboardOpen) onToggleDashboard();
                  onSelectCategory(null);
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-white/10 rounded-lg"
              >
                Catálogo Completo
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isDashboardOpen) onToggleDashboard();
                  onSelectCategory('GRAFICA_CAMISAS');
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-white/10 rounded-lg"
              >
                Gráfica & Camisas
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isDashboardOpen) onToggleDashboard();
                  onSelectCategory('ELETRONICOS_AUDIO');
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-white/10 rounded-lg"
              >
                Informática & Tech
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCustomizer();
                }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-[#ff944d] hover:bg-white/10 rounded-lg flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Simulador de Camisas & Canecas
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-lg flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Rastrear Pedido
              </button>
              {(isAdmin || isOperator) && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onToggleDashboard();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#ff944d] font-bold hover:bg-white/10 rounded-lg flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Abrir Painel de Gestão
                </button>
              )}
              {/* Mobile Skin Selection */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider block px-3 mb-1.5">
                  Aparência / Skin:
                </span>
                <div className="grid grid-cols-3 gap-1 px-3">
                  <button
                    onClick={() => setTheme('default')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1 transition-all ${
                      theme === 'default'
                        ? 'bg-[#ff6600] text-white border-[#ff6600]'
                        : 'bg-white/10 border-white/20 text-white/80'
                    }`}
                  >
                    <span>⚡ Clássica</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1 transition-all ${
                      theme === 'dark'
                        ? 'bg-[#ff6600] text-white border-[#ff6600]'
                        : 'bg-white/10 border-white/20 text-white/80'
                    }`}
                  >
                    <span>🌙 Noturna</span>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1 transition-all ${
                      theme === 'light'
                        ? 'bg-[#ff6600] text-white border-[#ff6600]'
                        : 'bg-white/10 border-white/20 text-white/80'
                    }`}
                  >
                    <span>☀️ Clara</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};
