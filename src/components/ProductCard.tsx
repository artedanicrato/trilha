import React from 'react';
import type { Product } from '../types';
import { ShoppingBag, Palette, Eye, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onCustomize,
}) => {
  const { addItem } = useCart();
  const isLowStock = product.stock <= product.minStock;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#ff6600]/60 hover:bg-slate-900 transition-all duration-200 overflow-hidden shadow-lg">
      
      {/* Product Image Area */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="relative aspect-square w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quiet top status line */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {product.customizable ? (
            <span className="text-[11px] font-bold text-white bg-[#ff6600] px-2 py-0.5 rounded shadow">
              Personalizável
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-white bg-[#004bbf] px-2 py-0.5 rounded shadow">
              Pronta Entrega
            </span>
          )}

          {isOutOfStock ? (
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/90 px-2 py-0.5 rounded">
              Esgotado
            </span>
          ) : isLowStock ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />
              Restam {product.stock} un
            </span>
          ) : null}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#004bbf] px-3.5 py-1.5 rounded-lg shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            Visualizar Detalhes
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* Category & SKU metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
          <span className="text-[#ff944d] font-semibold">{product.categoryName}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[11px] text-slate-500">{product.sku}</span>
          {product.isGraphic && product.productionDays && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-white/80">Até {product.productionDays}d úteis</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectProduct(product)}
          className="font-heading text-base font-bold text-white group-hover:text-[#ff944d] transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {product.name}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Pricing & Stock section */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400">R$</span>
              <span className="font-mono-tabular text-xl font-black text-white tracking-tight">
                {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              ou <strong className="text-[#ff944d]">R$ {(product.price * 0.95).toFixed(2).replace('.', ',')}</strong> no PIX
            </p>
          </div>

          <span className="text-[11px] text-slate-500">
            Estoque: <span className="font-mono text-slate-300 font-bold">{product.stock}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-1 grid grid-cols-1 gap-1.5">
          {product.customizable ? (
            <button
              onClick={() => onCustomize(product)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs transition-all shadow-xs active:scale-[0.99]"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Personalizar no Simulador</span>
            </button>
          ) : (
            <button
              disabled={isOutOfStock}
              onClick={() => addItem(product, 1)}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium text-xs transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#004bbf] hover:bg-[#003ea1] text-white active:scale-[0.99]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
