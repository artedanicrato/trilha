import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InteractiveCustomizer } from './components/InteractiveCustomizer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { BrandLogo } from './components/BrandLogo';
import { Api } from './services/api';
import type { Product, Order } from './types';
import { 
  Palette, 
  Headphones, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Phone, 
  CheckCircle2,
  Package,
  Instagram,
  Zap
} from 'lucide-react';

function Storefront() {
  const { isAdmin, isOperator } = useAuth();
  const [dashboardOpenState, setDashboardOpenState] = useState<boolean>(false);

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<'ALL' | 'GRAPHIC' | 'TECH'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [lastOrderCode, setLastOrderCode] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sectorFilter]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const isGraphic = sectorFilter === 'GRAPHIC' ? true : sectorFilter === 'TECH' ? false : undefined;
      const res = await Api.getProducts({
        category: selectedCategory || undefined,
        isGraphic,
        search: searchQuery || undefined,
      });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Falha ao carregar produtos:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    loadProducts();
  };

  const handleStartCustomization = (product?: Product) => {
    setCustomizingProduct(product || null);
    setIsCustomizerOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setLastOrderCode(order.code);
  };

  const categoriesList = [
    { id: null, label: 'Todos os Produtos' },
    { id: 'GRAFICA_CANECAS', label: 'Canecas Resinadas & Mágicas' },
    { id: 'GRAFICA_CAMISAS', label: 'Camisas Personalizadas DTF' },
    { id: 'GRAFICA_BRINDES', label: 'Adesivos & Brindes' },
    { id: 'GRAFICA_PAPELARIA', label: 'Banners & Cartões de Visita' },
    { id: 'ELETRONICOS_AUDIO', label: 'Áudio, Fones & Caixas de Som' },
    { id: 'ELETRONICOS_ENERGIA', label: 'Carregadores Turbo & GaN' },
    { id: 'ELETRONICOS_CABOS', label: 'Cabos & Conexões' },
    { id: 'ELETRONICOS_ACESSORIOS', label: 'Informática & Acessórios' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navbar with Real Store Signboard Design */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCustomizer={() => handleStartCustomization()}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSectorFilter(cat?.startsWith('GRAFICA_') ? 'GRAPHIC' : cat?.startsWith('ELETRONICOS_') ? 'TECH' : 'ALL');
        }}
        onToggleDashboard={() => setDashboardOpenState(!dashboardOpenState)}
        isDashboardOpen={dashboardOpenState}
        searchQuery={searchQuery}
        onSearchChange={handleSearchSubmit}
      />

      {/* Main Content View (either Dashboard or Storefront) */}
      {dashboardOpenState ? (
        <AdminDashboard onClose={() => setDashboardOpenState(false)} />
      ) : (
        <main className="flex-1">
          
          {/* Hero Banner with Storefront Colors (Royal Blue & Radiant Orange) */}
          <HeroBanner
            onOpenCustomizer={() => handleStartCustomization()}
            onFilterGraphic={() => {
              setSectorFilter('GRAPHIC');
              setSelectedCategory('GRAFICA_CANECAS');
            }}
            onFilterElectronics={() => {
              setSectorFilter('TECH');
              setSelectedCategory('ELETRONICOS_AUDIO');
            }}
          />

          {/* Catalog & Filter Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            
            {/* Header & Sector Switcher */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#ff6600] uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-[#ff6600]" />
                    Catálogo Oficial Trilha Sonora
                  </span>
                  <span className="text-xs text-slate-500 font-bold">·</span>
                  <span className="text-xs text-white/80 font-bold">Crato - CE (Nº 91)</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Gráfica, Informática & Brindes
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Personalização fotográfica de canecas, camisas DTF e frente de loja completa com informática
                </p>
              </div>

              {/* Sector Segmented Filter - Refined & Soft */}
              <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg self-start md:self-auto shadow-xs">
                <button
                  onClick={() => {
                    setSectorFilter('ALL');
                    setSelectedCategory(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    sectorFilter === 'ALL'
                      ? 'bg-[#004bbf] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({products.length})
                </button>

                <button
                  onClick={() => {
                    setSectorFilter('GRAPHIC');
                    setSelectedCategory('GRAFICA_CANECAS');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                    sectorFilter === 'GRAPHIC'
                      ? 'bg-[#ff6600] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Gráfica & Brindes</span>
                </button>

                <button
                  onClick={() => {
                    setSectorFilter('TECH');
                    setSelectedCategory('ELETRONICOS_AUDIO');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                    sectorFilter === 'TECH'
                      ? 'bg-[#004bbf] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Informática & Tech</span>
                </button>
              </div>
            </div>

            {/* Category Pills / Filter Buttons - Soft & Ergonomic */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#ff6600] border-[#ff6600] text-white shadow-xs'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="h-80 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-3">
                    <div className="w-full aspect-square bg-slate-800 rounded-lg" />
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Package className="w-12 h-12 text-[#ff6600] mx-auto opacity-70" />
                <p className="text-base font-bold text-white">Nenhum produto encontrado</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Tente alterar os filtros ou a palavra-chave pesquisada.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSectorFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-800 text-xs font-bold text-[#ff944d] rounded-lg hover:bg-slate-700"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    onCustomize={(p) => handleStartCustomization(p)}
                  />
                ))}
              </div>
            )}

            {/* Graphic Fast Order Callout Strip in Royal Blue & Orange */}
            <div className="mt-8 rounded-xl bg-gradient-to-r from-[#003891] via-[#004bbf] to-[#002f82] border border-[#ff6600]/80 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg relative overflow-hidden">
              
              <div className="space-y-1.5 text-center md:text-left relative z-10">
                <span className="text-[10px] font-bold text-[#ff944d] bg-black/30 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Balcão na Rua Dr. João Pessoa, 91 · Centro · Crato - CE
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Precisa de canecas, camisas ou brindes personalizados?
                </h3>
                <p className="text-xs text-blue-100/90 max-w-xl">
                  Impressão com fidelidade de cores para festas, empresas, formaturas, escolas e eventos do Cariri. Envie sua foto ou logotipo e fazemos a prova digital imediata.
                </p>
                <p className="text-[11px] text-white/80 font-medium">
                  Atendimento: Fixo (88) 3512-3426 · WhatsApp (88) 99225-5256
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 relative z-10">
                <button
                  onClick={() => handleStartCustomization()}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Personalizar no Simulador</span>
                </button>

                <a
                  href="https://wa.me/5588992255256?text=Olá+Trilha+Sonora!+Gostaria+de+um+orçamento+para+canecas+e+brindes."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-300" />
                  <span>WhatsApp: (88) 99225-5256</span>
                </a>
              </div>
            </div>

          </section>
        </main>
      )}

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onCustomize={(p) => {
          setSelectedProduct(null);
          handleStartCustomization(p);
        }}
      />

      {isCustomizerOpen && (
        <InteractiveCustomizer
          initialProduct={customizingProduct}
          onClose={() => {
            setIsCustomizerOpen(false);
            setCustomizingProduct(null);
          }}
        />
      )}

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          handleOrderSuccess(order);
          setIsTrackingOpen(true);
        }}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        preselectedOrderCode={lastOrderCode}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Footer with authentic Crato location & store details */}
      <footer className="border-t-4 border-[#ff6600] bg-[#004bbf] text-white text-xs py-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <BrandLogo size="md" showSubtitle={true} />
            <p className="text-blue-100 text-xs leading-relaxed max-w-md pt-2">
              A marca preferida de Crato em gráfica rápida, estamparia em canecas fotográficas, 
              camisas para eventos, brindes corporativos e frente de loja completa com informática, 
              fones de ouvido, cabos e carregadores.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-white/90 pt-1 font-medium">
              <a 
                href="tel:558835123426" 
                className="flex items-center gap-1 text-white hover:text-blue-100 font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>Fixo: (88) 3512-3426</span>
              </a>
              <span>·</span>
              <a 
                href="https://wa.me/5588992255256" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-white hover:text-emerald-200 font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                <span>Whats: (88) 99225-5256</span>
              </a>
              <span>·</span>
              <a 
                href="https://instagram.com/trilhasonoracrato" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-white hover:text-[#ff944d]"
              >
                <Instagram className="w-3.5 h-3.5 text-[#ff944d]" />
                @trilhasonoracrato
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2.5 uppercase tracking-wider text-xs">
              Endereço da Loja Física
            </h4>
            <ul className="space-y-2 text-xs text-blue-100">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-[#ff944d] shrink-0 mt-0.5" />
                <span>Rua Dr. João Pessoa, 91 · Centro · Crato - CE</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ff944d] shrink-0" />
                <span>Seg a Sex: 08h às 18h · Sáb: 08h às 13h</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span className="font-semibold text-white">Fixo: (88) 3512-3426</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="font-bold text-white">Whats: (88) 99225-5256</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2.5 uppercase tracking-wider text-xs">
              Formas de Pagamento & Retirada
            </h4>
            <div className="space-y-2 text-xs text-blue-100">
              <p className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#ff944d] shrink-0" />
                <span>PIX c/ 5% OFF e QR Code Instantâneo</span>
              </p>
              <p className="flex items-center gap-1.5 text-white/90">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Cartões em até 12x s/ juros</span>
              </p>
              <p className="flex items-center gap-1.5 text-white/90">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>Retirada Balcão (Nº 91) ou Motoboy Cariri</span>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-blue-200">
          <span>&copy; {new Date().getFullYear()} Trilha Sonora Gráfica, Informática & Brindes. Todos os direitos reservados.</span>
          <span>Crato - Ceará · Região Metropolitana do Cariri</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Storefront />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
