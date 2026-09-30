import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  QrCode, 
  FileText, 
  Lock, 
  Copy, 
  CheckCheck, 
  AlertCircle,
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Api } from '../services/api';
import type { Order, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const { items, deliveryOption, shippingFee, pixDiscount, totalWithPix, totalRegular, clearCart } = useCart();
  const { user } = useAuth();

  // Steps: 'DATA' -> 'PAYMENT' -> 'CONFIRMATION'
  const [step, setStep] = useState<'DATA' | 'PAYMENT' | 'CONFIRMATION'>('DATA');

  // Customer Contact & Delivery fields
  const [recipientName, setRecipientName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '(88) 9');
  const [street, setStreet] = useState<string>(user?.address?.street || '');
  const [number, setNumber] = useState<string>(user?.address?.number || '');
  const [neighborhood, setNeighborhood] = useState<string>(user?.address?.neighborhood || '');
  const [city, setCity] = useState<string>(deliveryOption.city || 'Crato');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  // Card details
  const [cardNumber, setCardNumber] = useState<string>('4532 8900 1234 5678');
  const [cardHolder, setCardHolder] = useState<string>(user?.name?.toUpperCase() || 'CLIENTE TRILHA SONORA');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('789');
  const [cardInstallments, setCardInstallments] = useState<number>(1);

  // States for created order & PIX
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [isSimulatingPix, setIsSimulatingPix] = useState<boolean>(false);

  const finalAmount = paymentMethod === 'PIX' ? totalWithPix : totalRegular;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      setErrorMessage('Por favor, informe um WhatsApp válido para contato.');
      return;
    }
    setErrorMessage('');
    setStep('PAYMENT');
  };

  const handleProcessOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        items: items.map(it => ({
          productId: it.product.id,
          productName: it.product.name,
          category: it.product.category,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.totalPrice,
          customization: it.customization,
          isGraphic: it.product.isGraphic,
        })),
        delivery: {
          type: deliveryOption.type,
          recipientName,
          phone,
          street: deliveryOption.type !== 'RETIRADA_BALCAO' ? street : undefined,
          number: deliveryOption.type !== 'RETIRADA_BALCAO' ? number : undefined,
          neighborhood: deliveryOption.type !== 'RETIRADA_BALCAO' ? neighborhood : undefined,
          city,
          state: 'CE',
          shippingFee,
          estimatedDelivery: deliveryOption.estimated,
        },
        paymentMethod,
        cardDetails: paymentMethod === 'CREDIT_CARD' ? {
          number: cardNumber.replace(/\s+/g, ''),
          holder: cardHolder,
          expiry: cardExpiry,
          cvv: cardCvv,
          installments: cardInstallments,
        } : undefined,
        notes: clientNotes,
      };

      const result = await Api.checkout(orderPayload);
      setCreatedOrder(result.order);
      clearCart();
      setStep('CONFIRMATION');
      onOrderSuccess(result.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar checkout. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (createdOrder?.payment.pixCopyPaste) {
      navigator.clipboard.writeText(createdOrder.payment.pixCopyPaste);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  const handleSimulatePixConfirm = async () => {
    if (!createdOrder) return;
    setIsSimulatingPix(true);
    try {
      const updated = await Api.simulatePixPayment(createdOrder.id);
      setCreatedOrder(updated.order);
      onOrderSuccess(updated.order);
    } catch (err: any) {
      alert(err.message || 'Erro na simulação');
    } finally {
      setIsSimulatingPix(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header in Trilha Royal Blue */}
        <div className="p-5 border-b border-blue-900 bg-[#004bbf] flex items-center justify-between text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-white">
                Finalizar Compra · Trilha Sonora Crato
              </span>
              <span className="text-[10px] font-bold text-slate-950 bg-white px-2 py-0.5 rounded shadow">
                Segurança SSL
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              {step === 'DATA' && 'Etapa 1 de 2: Dados de Contato e Entrega'}
              {step === 'PAYMENT' && 'Etapa 2 de 2: Gateway de Pagamento'}
              {step === 'CONFIRMATION' && 'Pedido Registrado com Sucesso!'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="bg-rose-950/80 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CONTACT & DELIVERY DATA */}
        {step === 'DATA' && (
          <form onSubmit={handleNextToPayment} className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WhatsApp com DDD (Cariri 88) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(88) 99225-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>

            {/* Delivery address details (if not pickup) */}
            {deliveryOption.type !== 'RETIRADA_BALCAO' ? (
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ff944d]">
                  <MapPin className="w-4 h-4" />
                  <span>Endereço de Entrega ({deliveryOption.title}):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-1">Rua / Avenida</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Rua Barbara de Alencar"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Número</label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Ex: 91"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Bairro</label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Centro / Pimenta / São Miguel"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Cidade</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-[#ff6600] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Retirada no Balcão da Loja Trilha Sonora:</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Rua Dr. João Pessoa, 91 · Centro · Crato - CE. Telefones: Fixo (88) 3512-3426 | WhatsApp (88) 99225-5256.
                  </p>
                </div>
              </div>
            )}

            {/* Client Notes */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Instruções adicionais (Opcional):
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Deixar na portaria, ligar no WhatsApp..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
              />
            </div>

            {/* Summary preview */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total a pagar:</span>
                <p className="font-mono text-base font-bold text-white">
                  R$ {totalWithPix.toFixed(2).replace('.', ',')}{' '}
                  <span className="text-xs font-bold text-[#ff944d]">(no PIX)</span>
                </p>
              </div>

              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs active:scale-[0.99] transition-all"
              >
                <span>Avançar para Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: PAYMENT GATEWAY INTEGRATION */}
        {step === 'PAYMENT' && (
          <div className="p-6 space-y-5">
            
            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Selecione o Meio de Pagamento:
              </label>
              
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* PIX */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                    paymentMethod === 'PIX'
                      ? 'border-[#ff6600] bg-[#ff6600]/15 text-white font-bold ring-1 ring-[#ff6600]'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#ff6600]" />
                  <span>PIX Instantâneo</span>
                  <span className="text-[10px] text-emerald-400 font-bold">5% de Desconto</span>
                </button>

                {/* Cartão de Crédito */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-[#004bbf] bg-[#004bbf]/20 text-white font-bold ring-1 ring-[#004bbf]'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span>Cartão de Crédito</span>
                  <span className="text-[10px] text-slate-400">Até 12x</span>
                </button>

                {/* Boleto Bancário */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BOLETO')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                    paymentMethod === 'BOLETO'
                      ? 'border-amber-500 bg-amber-500/20 text-white font-bold ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Boleto Bancário</span>
                  <span className="text-[10px] text-slate-400">Venc. em 3 dias</span>
                </button>

              </div>
            </div>

            {/* PIX Details */}
            {paymentMethod === 'PIX' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Pagamento via PIX Banco Central
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Desconto de R$ {pixDiscount.toFixed(2).replace('.', ',')} aplicado
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  O QR Code oficial e o código Copia e Cola serão gerados imediatamente ao confirmar o pedido. A aprovação é automática 24h por dia.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <Lock className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Chave Oficial Trilha Sonora Crato vinculada à conta jurídica.</span>
                </div>
              </div>
            )}

            {/* Credit Card Form */}
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#ff6600]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="NOME COMPLETO"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Validade</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white text-center focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white text-center focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Parcelamento</label>
                  <select
                    value={cardInstallments}
                    onChange={(e) => setCardInstallments(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value={1}>1x de R$ {totalRegular.toFixed(2).replace('.', ',')} (sem juros)</option>
                    <option value={2}>2x de R$ {(totalRegular / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                    <option value={3}>3x de R$ {(totalRegular / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                    <option value={4}>4x de R$ {(totalRegular / 4).toFixed(2).replace('.', ',')}</option>
                    <option value={6}>6x de R$ {(totalRegular / 6).toFixed(2).replace('.', ',')}</option>
                    <option value={12}>12x de R$ {(totalRegular / 12).toFixed(2).replace('.', ',')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Boleto details */}
            {paymentMethod === 'BOLETO' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
                <p className="text-white font-semibold">Instruções para Boleto Bancário:</p>
                <p>O boleto com código de barras e linha digitável será gerado na próxima tela. Pode ser pago em qualquer banco ou aplicativo de pagamentos até o vencimento.</p>
              </div>
            )}

            {/* Final Total Display and Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('DATA')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Voltar aos dados
              </button>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Valor Final:</span>
                  <p className="font-mono text-lg font-black text-[#ff944d]">
                    R$ {finalAmount.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleProcessOrder}
                  className="py-2 px-4 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs shadow-xs active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar e Pagar'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: ORDER CONFIRMATION & PAYMENT ACTION */}
        {step === 'CONFIRMATION' && createdOrder && (
          <div className="p-6 space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Pedido Registrado na Trilha Sonora!
              </span>
              <h3 className="font-heading text-2xl font-black text-white mt-1">
                Protocolo: {createdOrder.code}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Obrigado, <strong className="text-slate-200">{createdOrder.userName}</strong>. Seu pedido foi enviado para o sistema da loja física no Crato (Nº 91).
              </p>
            </div>

            {/* PIX Payment Gateway Box with QR Code */}
            {createdOrder.payment.method === 'PIX' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#ff6600]" />
                    Pague com PIX (Aprovação Instantânea)
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    createdOrder.payment.status === 'APROVADO'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {createdOrder.payment.status === 'APROVADO' ? 'PAGAMENTO APROVADO' : 'AGUARDANDO PAGAMENTO'}
                  </span>
                </div>

                {createdOrder.payment.status !== 'APROVADO' ? (
                  <>
                    <div className="flex flex-col items-center justify-center py-2">
                      <img
                        src={createdOrder.payment.pixQrCodeUrl}
                        alt="QR Code PIX"
                        className="w-44 h-44 rounded-xl bg-white p-2 shadow-lg"
                      />
                      <p className="text-[11px] text-slate-400 mt-2">
                        Abra o app do seu banco e aponte a câmera para o QR Code
                      </p>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Ou copie o código PIX Copia e Cola:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={createdOrder.payment.pixCopyPaste}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 truncate"
                        />
                        <button
                          onClick={handleCopyPix}
                          className="px-3.5 py-2 rounded-lg bg-[#ff6600] hover:bg-[#e65500] text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-md"
                        >
                          {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Simulation test button */}
                    <div className="pt-2">
                      <button
                        onClick={handleSimulatePixConfirm}
                        disabled={isSimulatingPix}
                        className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isSimulatingPix ? 'Verificando...' : '⚡ Simular Confirmação Instantânea PIX'}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center space-y-2">
                    <p className="text-sm font-bold text-emerald-400">
                      ✓ Pagamento Recebido e Confirmado!
                    </p>
                    <p className="text-xs text-slate-300">
                      Seus itens já estão prontos para separação e produção gráfica no Crato.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Direct WhatsApp Share with real store number (88) 99225-5256 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={`https://wa.me/5588992255256?text=${encodeURIComponent(
                  `Olá Trilha Sonora Crato! Acabei de fazer o pedido ${createdOrder.code} no valor de R$ ${createdOrder.total.toFixed(2)}. Meu nome é ${createdOrder.userName}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Comprovante no WhatsApp (88) 99225-5256</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
              >
                Continuar Navegando
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
