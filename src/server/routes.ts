import { Router, type Response } from 'express';
import { Database } from './db';
import { 
  registerSchema, 
  loginSchema, 
  guestAccessSchema, 
  productCreateSchema, 
  productUpdateSchema, 
  stockAdjustmentSchema, 
  checkoutSchema, 
  updateOrderStatusSchema 
} from './schemas';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  authenticateToken, 
  optionalAuth, 
  requireAdmin, 
  requireAdminOrOperator, 
  rateLimiter, 
  type AuthenticatedRequest 
} from './security';
import type { Order, OrderStatus, PaymentDetails, ProductCategory } from '../types';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & ACCESS CONTROL
// ==========================================

// Register
apiRouter.post('/auth/register', rateLimiter(60000, 15), async (req, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Dados inválidos', details: parsed.error.format() });
      return;
    }

    const { name, email, password, phone, cpfCnpj, role } = parsed.data;

    const existing = Database.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'Este e-mail já está cadastrado na Trilha Sonora' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const newUser = Database.createUser({
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      phone,
      cpfCnpj,
      role: role || 'CLIENT',
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    const token = generateToken({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno ao realizar cadastro' });
  }
});

// Login
apiRouter.post('/auth/login', rateLimiter(60000, 20), async (req, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Credenciais inválidas', details: parsed.error.format() });
      return;
    }

    const { email, password } = parsed.data;
    const user = Database.findUserByEmail(email);

    if (!user) {
      res.status(401).json({ error: 'E-mail ou senha incorretos' });
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'E-mail ou senha incorretos' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      message: 'Autenticado com sucesso',
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno no processo de autenticação' });
  }
});

// Guest Access / Acesso Livre para compra rápida
apiRouter.post('/auth/guest', (req, res: Response) => {
  try {
    const parsed = guestAccessSchema.safeParse(req.body);
    const name = parsed.success ? parsed.data.name : 'Visitante Trilha Sonora';
    const email = parsed.success && parsed.data.email ? parsed.data.email : `visitante_${Date.now()}@trilhasonora.com.br`;

    const guestId = `guest-${Date.now()}`;
    const token = generateToken({
      userId: guestId,
      name,
      email,
      role: 'GUEST',
      isGuest: true,
    });

    res.json({
      message: 'Acesso livre iniciado',
      user: {
        id: guestId,
        name,
        email,
        role: 'GUEST',
        createdAt: new Date().toISOString(),
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar acesso livre' });
  }
});

// Get current profile
apiRouter.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Não autenticado' });
    return;
  }

  const user = Database.findUserById(req.user.userId);
  if (user) {
    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, role: req.user.role });
  } else {
    // If guest or temporary session
    res.json({
      user: {
        id: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      role: req.user.role,
    });
  }
});

// List users (Admin only)
apiRouter.get('/users', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ users: Database.getAllUsers() });
});

// Change user role (Admin only)
apiRouter.patch('/users/:id/role', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['ADMIN', 'OPERATOR', 'CLIENT'].includes(role)) {
    res.status(400).json({ error: 'Nível de acesso inválido' });
    return;
  }

  const updated = Database.updateUserRole(id, role);
  if (!updated) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json({ message: 'Nível de permissão atualizado', user: updated });
});

// ==========================================
// 2. PRODUCT & INVENTORY MANAGEMENT
// ==========================================

// Get products
apiRouter.get('/products', (req, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const isGraphicParam = req.query.isGraphic as string | undefined;
    const search = req.query.search as string | undefined;

    const isGraphic = isGraphicParam !== undefined ? isGraphicParam === 'true' : undefined;

    const products = Database.getAllProducts({
      category,
      isGraphic,
      search,
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar catálogo' });
  }
});

// Get single product
apiRouter.get('/products/:id', (req, res: Response) => {
  const product = Database.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }
  res.json({ product });
});

// Create product (Admin / Operator)
apiRouter.post('/products', authenticateToken, requireAdminOrOperator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = productCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Campos inválidos', details: parsed.error.format() });
      return;
    }

    const newProduct = Database.createProduct({
      ...parsed.data,
      id: `prod-${Date.now()}`,
    });

    res.status(201).json({ message: 'Produto cadastrado com sucesso', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Update product (Admin / Operator)
apiRouter.put('/products/:id', authenticateToken, requireAdminOrOperator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = productUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Campos inválidos', details: parsed.error.format() });
      return;
    }

    const updated = Database.updateProduct(req.params.id, parsed.data);
    if (!updated) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.json({ message: 'Produto atualizado com sucesso', product: updated });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Delete product (Admin only)
apiRouter.delete('/products/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = Database.deleteProduct(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }
  res.json({ message: 'Produto removido com sucesso' });
});

// Stock adjustment with audit trail (Admin / Operator)
apiRouter.post('/products/:id/stock', authenticateToken, requireAdminOrOperator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = stockAdjustmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Dados do ajuste inválidos', details: parsed.error.format() });
      return;
    }

    const authorName = req.user?.name || 'Administrador Trilha Sonora';
    const result = Database.adjustStock(
      req.params.id,
      parsed.data.quantityChange,
      parsed.data.reason,
      authorName
    );

    if (!result) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.json({
      message: 'Estoque ajustado e registrado em auditoria com sucesso',
      product: result.product,
      auditLog: result.log,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ajustar estoque' });
  }
});

// Stock audit logs (Admin / Operator)
apiRouter.get('/stock/audit-logs', authenticateToken, requireAdminOrOperator, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ logs: Database.getAuditLogs() });
});

// ==========================================
// 3. CHECKOUT & PAYMENT GATEWAY INTEGRATION
// ==========================================

