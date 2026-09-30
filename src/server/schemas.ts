import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve conter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: z.string().optional(),
  cpfCnpj: z.string().optional(),
  role: z.enum(['ADMIN', 'OPERATOR', 'CLIENT']).optional().default('CLIENT'),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const guestAccessSchema = z.object({
  name: z.string().min(2, 'Nome é necessário'),
  phone: z.string().min(8, 'Telefone para contato é necessário'),
  email: z.string().email().optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(2, 'Nome do produto é obrigatório'),
  sku: z.string().min(2, 'Código SKU obrigatório'),
  category: z.enum([
    'GRAFICA_CAMISAS',
    'GRAFICA_CANECAS',
    'GRAFICA_PAPELARIA',
    'GRAFICA_BRINDES',
    'ELETRONICOS_AUDIO',
    'ELETRONICOS_CABOS',
    'ELETRONICOS_ENERGIA',
    'ELETRONICOS_ACESSORIOS',
  ]),
  categoryName: z.string(),
  isGraphic: z.boolean(),
  price: z.number().positive('Preço deve ser maior que zero'),
  costPrice: z.number().min(0, 'Preço de custo não pode ser negativo'),
  stock: z.number().int().min(0, 'Estoque deve ser zero ou maior'),
  minStock: z.number().int().min(0, 'Estoque mínimo deve ser zero ou maior'),
  unit: z.string().default('un'),
  description: z.string().min(5, 'Descrição deve ser detalhada'),
  features: z.array(z.string()).default([]),
  imageUrl: z.string().url('URL da imagem inválida'),
  additionalImages: z.array(z.string()).optional(),
  customizable: z.boolean().default(false),
  productionDays: z.number().optional().default(1),
  colorOptions: z.array(z.string()).optional(),
  sizeOptions: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
});

export const productUpdateSchema = productCreateSchema.partial();

export const stockAdjustmentSchema = z.object({
  quantityChange: z.number().int('Quantidade deve ser inteira'),
  reason: z.string().min(3, 'Motivo do ajuste é obrigatório (ex: Entrada de Fornecedor, Venda Balcão, Quebra)'),
});

export const customizationSchema = z.object({
  text: z.string().optional(),
  fontFamily: z.string().optional(),
  textColor: z.string().optional(),
  previewUrl: z.string().optional(),
  colorSelected: z.string().optional(),
  sizeSelected: z.string().optional(),
  uploadedArtName: z.string().optional(),
  notes: z.string().optional(),
}).optional();

export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  category: z.string(),
  quantity: z.number().int().positive('Quantidade deve ser positiva'),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  customization: customizationSchema,
  isGraphic: z.boolean(),
});

export const deliverySchema = z.object({
  type: z.enum(['RETIRADA_BALCAO', 'ENTREGA_LOCAL_CARIRI', 'CORREIOS_SEDEX']),
  recipientName: z.string().min(2, 'Nome do destinatário obrigatório'),
  phone: z.string().min(8, 'Telefone de contato obrigatório'),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().default('Crato'),
  state: z.string().default('CE'),
  zipCode: z.string().optional(),
  shippingFee: z.number().min(0),
  estimatedDelivery: z.string(),
});

export const checkoutSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'O carrinho precisa ter ao menos 1 item'),
  delivery: deliverySchema,
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'BOLETO']),
  cardDetails: z.object({
    number: z.string().min(13).max(19),
    holder: z.string().min(3),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/),
    cvv: z.string().min(3).max(4),
    installments: z.number().int().min(1).max(12).default(1),
  }).optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'AGUARDANDO_PAGAMENTO',
    'PAGO',
    'EM_PRODUCAO',
    'PRONTO_RETIRADA',
    'EM_ROTA',
    'ENTREGUE',
    'CANCELADO',
  ]),
  notes: z.string().optional(),
});
