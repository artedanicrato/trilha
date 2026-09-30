import React, { useState } from 'react';
import type { Product, CustomizationData } from '../types';
import { 
  X, 
  Palette, 
  Check, 
  ShoppingBag, 
  UploadCloud,
  Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface InteractiveCustomizerProps {
  initialProduct?: Product | null;
  onClose: () => void;
}

export const InteractiveCustomizer: React.FC<InteractiveCustomizerProps> = ({
  initialProduct,
  onClose,
}) => {
  const { addItem } = useCart();

  // Mode: Camisa vs Caneca
  const [itemType, setItemType] = useState<'MUG' | 'SHIRT'>(
    initialProduct?.category === 'GRAFICA_CAMISAS' ? 'SHIRT' : 'MUG'
  );

  // Selected item color
  const [itemColor, setItemColor] = useState<string>(
    itemType === 'MUG' ? '#ffffff' : '#004bbf'
  );
  const [itemColorName, setItemColorName] = useState<string>(
    itemType === 'MUG' ? 'Branco Brilhante AAA' : 'Azul Royal Trilha'
  );

  // Shirt Size
  const [shirtSize, setShirtSize] = useState<string>('M');

  // Custom Text attributes
  const [customText, setCustomText] = useState<string>('TRILHA SONORA');
  const [fontFamily, setFontFamily] = useState<string>('Outfit');
  const [textColor, setTextColor] = useState<string>('#ff6600');
  const [textSize, setTextSize] = useState<number>(24);
  const [textPosition, setTextPosition] = useState<'CHEST' | 'CENTER' | 'BACK'>('CENTER');

  // Artwork Preset / Upload
  const [selectedArtPreset, setSelectedArtPreset] = useState<string>('trilha_pick');
  const [customArtName, setCustomArtName] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('Conferir prévia no WhatsApp (88) 99225-5256 antes de estampar.');

  // Notification
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Colors available
  const shirtColors = [
    { name: 'Azul Royal Trilha', hex: '#004bbf', textLight: true },
    { name: 'Laranja Trilha', hex: '#ff6600', textLight: true },
    { name: 'Preto Clássico', hex: '#0f172a', textLight: true },
    { name: 'Branco Puro', hex: '#f8fafc', textLight: false },
    { name: 'Vermelho Cariri', hex: '#b91c1c', textLight: true },
  ];

  const mugColors = [
    { name: 'Branco Brilhante AAA', hex: '#ffffff', textLight: false },
    { name: 'Mágica Fosca (Preta Revela Foto)', hex: '#1e293b', textLight: true },
    { name: 'Alça & Interior Azul Royal', hex: '#004bbf', textLight: true },
    { name: 'Alça & Interior Laranja', hex: '#ff6600', textLight: true },
  ];

  const textPalette = [
    '#ffffff', '#000000', '#ff6600', '#004bbf', '#fbbf24', '#f43f5e', '#22c55e'
  ];

  const artPresets = [
    { id: 'trilha_pick', label: 'Palheta Trilha Sonora (Oficial)' },
    { id: 'soundwave', label: 'Equalizador de Áudio' },
    { id: 'lightning', label: 'Raio / Lightning Crato' },
    { id: 'none', label: 'Apenas Texto / Minha Foto' },
  ];

  const basePrice = itemType === 'SHIRT' ? 49.90 : 38.00;

  const handleFinishCustomization = () => {
    const dummyProduct: Product = initialProduct || {
      id: itemType === 'SHIRT' ? 'prod-camisa-dtf' : 'prod-caneca-porcelana',
      name: itemType === 'SHIRT' 
        ? `Camisa Personalizada DTF (${itemColorName} - ${shirtSize})` 
        : `Caneca de Porcelana Resinada (${itemColorName})`,
      sku: itemType === 'SHIRT' ? 'CUSTOM-CAM-001' : 'CUSTOM-CAN-001',
      category: itemType === 'SHIRT' ? 'GRAFICA_CAMISAS' : 'GRAFICA_CANECAS',
      categoryName: itemType === 'SHIRT' ? 'Camisas & Vestuário' : 'Canecas & Brindes',
      isGraphic: true,
      price: basePrice,
      costPrice: basePrice * 0.45,
      stock: 99,
      minStock: 10,
      unit: 'un',
      description: `Item personalizado no simulador Trilha Sonora: "${customText}". Cor: ${itemColorName}.`,
      features: ['Personalização Exclusiva', 'Acabamento Alta Resolução', 'Produção no Crato (Nº 91)'],
      imageUrl: itemType === 'SHIRT' 
        ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 2,
    };

    const customData: CustomizationData = {
      text: customText,
      fontFamily,
      textColor,
      colorSelected: itemColorName,
      sizeSelected: itemType === 'SHIRT' ? shirtSize : undefined,
      uploadedArtName: customArtName || (selectedArtPreset !== 'none' ? `Preset: ${selectedArtPreset}` : undefined),
      notes: clientNotes,
    };

    addItem(dummyProduct, 1, {
      customization: customData,
      selectedColor: itemColorName,
      selectedSize: itemType === 'SHIRT' ? shirtSize : undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#004bbf]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff6600] flex items-center justify-center text-white font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                Simulador de Brindes · Trilha Sonora Crato
                <span className="text-[10px] font-bold text-slate-950 bg-white px-2 py-0.5 rounded">
                  Mockup Real
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Visualize sua caneca ou camisa com cores, logos e artes antes de prensar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid: Mockup Canvas + Controls */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* LEFT: Live Interactive Visual Mockup (5 cols) */}
          <div className="lg:col-span-6 p-6 flex flex-col items-center justify-center bg-slate-950 relative">
            
            {/* Item selector tabs */}
            <div className="w-full flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => {
                  setItemType('MUG');
                  setItemColor('#ffffff');
                  setItemColorName('Branco Brilhante AAA');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  itemType === 'MUG'
                    ? 'bg-[#ff6600] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Caneca Resinada / Mágica
              </button>

              <button
                onClick={() => {
                  setItemType('SHIRT');
                  setItemColor('#004bbf');
                  setItemColorName('Azul Royal Trilha');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  itemType === 'SHIRT'
                    ? 'bg-[#ff6600] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Camisa 100% Algodão DTF
              </button>
            </div>

            {/* Visual Canvas Representation */}
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center p-4">
              
              {itemType === 'MUG' ? (
                // MUG SVG MOCKUP
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 300 300"
                    className="w-full h-full drop-shadow-2xl transition-colors duration-300"
                  >
                    {/* Mug Handle */}
                    <path
                      d="M205 90 C265 90 265 210 205 210"
                      fill="none"
                      stroke={itemColor === '#ffffff' ? '#cbd5e1' : '#ff6600'}
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Mug Body */}
                    <rect
                      x="70"
                      y="60"
                      width="140"
                      height="180"
                      rx="16"
                      fill={itemColor}
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    {/* Ceramic highlight reflection */}
                    <path
                      d="M82 70 L82 225"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Artwork Layer on Mug */}
                  <div className="absolute top-[32%] left-[28%] w-[42%] flex flex-col items-center justify-center text-center px-2 pointer-events-none">
                    
                    {/* Trilha Pick Logo Preset */}
                    {selectedArtPreset === 'trilha_pick' && (
                      <div className="w-12 h-12 mb-1.5 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                          <path d="M 20 50 C 20 25, 80 25, 80 50" fill="none" stroke="#ff6600" strokeWidth="8" strokeLinecap="round" />
                          <path d="M 50 25 C 65 25, 75 42, 68 65 L 50 90 L 32 65 C 25 42, 35 25, 50 25 Z" fill="#004bbf" stroke="#ffffff" strokeWidth="3" />
                          <ellipse cx="45" cy="60" rx="4" ry="3" fill="#ffffff" />
                          <ellipse cx="56" cy="55" rx="4" ry="3" fill="#ffffff" />
                          <rect x="47" y="44" width="3" height="16" fill="#ffffff" />
                          <rect x="58" y="39" width="3" height="16" fill="#ffffff" />
                          <polygon points="47,44 61,39 61,43 47,48" fill="#ffffff" />
                        </svg>
                      </div>
                    )}

                    {selectedArtPreset === 'soundwave' && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="w-1 h-3 rounded-full" style={{ backgroundColor: textColor }} />
                        <span className="w-1 h-6 rounded-full" style={{ backgroundColor: textColor }} />
                        <span className="w-1 h-4 rounded-full" style={{ backgroundColor: textColor }} />
                        <span className="w-1 h-2 rounded-full" style={{ backgroundColor: textColor }} />
                      </div>
                    )}

                    {selectedArtPreset === 'lightning' && (
                      <Zap className="w-6 h-6 mb-1 animate-pulse" style={{ color: textColor, fill: textColor }} />
                    )}

                    <p
                      style={{
                        fontFamily,
                        color: textColor,
                        fontSize: `${Math.max(11, textSize * 0.55)}px`,
                        wordBreak: 'break-word',
                      }}
                      className="font-extrabold tracking-tight leading-tight uppercase drop-shadow-sm"
                    >
                      {customText || 'Trilha Sonora'}
                    </p>
                  </div>
                </div>
              ) : (
                // SHIRT SVG MOCKUP
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 300 300"
                    className="w-full h-full drop-shadow-2xl transition-colors duration-300"
                  >
                    <path
                      d="M95 40 L130 55 C140 60 160 60 170 55 L205 40 L260 90 L225 130 L200 110 L200 270 C200 275 195 280 190 280 L110 280 C105 280 100 275 100 270 L100 110 L75 130 L40 90 Z"
                      fill={itemColor}
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M130 55 C140 75 160 75 170 55"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* Artwork Layer on Shirt */}
                  <div 
                    className={`absolute flex flex-col items-center justify-center pointer-events-none text-center px-4 transition-all duration-200 ${
                      textPosition === 'CHEST' 
                        ? 'top-[28%] left-[28%] w-[38%]' 
                        : textPosition === 'BACK'
                        ? 'top-[35%] w-[55%]'
                        : 'top-[36%] w-[50%]'
                    }`}
                  >
                    {selectedArtPreset === 'trilha_pick' && (
                      <div className="w-14 h-14 mb-2 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                          <path d="M 20 50 C 20 25, 80 25, 80 50" fill="none" stroke="#ff6600" strokeWidth="8" strokeLinecap="round" />
                          <path d="M 50 25 C 65 25, 75 42, 68 65 L 50 90 L 32 65 C 25 42, 35 25, 50 25 Z" fill="#004bbf" stroke="#ffffff" strokeWidth="3" />
                          <ellipse cx="45" cy="60" rx="4" ry="3" fill="#ffffff" />
                          <ellipse cx="56" cy="55" rx="4" ry="3" fill="#ffffff" />
                          <rect x="47" y="44" width="3" height="16" fill="#ffffff" />
                          <rect x="58" y="39" width="3" height="16" fill="#ffffff" />
                          <polygon points="47,44 61,39 61,43 47,48" fill="#ffffff" />
                        </svg>
                      </div>
                    )}

                    {selectedArtPreset === 'lightning' && (
                      <Zap className="w-8 h-8 mb-1.5 animate-pulse" style={{ color: textColor, fill: textColor }} />
                    )}

                    <p
                      style={{
                        fontFamily,
                        color: textColor,
                        fontSize: `${Math.max(12, textSize * 0.7)}px`,
                        wordBreak: 'break-word',
                      }}
                      className="font-extrabold tracking-tight drop-shadow leading-tight uppercase"
                    >
                      {customText || 'Sua Arte Aqui'}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Selected item color label */}
            <p className="mt-3 text-xs text-slate-400">
              Cor selecionada: <strong className="text-white">{itemColorName}</strong>
            </p>

            {/* Quick summary price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs text-slate-400">Valor Unitário:</span>
              <span className="font-mono text-xl font-bold text-[#ff944d]">
                R$ {basePrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[11px] text-slate-500">
                (Arte + Impressão Inclusa)
              </span>
            </div>

          </div>

          {/* RIGHT: Customization Controls (7 cols) */}
          <div className="lg:col-span-6 p-6 space-y-5 overflow-y-auto">
            
            {/* Color Palette */}
            <div>
              <label className="text-xs font-bold text-white block mb-2">
                1. Escolha a Cor do Produto:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(itemType === 'SHIRT' ? shirtColors : mugColors).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setItemColor(c.hex);
                      setItemColorName(c.name);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      itemColorName === c.name
                        ? 'border-[#ff6600] bg-slate-800 text-white font-bold ring-2 ring-[#ff6600]'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-inner" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shirt Size (If shirt selected) */}
            {itemType === 'SHIRT' && (
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  2. Tamanho da Camisa:
                </label>
                <div className="flex gap-2">
                  {['P', 'M', 'G', 'GG', 'XG'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setShirtSize(sz)}
                      className={`w-10 h-9 rounded-lg border text-xs font-bold transition-all ${
                        shirtSize === sz
                          ? 'bg-[#ff6600] text-white border-[#ff6600]'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Text input */}
            <div>
              <label className="text-xs font-bold text-white block mb-2">
                3. Frase, Nome ou Texto da Estampa:
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={45}
                placeholder="Ex: Minha Caneca Favorita / Trilha Sonora"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff6600]"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {customText.length}/45 caracteres
              </span>
            </div>

            {/* Typography & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  Tipografia:
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                >
                  <option value="Outfit">Outfit (Moderna & Forte)</option>
                  <option value="Plus Jakarta Sans">Jakarta (Geométrica)</option>
                  <option value="JetBrains Mono">JetBrains (Tech)</option>
                  <option value="serif">Serifada (Clássica)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  Cor do Texto / Estampa:
                </label>
                <div className="flex items-center gap-1.5">
                  {textPalette.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setTextColor(clr)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        textColor === clr ? 'scale-125 ring-2 ring-[#ff6600]' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: clr }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preset / Upload Sim */}
            <div>
              <label className="text-xs font-bold text-white block mb-2">
                4. Logo ou Ilustração:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {artPresets.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => setSelectedArtPreset(pr.id)}
                    className={`px-3 py-2 rounded-lg border text-left text-xs transition-all ${
                      selectedArtPreset === pr.id
                        ? 'border-[#ff6600] bg-slate-800 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>

              {/* Upload Art file helper */}
              <div className="mt-3 p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#ff944d]" />
                  <span className="text-slate-300">
                    {customArtName ? `Arquivo: ${customArtName}` : 'Já tem sua arte ou foto em PNG/PDF?'}
                  </span>
                </div>
                <label className="cursor-pointer text-[#ff944d] hover:text-[#ff6600] font-bold">
                  <span>{customArtName ? 'Trocar' : 'Carregar'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCustomArtName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Notes for Graphic Operators */}
            <div>
              <label className="text-xs font-bold text-white block mb-1">
                Instruções para o Balcão da Trilha Sonora:
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Mandar foto no WhatsApp antes de prensar..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={handleFinishCustomization}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#ff6600] hover:bg-[#ea580c] text-white active:scale-[0.99]'
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Personalizado Adicionado ao Carrinho!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar Personalizado ao Carrinho (R$ {basePrice.toFixed(2).replace('.', ',')})</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
