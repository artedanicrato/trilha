import type { 
  Product, 
  Order, 
  DashboardMetrics, 
  StockAuditLog, 
  User, 
  OrderStatus 
} from '../types';

const TOKEN_KEY = 'trilha_sonora_token';

export const Api = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = Api.getToken();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Ocorreu um erro na requisição');
    }
    return data;
  },

  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!responseOk(res)) throw new Error(data.error || 'Falha no login');
    Api.setToken(data.token);
    return data;
  },

  async register(userData: { name: string; email: string; password: string; phone?: string; role?: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!responseOk(res)) throw new Error(data.error || 'Falha no cadastro');
    Api.setToken(data.token);
    return data;
  },

  async guestLogin(name?: string, phone?: string) {
    const res = await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name || 'Cliente Visitante', phone: phone || '(88) 99000-0000' }),
    });
    const data = await res.json();
    if (!responseOk(res)) throw new Error(data.error || 'Falha ao iniciar visita');
    Api.setToken(data.token);
    return data;
  },

  async getMe() {
    return Api.fetchWithAuth('/api/auth/me');
  },

  async getUsers(): Promise<{ users: User[] }> {
    return Api.fetchWithAuth('/api/users');
  },

  async updateUserRole(userId: string, role: string) {
    return Api.fetchWithAuth(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  // Products
  async getProducts(params?: { category?: string; isGraphic?: boolean; search?: string }): Promise<{ products: Product[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.isGraphic !== undefined) query.set('isGraphic', String(params.isGraphic));
    if (params?.search) query.set('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/products${qs}`);
    if (!res.ok) throw new Error('Falha ao carregar catálogo de produtos');
    return res.json();
  },

  async getProductById(id: string): Promise<{ product: Product }> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    return res.json();
  },

  async createProduct(productData: Partial<Product>) {
    return Api.fetchWithAuth('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id: string, productData: Partial<Product>) {
    return Api.fetchWithAuth(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id: string) {
    return Api.fetchWithAuth(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  async adjustStock(productId: string, quantityChange: number, reason: string) {
    return Api.fetchWithAuth(`/api/products/${productId}/stock`, {
      method: 'POST',
      body: JSON.stringify({ quantityChange, reason }),
    });
  },

  async getStockAuditLogs(): Promise<{ logs: StockAuditLog[] }> {
    return Api.fetchWithAuth('/api/stock/audit-logs');
  },

  // Orders
  async checkout(payload: any): Promise<{ message: string; order: Order }> {
    return Api.fetchWithAuth('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getOrders(codeQuery?: string): Promise<{ orders: Order[] }> {
    const qs = codeQuery ? `?code=${encodeURIComponent(codeQuery)}` : '';
    return Api.fetchWithAuth(`/api/orders${qs}`);
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Pedido não encontrado');
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<{ message: string; order: Order }> {
    return Api.fetchWithAuth(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  async simulatePixPayment(orderId: string): Promise<{ message: string; order: Order }> {
    const res = await fetch(`/api/payments/simulate-pix/${orderId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Falha ao simular confirmação PIX');
    return res.json();
  },

  // Dashboard
  async getDashboardMetrics(): Promise<{ metrics: DashboardMetrics }> {
    return Api.fetchWithAuth('/api/dashboard/metrics');
  },
};

function responseOk(res: Response): boolean {
  return res.status >= 200 && res.status < 300;
}