apiRouter.post('/checkout', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Informações do pedido incompletas', details: parsed.error.format() });
      return;
    }

    const { items, delivery, paymentMethod, cardDetails, notes } = parsed.data;

    // Check stock availability
    for (const item of items) {
      const prod = Database.getProductById(item.productId);
      if (!prod) {
        res.status(400).json({ error: `Produto ${item.productName} não está mais disponível` });
        return;
      }
      if (prod.stock < item.quantity) {
        res.status(400).json({ 
          error: `Estoque insuficiente para ${prod.name}. Disponível: ${prod.stock} un.` 
        });
        return;
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shippingFee = delivery.shippingFee || 0;
    const discount = paymentMethod === 'PIX' ? Number((subtotal * 0.05).toFixed(2)) : 0; // 5% de desconto no PIX
    const total = Number((subtotal + shippingFee - discount).toFixed(2));

    const orderCode = `#TS-${Math.floor(1000 + Math.random() * 9000)}`;
    const txId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    let paymentDetails: PaymentDetails;

    if (paymentMethod === 'PIX') {
      // Real BRCode standard EMV payload simulation for Trilha Sonora Crato
      const pixKey = '88988421001';
      const pixPayload = `00020126580014br.gov.bcb.pix0136trilhasonoracrato@pix.com520400005303986540${total.toFixed(2).padStart(5, '0')}5802BR5919Trilha Sonora Crato6005Crato62070503***6304`;
      
      paymentDetails = {
        method: 'PIX',
        status: 'PENDENTE',
        pixCopyPaste: pixPayload,
        pixQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(pixPayload)}`,
        transactionId: txId,
      };
    } else if (paymentMethod === 'CREDIT_CARD') {
      const lastFour = cardDetails?.number ? cardDetails.number.slice(-4) : '9988';
      paymentDetails = {
        method: 'CREDIT_CARD',
        status: 'APROVADO', // Gateway approved transaction simulation
        installments: cardDetails?.installments || 1,
        cardLastFour: lastFour,
        paidAt: new Date().toISOString(),
        transactionId: `CARD-GATEWAY-${txId}`,
      };
    } else {
      // Boleto Bancário
      const boletoCode = `23793.38128 60000.123456 78000.045678 1 ${Math.floor(8000 + Math.random() * 1999)}0000${total.toFixed(2).replace('.', '')}`;
      paymentDetails = {
        method: 'BOLETO',
        status: 'PENDENTE',
        boletoDigitableLine: boletoCode,
        transactionId: `BOL-GATEWAY-${txId}`,
      };
    }

    const userId = req.user ? req.user.userId : `guest-${Date.now()}`;
    const userName = delivery.recipientName;
    const userEmail = req.user?.email || `${userName.toLowerCase().replace(/\s+/g, '.')}@cliente.com`;
    const userPhone = delivery.phone;

    const initialStatus: OrderStatus = paymentDetails.status === 'APROVADO' ? 'PAGO' : 'AGUARDANDO_PAGAMENTO';

    const orderData: Order = {
      id: `ord-${Date.now()}`,
      code: orderCode,
      userId,
      userName,
      userEmail,
      userPhone,
      items: items.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        ...it,
        category: it.category as ProductCategory,
      })),
      subtotal,
      shippingFee,
      discount,
      total,
      status: initialStatus,
      payment: paymentDetails,
      delivery,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdOrder = Database.createOrder(orderData);

    res.status(201).json({
      message: 'Pedido realizado com sucesso!',
      order: createdOrder,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Erro ao processar checkout' });
  }
});

// Simulate PIX payment instant confirmation
apiRouter.post('/payments/simulate-pix/:orderId', (req, res: Response) => {
  const { orderId } = req.params;
  const order = Database.getOrderById(orderId);

  if (!order) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  const updated = Database.updateOrderStatus(order.id, 'PAGO', 'Pagamento PIX confirmado via Webhook Gateway Banco Central');
  res.json({ message: 'Pagamento PIX confirmado com sucesso!', order: updated });
});

// ==========================================
// 4. ORDERS & TRACKING
// ==========================================

// Get orders
apiRouter.get('/orders', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  // If admin or operator: can see all
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'OPERATOR')) {
    res.json({ orders: Database.getAllOrders() });
    return;
  }

  // If client logged in: see their orders
  if (req.user) {
    res.json({ orders: Database.getUserOrders(req.user.userId) });
    return;
  }

  // If guest, query by code or email if provided
  const code = req.query.code as string;
  if (code) {
    const ord = Database.getOrderById(code);
    res.json({ orders: ord ? [ord] : [] });
    return;
  }

  res.json({ orders: [] });
});

// Get single order by id or tracking code
apiRouter.get('/orders/:id', (req, res: Response) => {
  const order = Database.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }
  res.json({ order });
});

// Update order status (Admin / Operator)
apiRouter.patch('/orders/:id/status', authenticateToken, requireAdminOrOperator, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Status inválido', details: parsed.error.format() });
      return;
    }

    const { status, notes } = parsed.data;
    const author = req.user?.name || 'Gestão Trilha Sonora';
    const noteWithAuthor = notes ? `${notes} (por ${author})` : `Alterado para ${status} por ${author}`;

    const updated = Database.updateOrderStatus(req.params.id, status, noteWithAuthor);
    if (!updated) {
      res.status(404).json({ error: 'Pedido não encontrado' });
      return;
    }

    res.json({ message: 'Status do pedido atualizado com sucesso', order: updated });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
});

// ==========================================
// 5. DASHBOARD METRICS & ANALYTICS
// ==========================================

apiRouter.get('/dashboard/metrics', authenticateToken, requireAdminOrOperator, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = Database.getDashboardMetrics();
    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao computar métricas do dashboard' });
  }
});
