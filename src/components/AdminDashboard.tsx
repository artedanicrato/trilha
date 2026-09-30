import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowUpDown,
  RefreshCw,
  FileSpreadsheet,
  X,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { 
  Order, 
  Product, 
  StockAuditLog, 
  DashboardMetrics, 
  OrderStatus, 
  User, 
  ProductCategory 
} from '../types';

import { BrandLogo } from './BrandLogo';

interface AdminDashboardProps {
  onClose: () => void;
}

type TabType = 'METRICS' | 'ORDERS' | 'INVENTORY' | 'USERS' | 'PAYMENTS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { user, isAdmin, isOperator } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('METRICS');
  
  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [auditLogs, setAuditLogs] = useState<StockAuditLog[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  // Modals inside dashboard
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('EM_PRODUCAO');
  const [statusNote, setStatusNote] = useState<string>('');

  // Stock Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Entrada de Mercadoria Fornecedor');

  // Product Create/Edit Modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);

  // Filters
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState<string>('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [metRes, ordRes, prodRes, logsRes] = await Promise.all([
        Api.getDashboardMetrics(),
        Api.getOrders(),
        Api.getProducts(),
        Api.getStockAuditLogs(),
      ]);

      setMetrics(metRes.metrics);
      setOrders(ordRes.orders);
      setProducts(prodRes.products);
      setAuditLogs(logsRes.logs);

      if (isAdmin) {
        try {
          const uRes = await Api.getUsers();
          setUsersList(uRes.users);
        } catch (e) {
          console.warn('Could not load users list', e);
        }
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrderForStatus) return;
    try {
      const res = await Api.updateOrderStatus(selectedOrderForStatus.id, newStatus, statusNote);
      setSelectedOrderForStatus(null);
      setStatusNote('');
      setActionSuccess(`Status do pedido ${res.order.code} atualizado para ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar pedido');
    }
  };

  const handleStockAdjustment = async () => {
    if (!adjustingProduct) return;
    try {
      await Api.adjustStock(adjustingProduct.id, adjustQuantity, adjustReason);
      setAdjustingProduct(null);
      setActionSuccess(`Estoque de ${adjustingProduct.name} ajustado com sucesso.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Erro ao ajustar estoque');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isCreatingProduct) {
        await Api.createProduct(editingProduct);
        setActionSuccess('Novo produto adicionado ao catálogo!');
      } else if (editingProduct.id) {
        await Api.updateProduct(editingProduct.id, editingProduct);
        setActionSuccess('Produto atualizado com sucesso!');
      }
      setEditingProduct(null);
      setIsCreatingProduct(false);
      setTimeout(() => setActionSuccess(''), 3000);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o produto "${name}"?`)) return;
    try {
      await Api.deleteProduct(id);
      setActionSuccess(`Produto "${name}" removido.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Erro ao remover produto');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      await Api.updateUserRole(userId, newRole);
      setActionSuccess('Nível de acesso do usuário atualizado.');
      setTimeout(() => setActionSuccess(''), 3000);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar permissão');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex flex-col">
      
      {/* Top Bar in Royal Blue */}
      <div className="border-b-4 border-[#ff6600] bg-[#004bbf] px-6 py-4 flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-4">
          <BrandLogo size="sm" showSubtitle={false} />
          <div>
            <h1 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              Painel de Gestão · Loja Crato Nº 91
              <span className="text-[10px] font-black text-slate-950 bg-white px-2 py-0.5 rounded shadow">
                {isAdmin ? 'DIRETORIA (ADMIN)' : 'PRODUÇÃO GRÁFICA'}
              </span>
            </h1>
            <p className="text-xs text-blue-100">
              Controle de pedidos, estoque em tempo real e conciliação financeira
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Recarregar Dados"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#ff6600] hover:bg-[#e65500] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <X className="w-4 h-4" />
            <span>Voltar à Loja</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 px-6 py-2.5 text-xs flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 flex space-x-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'METRICS'
              ? 'border-[#ff6600] text-[#ff944d]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Visão Geral & Métricas</span>
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'ORDERS'
              ? 'border-[#ff6600] text-[#ff944d]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestão de Pedidos</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'INVENTORY'
              ? 'border-[#ff6600] text-[#ff944d]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Estoque & Catálogo</span>
          {metrics && metrics.lowStockCount > 0 && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-mono">
              {metrics.lowStockCount} alertas
            </span>
          )}
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('USERS')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'USERS'
                ? 'border-[#ff6600] text-[#ff944d]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Níveis de Acesso & Usuários</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'PAYMENTS'
              ? 'border-[#ff6600] text-[#ff944d]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Gateway & Financeiro</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* ==================================================== */}
        {/* TAB 1: METRICS & OVERVIEW */}
        {/* ==================================================== */}
        {activeTab === 'METRICS' && metrics && (
          <div className="space-y-6">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Receita no Mês</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="mt-2 font-mono-tabular text-2xl font-bold text-white">
                  R$ {metrics.totalRevenueMonth.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hoje: <strong className="text-emerald-400 font-mono">R$ {metrics.totalRevenueToday.toFixed(2).replace('.', ',')}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Em Produção Gráfica</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="mt-2 font-mono-tabular text-2xl font-bold text-cyan-400">
                  {metrics.inProductionCount}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Camisas e brindes em processo de prensa/DTF
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Aguardando Pagamento</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <p className="mt-2 font-mono-tabular text-2xl font-bold text-amber-400">
                  {metrics.pendingOrdersCount}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pedidos pendentes de aprovação no PIX
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Alertas de Estoque</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <p className="mt-2 font-mono-tabular text-2xl font-bold text-rose-400">
                  {metrics.lowStockCount} itens
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Produtos que atingiram o estoque de segurança
                </p>
              </div>

            </div>

            {/* Critical Low Stock Alert Card */}
            {metrics.lowStockProducts.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Reposição Recomendada para o Estoque de Crato:
                  </span>
                  <button
                    onClick={() => setActiveTab('INVENTORY')}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Gerenciar Estoque →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {metrics.lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white truncate max-w-[180px]">{p.name}</p>
                        <p className="text-slate-400 text-[11px]">SKU: {p.sku}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-rose-400">
                          {p.stock} un
                        </span>
                        <p className="text-[10px] text-slate-500">Mín: {p.minStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sales by Category */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="font-heading text-sm font-bold text-white mb-4">
                  Volume de Vendas por Categoria:
                </h3>
                <div className="space-y-3">
                  {metrics.salesByCategory.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cat.label}</span>
                        <span className="font-mono font-bold text-white">
                          R$ {cat.amount.toFixed(2).replace('.', ',')}{' '}
                          <span className="text-[10px] text-slate-500 font-normal">({cat.count} un)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(10, (cat.amount / (metrics.totalRevenueMonth || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales by Payment Method */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="font-heading text-sm font-bold text-white mb-4">
                  Distribuição por Meio de Pagamento:
                </h3>
                <div className="space-y-4">
                  {metrics.salesByPayment.map((pay, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">
                          {pay.method === 'PIX' ? '⚡ PIX Instantâneo' : pay.method === 'CREDIT_CARD' ? '💳 Cartão de Crédito' : '📄 Boleto Bancário'}
                        </p>
                        <p className="text-slate-500 text-[11px]">{pay.count} transações confirmadas</p>
                      </div>
                      <span className="font-mono text-sm font-bold text-cyan-400">
                        R$ {pay.amount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: ORDERS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4">
            
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 font-semibold">Filtrar por Status:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">Todos os Pedidos</option>
                  <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                  <option value="PAGO">Pago (Liberado p/ Produção)</option>
                  <option value="EM_PRODUCAO">Em Produção Gráfica</option>
                  <option value="PRONTO_RETIRADA">Pronto p/ Retirada no Crato</option>
                  <option value="EM_ROTA">Em Rota de Entrega</option>
                  <option value="ENTREGUE">Entregue / Concluído</option>
                </select>
              </div>

              <span className="text-slate-400">
                Mostrando <strong className="text-white font-mono">{filteredOrders.length}</strong> pedidos
              </span>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Pedido / Data</th>
                    <th className="py-3 px-4">Cliente / Contato</th>
                    <th className="py-3 px-4">Itens & Arte</th>
                    <th className="py-3 px-4">Destino / Retirada</th>
                    <th className="py-3 px-4">Valor Total</th>
                    <th className="py-3 px-4">Status Atual</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Code & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-heading font-bold text-white text-sm block">
                          {ord.code}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString('pt-BR')} {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{ord.userName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{ord.userPhone}</p>
                      </td>

                      {/* Items & Custom Art */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="truncate">
                              <span className="text-slate-300 font-medium">
                                {it.quantity}x {it.productName}
                              </span>
                              {it.customization?.text && (
                                <span className="block text-[10px] text-cyan-400 truncate">
                                  Arte: &ldquo;{it.customization.text}&rdquo; ({it.customization.colorSelected})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Delivery */}
                      <td className="py-3.5 px-4">
                        <span className="block text-slate-300 font-medium">
                          {ord.delivery.type === 'RETIRADA_BALCAO' ? 'Balcão Centro Crato' : ord.delivery.city}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ord.delivery.type === 'RETIRADA_BALCAO' ? 'Sem frete' : `Frete R$ ${ord.shippingFee.toFixed(2)}`}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white block">
                          R$ {ord.total.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord.payment.method} ({ord.payment.status})
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'ENTREGUE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : ord.status === 'EM_PRODUCAO'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : ord.status === 'PRONTO_RETIRADA'
                            ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderForStatus(ord);
                            setNewStatus(ord.status);
                            setStatusNote(ord.notes || '');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-xs font-semibold transition-colors"
                        >
                          Alterar Status
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: INVENTORY & STOCK MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'INVENTORY' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar no estoque por nome ou SKU..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCreatingProduct(true);
                    setEditingProduct({
                      name: '',
                      sku: `TS-${Math.floor(100 + Math.random() * 900)}`,
                      category: 'GRAFICA_CAMISAS',
                      categoryName: 'Camisas & Vestuário',
                      isGraphic: true,
                      price: 49.90,
                      costPrice: 20.00,
                      stock: 50,
                      minStock: 15,
                      unit: 'un',
                      description: 'Descrição detalhada do produto e especificações...',
                      features: ['Alta Durabilidade', 'Acabamento Profissional'],
                      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                      customizable: true,
                      productionDays: 2,
                    });
                  }}
                  className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Produto</span>
                </button>
              </div>

            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4">Categoria / Setor</th>
                    <th className="py-3 px-4">Preço Venda</th>
                    <th className="py-3 px-4">Preço Custo / Margem</th>
                    <th className="py-3 px-4">Estoque Atual</th>
                    <th className="py-3 px-4">Status Estoque</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock <= p.minStock;
                    const margin = p.price - p.costPrice;
                    const marginPercent = ((margin / p.price) * 100).toFixed(0);

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Product Info */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-white block max-w-xs truncate">
                              {p.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              SKU: {p.sku} {p.customizable ? '· [Personalizável]' : ''}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="text-slate-300 block">{p.categoryName}</span>
                          <span className="text-[10px] text-slate-500">
                            {p.isGraphic ? 'Gráfica Rápida' : 'Frente de Loja Tech'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          R$ {p.price.toFixed(2).replace('.', ',')}
                        </td>

                        {/* Cost & Margin */}
                        <td className="py-3 px-4">
                          <span className="font-mono text-slate-400 block">
                            R$ {p.costPrice.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            +{marginPercent}% margem
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm font-bold text-white">
                            {p.stock} {p.unit}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Mínimo: {p.minStock} {p.unit}
                          </span>
                        </td>

                        {/* Stock Status Badge */}
                        <td className="py-3 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              Reposição Crítica
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-2 py-0.5 rounded">
                              Estoque Seguro
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Quick Stock Adjustment */}
                          <button
                            onClick={() => {
                              setAdjustingProduct(p);
                              setAdjustQuantity(10);
                              setAdjustReason('Entrada de Mercadoria / Reposição');
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold"
                            title="Ajustar Quantidade em Estoque"
                          >
                            ± Estoque
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsCreatingProduct(false);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Editar Produto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete (Admin only) */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-500"
                              title="Remover Produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Stock Audit Logs Table */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Livro de Auditoria de Estoque (Rastreabilidade & Cyber Segurança):
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Data / Hora</th>
                      <th className="py-2.5 px-3">Produto</th>
                      <th className="py-2.5 px-3">Alteração</th>
                      <th className="py-2.5 px-3">Novo Saldo</th>
                      <th className="py-2.5 px-3">Motivo Registrado</th>
                      <th className="py-2.5 px-3">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {auditLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 text-slate-500 text-[11px]">
                          {new Date(log.createdAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2 px-3 text-slate-300 font-sans">
                          {log.productName}
                        </td>
                        <td className={`py-2 px-3 font-bold ${log.quantityChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {log.quantityChange >= 0 ? `+${log.quantityChange}` : log.quantityChange} un
                        </td>
                        <td className="py-2 px-3 text-white">
                          {log.newStock} un
                        </td>
                        <td className="py-2 px-3 text-slate-400 font-sans">
                          {log.reason}
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-sans text-[11px]">
                          {log.authorName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: USERS & ROLE PERMISSIONS */}
        {/* ==================================================== */}
        {activeTab === 'USERS' && isAdmin && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <h3 className="font-heading text-sm font-bold text-white mb-1">
                Controle de Acessos & Privilégios (RBAC)
              </h3>
              <p className="text-slate-400">
                Gerencie quem pode administrar o catálogo, atualizar ordens de impressão gráfica ou realizar compras como cliente.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Telefone</th>
                    <th className="py-3 px-4">Nível Atual</th>
                    <th className="py-3 px-4 text-right">Alterar Nível</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                      <td className="py-3 px-4 text-slate-400">{u.phone || 'Não informado'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : u.role === 'OPERATOR'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-xs text-white rounded px-2 py-1"
                        >
                          <option value="ADMIN">ADMIN (Diretoria)</option>
                          <option value="OPERATOR">OPERATOR (Produção Gráfica)</option>
                          <option value="CLIENT">CLIENT (Cliente Comum)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: PAYMENTS & GATEWAY RECONCILIATION */}
        {/* ==================================================== */}
        {activeTab === 'PAYMENTS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Gateway PIX Banco Central</span>
                <p className="mt-1 font-mono text-xl font-bold text-cyan-400">Ativo & Operacional</p>
                <p className="text-[11px] text-slate-500 mt-1">Chave CNPJ: 08.123.456/0001-78</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Adquirente de Cartão de Crédito</span>
                <p className="mt-1 font-mono text-xl font-bold text-emerald-400">Aprovando em 1x a 12x</p>
                <p className="text-[11px] text-slate-500 mt-1">Antifraude com 3D Secure 2.0</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Segurança de Dados</span>
                <p className="mt-1 font-mono text-xl font-bold text-white">Criptografia JWT + Bcrypt</p>
                <p className="text-[11px] text-slate-500 mt-1">Salts de 10 rounds e tokens assinados</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-heading text-sm font-bold text-white mb-3">
                Últimas Transações Financeiras Processadas:
              </h3>
              <div className="space-y-2">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">
                        {ord.code} · {ord.userName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        TxID: {ord.payment.transactionId} · Método: {ord.payment.method}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-white block">
                        R$ {ord.total.toFixed(2).replace('.', ',')}
                      </span>
                      <span className={`text-[10px] font-bold ${ord.payment.status === 'APROVADO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {ord.payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ORDER STATUS UPDATE */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-base font-bold text-white">
                Atualizar Pedido {selectedOrderForStatus.code}
              </h3>
              <button onClick={() => setSelectedOrderForStatus(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Novo Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                <option value="PAGO">Pago (Liberar p/ Gráfica)</option>
                <option value="EM_PRODUCAO">Em Produção Gráfica (Prensa / Impressão)</option>
                <option value="PRONTO_RETIRADA">Pronto p/ Retirada no Balcão</option>
                <option value="EM_ROTA">Em Rota de Entrega (Motoboy Cariri)</option>
                <option value="ENTREGUE">Entregue / Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Notas de Produção (Visível no rastreio):</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                placeholder="Ex: Estampa finalizada na prensa térmica, aguardando cliente retirar no balcão."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrderForStatus(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateOrderStatus}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Salvar Alteração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK ADJUSTMENT */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Ajuste de Estoque
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{adjustingProduct.name}</p>
              </div>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Estoque Atual:</span>
              <span className="font-mono text-base font-bold text-white">
                {adjustingProduct.stock} {adjustingProduct.unit}
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Variação na Quantidade (+ para entrada, - para saída):
              </label>
              <input
                type="number"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Novo saldo final será: <strong className="text-cyan-400 font-mono">{Math.max(0, adjustingProduct.stock + adjustQuantity)}</strong> {adjustingProduct.unit}
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Motivo da Auditoria (Obrigatório por Segurança):
              </label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Ex: Entrada de Fornecedor / Venda Balcão / Perda"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleStockAdjustment}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Gravar no Livro de Auditoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveProduct} className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-base font-bold text-white">
                {isCreatingProduct ? 'Cadastrar Novo Produto' : 'Editar Produto'}
              </h3>
              <button 
                type="button" 
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(false);
                }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-300 block mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Código SKU *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.sku || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Categoria *</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => {
                    const cat = e.target.value as ProductCategory;
                    const isG = cat.startsWith('GRAFICA_');
                    const labelMap: Record<string, string> = {
                      'GRAFICA_CAMISAS': 'Camisas & Vestuário',
                      'GRAFICA_CANECAS': 'Canecas & Brindes',
                      'GRAFICA_PAPELARIA': 'Papelaria & Grandes Formatos',
                      'GRAFICA_BRINDES': 'Adesivos & Brindes',
                      'ELETRONICOS_AUDIO': 'Áudio & Fones',
                      'ELETRONICOS_CABOS': 'Cabos & Conexões',
                      'ELETRONICOS_ENERGIA': 'Carregadores & Energia',
                      'ELETRONICOS_ACESSORIOS': 'Acessórios Tech & Suportes',
                    };
                    setEditingProduct({
                      ...editingProduct,
                      category: cat,
                      categoryName: labelMap[cat] || cat,
                      isGraphic: isG,
                      customizable: isG,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="GRAFICA_CAMISAS">Gráfica: Camisas & Vestuário</option>
                  <option value="GRAFICA_CANECAS">Gráfica: Canecas & Brindes</option>
                  <option value="GRAFICA_PAPELARIA">Gráfica: Papelaria & Banners</option>
                  <option value="GRAFICA_BRINDES">Gráfica: Adesivos & Brindes</option>
                  <option value="ELETRONICOS_AUDIO">Eletrônicos: Áudio & Fones</option>
                  <option value="ELETRONICOS_CABOS">Eletrônicos: Cabos</option>
                  <option value="ELETRONICOS_ENERGIA">Eletrônicos: Carregadores & Energia</option>
                  <option value="ELETRONICOS_ACESSORIOS">Eletrônicos: Acessórios</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Preço de Venda (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Preço de Custo (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.costPrice || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Estoque Inicial (un) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stock || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Estoque Mínimo de Alerta *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.minStock || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 block mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  required
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 block mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
