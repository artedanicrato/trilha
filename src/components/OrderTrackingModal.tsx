import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Phone
} from 'lucide-react';
import { Api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Order, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOrderCode?: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento', desc: 'Aguardando confirmação PIX ou cartão' },
  { key: 'PAGO', label: 'Pagamento Aprovado', desc: 'Confirmado, liberado para a fila' },
  { key: 'EM_PRODUCAO', label: 'Em Produção Gráfica', desc: 'Impressão DTF / Prensa / Sublimação' },
  { key: 'PRONTO_RETIRADA', label: 'Pronto / Em Rota', desc: 'Disponível no balcão (Nº 91) ou c/ motoboy' },
  { key: 'ENTREGUE', label: 'Concluído / Entregue', desc: 'Pedido entregue com sucesso' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  preselectedOrderCode,
}) => {
  if (!isOpen) return null;

  const { user } = useAuth();
  const [searchCode, setSearchCode] = useState<string>(preselectedOrderCode || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');

  useEffect(() => {
    loadUserOrders();
  }, [user]);

  const loadUserOrders = async () => {
    setIsLoading(true);
    try {
      const res = await Api.getOrders(searchCode || undefined);
      setOrders(res.orders || []);
      if (res.orders && res.orders.length > 0) {
        setSelectedOrder(res.orders[0]);
      }
    } catch (e) {
      console.warn('Erro ao buscar pedidos:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsLoading(true);
    setSearchError('');
    try {
      const res = await Api.getOrders(searchCode.trim());
      if (res.orders && res.orders.length > 0) {
        setSelectedOrder(res.orders[0]);
      } else {
        setSearchError('Nenhum pedido encontrado com este código.');
      }
    } catch (err: any) {
      setSearchError('Erro ao consultar pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'CANCELADO') return -1;
    if (status === 'EM_ROTA') return 3;
    const idx = STATUS_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header in Trilha Royal Blue */}
        <div className="p-5 border-b border-blue-900 bg-[#004bbf] flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff6600] flex items-center justify-center text-white font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">
                Rastreamento de Pedidos · Trilha Sonora
              </h2>
              <p className="text-xs text-blue-100">
                Acompanhe o status em tempo real da produção e entrega no Crato (Nº 91)
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

        {/* Search input bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Digite o código do pedido (ex: #TS-1048)"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#ff6600] hover:bg-[#e65500] text-white font-bold text-xs rounded-lg transition-colors shadow-md"
            >
              {isLoading ? 'Buscando...' : 'Rastrear'}
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {searchError}
            </p>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {selectedOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg font-bold text-white">
                      {selectedOrder.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      · {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedOrder.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cliente: <strong className="text-slate-200">{selectedOrder.userName}</strong> ({selectedOrder.userPhone})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total:</span>
                  <p className="font-mono text-base font-bold text-[#ff944d]">
                    R$ {selectedOrder.total.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Status Stepper Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                  Linha do Tempo do Pedido:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-[#ff6600]/15 border-[#ff6600] ring-1 ring-[#ff6600]'
                            : isCompleted
                            ? 'bg-slate-950 border-emerald-800/80 text-emerald-400'
                            : 'bg-slate-950/50 border-slate-800 text-slate-600'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold font-mono">
                          {isCompleted ? (
                            <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-[#ff6600]' : 'text-emerald-400'}`} />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-700" />
                          )}
                        </div>
                        <p className={`text-[11px] font-bold leading-tight ${isCurrent ? 'text-[#ff944d]' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                          {step.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List in this order */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Itens do Pedido ({selectedOrder.items.length}):
                </h4>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.productName}</p>
                        <p className="text-slate-400 text-[11px]">
                          Quantidade: {item.quantity} un · Valor Unitário: R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                        </p>
                        {item.customization?.text && (
                          <p className="text-[#ff944d] text-[11px] mt-0.5 font-medium">
                            Arte: &ldquo;{item.customization.text}&rdquo; ({item.customization.colorSelected})
                          </p>
                        )}
                      </div>

                      <span className="font-mono font-bold text-white">
                        R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Production Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#ff6600]" />
                    Destino / Retirada:
                  </span>
                  <p className="text-slate-400">{selectedOrder.delivery.estimatedDelivery}</p>
                  {selectedOrder.delivery.street && (
                    <p className="text-slate-300">
                      {selectedOrder.delivery.street}, {selectedOrder.delivery.number} - {selectedOrder.delivery.neighborhood}, {selectedOrder.delivery.city}
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Histórico & Observações:
                  </span>
                  <p className="text-slate-400">
                    {selectedOrder.notes || 'Sem observações adicionais para este pedido.'}
                  </p>
                </div>
              </div>

              {/* WhatsApp direct contact with real phone (88) 99225-5256 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">
                    Dúvidas sobre o pedido? Fale com a produção da Trilha Sonora no Crato.
                  </span>
                </div>
                <a
                  href={`https://wa.me/5588992255256?text=Olá,+gostaria+de+informações+do+pedido+${selectedOrder.code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 shadow"
                >
                  WhatsApp (88) 99225-5256
                </a>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#ff6600]" />
              <p>Digite o código do pedido acima para visualizar o status de produção.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
