import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCart, DELIVERY_OPTIONS } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    items, 
    isDrawerOpen, 
    closeDrawer, 
    updateQuantity, 
    removeItem, 
    subtotal,
    deliveryOption,
    setDeliveryOption,
    shippingFee,
    pixDiscount,
    totalWithPix,
    totalRegular
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={closeDrawer} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header in Royal Blue */}
          <div className="p-5 border-b border-blue-900 bg-[#004bbf] flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ff944d]" />
              <h2 className="font-heading text-lg font-bold text-white">
                Seu Carrinho · Trilha Sonora
              </h2>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-heading text-base font-bold text-white">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Navegue pelas canecas personalizadas, camisas ou produtos de informática da Trilha Sonora.
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="px-5 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#e65500] text-white font-bold text-xs transition-colors shadow-lg"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-3 relative"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-18 h-18 rounded-lg object-cover shrink-0 bg-slate-900"
                      />

                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-xs font-bold text-white truncate">
                          {item.product.name}
                        </p>

                        {/* Selected Variants */}
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.selectedColor && `Cor: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && ' · '}
                            {item.selectedSize && `Tam: ${item.selectedSize}`}
                          </p>
                        )}

                        {/* Customization Details */}
                        {item.customization?.text && (
                          <div className="mt-1 p-1.5 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-[#ff944d] font-medium">
                            <strong>Arte:</strong> &ldquo;{item.customization.text}&rdquo;
                            {item.customization.notes && (
                              <p className="text-slate-400 truncate">Obs: {item.customization.notes}</p>
                            )}
                          </div>
                        )}

                        {/* Price & Quantity Controls */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white">
                            R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                          </span>

                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded p-0.5">
                            <button
                              onClick={() => updateQuantity(idx, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(idx, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeItem(idx)}
                        className="absolute top-2.5 right-2.5 text-slate-500 hover:text-rose-400 transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Options Selector */}
                <div className="pt-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
                    <Truck className="w-3.5 h-3.5 text-[#ff6600]" />
                    Opção de Entrega / Retirada no Cariri:
                  </label>
                  <div className="space-y-1.5">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setDeliveryOption(opt)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          deliveryOption.id === opt.id
                            ? 'border-[#ff6600] bg-[#ff6600]/10 text-white font-medium ring-1 ring-[#ff6600]'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{opt.title}</p>
                          <p className="text-[10px] text-slate-500">{opt.subtitle}</p>
                        </div>
                        <span className="font-mono font-bold text-white shrink-0 ml-2">
                          {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-3">
              
              {/* Financial calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Frete / Retirada</span>
                  <span className="font-mono text-slate-200">
                    {shippingFee === 0 ? 'Grátis' : `R$ ${shippingFee.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-400">
                  <span>Desconto de 5% no PIX</span>
                  <span className="font-mono">
                    - R$ {pixDiscount.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white">Total PIX:</span>
                    <p className="text-[10px] text-slate-500">
                      (ou R$ {totalRegular.toFixed(2).replace('.', ',')} no Cartão de Crédito)
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xl font-black text-[#ff944d]">
                    R$ {totalWithPix.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  closeDrawer();
                  onProceedToCheckout();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
              >
                <span>Finalizar Pedido Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pagamento Criptografado & Homologado Banco Central</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
