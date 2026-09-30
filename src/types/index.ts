export type UserRole = 'ADMIN' | 'OPERATOR' | 'CLIENT' | 'GUEST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  cpfCnpj?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export type ProductCategory = 
  | 'GRAFICA_CAMISAS'
  | 'GRAFICA_CANECAS'
  | 'GRAFICA_PAPELARIA'
  | 'GRAFICA_BRINDES'
  | 'ELETRONICOS_AUDIO'
  | 'ELETRONICOS_CABOS'
  | 'ELETRONICOS_ENERGIA'
  | 'ELETRONICOS_ACESSORIOS';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  categoryName: string;
  isGraphic: boolean; // Gráfica vs Frente de Loja Eletrônicos
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  description: string;
  features: string[];
  imageUrl: string;
  additionalImages?: string[];
  customizable: boolean;
  productionDays?: number; // Prazos para gráfica (ex: 1 a 2 dias úteis)
  colorOptions?: string[];
  sizeOptions?: string[];
  featured?: boolean;
}

export interface CustomizationData {
  text?: string;
  fontFamily?: string;
  textColor?: string;
  previewUrl?: string;
  colorSelected?: string;
  sizeSelected?: string;
  uploadedArtName?: string;
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: CustomizationData;
  selectedColor?: string;
  selectedSize?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGO'
  | 'EM_PRODUCAO'
  | 'PRONTO_RETIRADA'
  | 'EM_ROTA'
  | 'ENTREGUE'
  | 'CANCELADO';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customization?: CustomizationData;
  isGraphic: boolean;
}

export interface DeliveryDetails {
  type: 'RETIRADA_BALCAO' | 'ENTREGA_LOCAL_CARIRI' | 'CORREIOS_SEDEX';
  recipientName: string;
  phone: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string; // Crato, Juazeiro do Norte, Barbalha, etc.
  state: string;
  zipCode?: string;
  shippingFee: number;
  estimatedDelivery: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  installments?: number;
  pixQrCodeUrl?: string;
  pixCopyPaste?: string;
  boletoDigitableLine?: string;
  cardLastFour?: string;
  paidAt?: string;
  transactionId: string;
}

export interface Order {
  id: string;
  code: string; // Ex: #TS-1042
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment: PaymentDetails;
  delivery: DeliveryDetails;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAuditLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  quantityChange: number;
  newStock: number;
  reason: string;
  authorName: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalRevenueMonth: number;
  totalRevenueToday: number;
  pendingOrdersCount: number;
  inProductionCount: number;
  completedOrdersCount: number;
  lowStockCount: number;
  totalProductsCount: number;
  totalCustomersCount: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
  salesByCategory: { category: string; label: string; amount: number; count: number }[];
  salesByPayment: { method: PaymentMethod; amount: number; count: number }[];
}
