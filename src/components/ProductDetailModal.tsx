import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  X, 
  ShoppingBag, 
  Palette, 
  Check, 
  MapPin, 
  Truck, 
  AlertTriangle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onCustomize: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onCustomize,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(product.colorOptions?.[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizeOptions?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const isLowStock = product.stock <= product.minStock;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem(product, quantity, {
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image */}
          <div className="relative bg-slate-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-h-[380px] object-cover rounded-xl shadow-lg"
            />
            {product.customizable && (
              <span className="absolute top-4 left-4 text-xs font-bold text-white bg-[#ff6600] px-3 py-1 rounded-md shadow">
                Personalizável com sua Foto ou Arte
              </span>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="text-[#ff944d] font-bold">{product.categoryName}</span>
                <span>·</span>
                <span className="font-mono text-slate-500">{product.sku}</span>
              </div>

              <h2 className="font-heading text-xl md:text-2xl font-bold text-white leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-sm text-slate-400">R$</span>
                <span className="font-mono-tabular text-3xl font-black text-white">
                  {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-[#ff944d] font-bold">
                  (R$ {(product.price * 0.95).toFixed(2).replace('.', ',')} no PIX)
                </span>
              </div>

              {/* Stock status indicator */}
              <div className="mt-2 text-xs flex items-center gap-2">
                {isOutOfStock ? (
                  <span className="text-rose-400 font-semibold">Produto Esgotado no momento</span>
                ) : isLowStock ? (
                  <span className="text-amber-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Últimas {product.stock} unidades na loja
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Disponível ({product.stock} un em estoque)
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs md:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Destaques & Especificações:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#ff6600] font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Options */}
              {product.colorOptions && product.colorOptions.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Opção de Cor / Modelo:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          selectedColor === c
                            ? 'bg-[#ff6600] text-white font-bold border-[#ff6600]'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizeOptions && product.sizeOptions.length > 0 && (
                <div className="mt-3">
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Tamanho:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizeOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          selectedSize === s
                            ? 'bg-[#ff6600] text-white font-bold border-[#ff6600]'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Quantidade:</span>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2">
                {product.customizable ? (
                  <button
                    onClick={() => {
                      onClose();
                      onCustomize(product);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Personalizar Este Produto no Simulador</span>
                  </button>
                ) : (
                  <button
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      addedNotice
                        ? 'bg-emerald-600 text-white'
                        : isOutOfStock
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-[#004bbf] hover:bg-[#003ea1] text-white shadow-xs active:scale-[0.99]'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Esgotado' : `Adicionar ${quantity} un ao Carrinho`}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Delivery and Cariri trust info */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                  <span>Retirada no Centro do Crato (Nº 91)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Entrega rápida em Juazeiro e Barbalha</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
