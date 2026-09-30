import fs from 'fs';
import path from 'path';
import type { 
  User, 
  Product, 
  Order, 
  StockAuditLog, 
  DashboardMetrics, 
  OrderStatus,
  PaymentMethod 
} from '../types';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  products: Product[];
  orders: Order[];
  auditLogs: StockAuditLog[];
}

let db: DatabaseSchema = {
  users: [],
  products: [],
  orders: [],
  auditLogs: []
};

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create data dir, using in-memory mode', e);
}

function saveDb(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// Initial seed generation
export async function initializeDatabase(): Promise<void> {
  const adminHash = await bcrypt.hash('admin123', 10);
  const operatorHash = await bcrypt.hash('operador123', 10);
  const clientHash = await bcrypt.hash('cliente123', 10);

  const initialUsers: (User & { passwordHash: string })[] = [
    {
      id: 'usr-admin-1',
      name: 'Diretoria Trilha Sonora',
      email: 'admin@trilhasonora.com.br',
      passwordHash: adminHash,
      role: 'ADMIN',
      phone: '(88) 99225-5256',
      cpfCnpj: '08.123.456/0001-78',
      address: {
        street: 'Rua Doutor João Pessoa',
        number: '91',
        neighborhood: 'Centro',
        city: 'Crato',
        state: 'CE',
        zipCode: '63100-000',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-op-1',
      name: 'Equipe de Produção Gráfica',
      email: 'producao@trilhasonora.com.br',
      passwordHash: operatorHash,
      role: 'OPERATOR',
      phone: '(88) 98842-1002',
      address: {
        street: 'Rua Barbara de Alencar',
        number: '120',
        neighborhood: 'Centro',
        city: 'Crato',
        state: 'CE',
        zipCode: '63100-010',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-client-1',
      name: 'Maria Cecília Alencar',
      email: 'cliente@cariri.com.br',
      passwordHash: clientHash,
      role: 'CLIENT',
      phone: '(88) 99765-4321',
      address: {
        street: 'Av. Padre Cícero',
        number: '1580',
        neighborhood: 'São Miguel',
        city: 'Crato',
        state: 'CE',
        zipCode: '63102-000',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  const initialProducts: Product[] = [
    // Gráfica, Plotagens & Personalizados
    {
      id: 'prod-camisa-dtf',
      name: 'Camiseta Personalizada DTF / Silk 100% Algodão 30.1',
      sku: 'GRF-CAM-001',
      category: 'GRAFICA_CAMISAS',
      categoryName: 'Camisetas & Vestuário',
      isGraphic: true,
      price: 49.90,
      costPrice: 22.00,
      stock: 85,
      minStock: 20,
      unit: 'un',
      description: 'Camiseta 100% algodão penteado fio 30.1 com estampa digital DTF alta definição ou serigrafia. Não desbota, toque macio, ideal para eventos, bandas, formaturas e uniformes corporativos do Cariri.',
      features: [
        'Tecido 100% Algodão Premium Penteado 30.1',
        'Impressão Digital DTF com cores vibrantes e alta durabilidade',
        'Gola redonda canelada reforçada com pesponto',
        'Prazo de confecção rápida em até 48h úteis no Crato'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 2,
      colorOptions: ['Preta', 'Branca', 'Azul Royal Trilha', 'Vermelha', 'Cinza Mescla'],
      sizeOptions: ['P', 'M', 'G', 'GG', 'XG'],
      featured: true,
    },
    {
      id: 'prod-caneca-porcelana',
      name: 'Caneca de Porcelana Resinada com Foto / Logotipo (325ml)',
      sku: 'GRF-CAN-001',
      category: 'GRAFICA_CANECAS',
      categoryName: 'Canecas & Brindes',
      isGraphic: true,
      price: 38.00,
      costPrice: 14.50,
      stock: 120,
      minStock: 25,
      unit: 'un',
      description: 'Caneca de porcelana classe AAA resinada para sublimação fotográfica com cores vivas e brilho espelhado. Pode levar ao micro-ondas com total segurança. Personalize com fotos de família, frases, casamentos e logotipos.',
      features: [
        'Porcelana Classe AAA com resina ultra brilhante',
        'Capacidade de 325ml com pegada ergonômica',
        'Pode ser levada ao micro-ondas com total segurança',
        'Impressão 360° com fidelidade de cores'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 1,
      colorOptions: ['Branca Pura', 'Interior Preto', 'Interior Azul Royal', 'Interior Laranja'],
      featured: true,
    },
    {
      id: 'prod-caneca-magica',
      name: 'Caneca Mágica Termossensível Black Velvet (Revela Arte)',
      sku: 'GRF-CAN-002',
      category: 'GRAFICA_CANECAS',
      categoryName: 'Canecas & Brindes',
      isGraphic: true,
      price: 49.90,
      costPrice: 20.00,
      stock: 35,
      minStock: 15,
      unit: 'un',
      description: 'Caneca mágica com acabamento preto acetinado fosco que revela a sua foto ou arte oculta instantaneamente ao adicionar café quente ou chá. Efeito visual surpreendente para presentes inesquecíveis.',
      features: [
        'Efeito termocrômico de alta sensibilidade',
        'Revela a imagem gradualmente com líquido quente',
        'Acabamento premium fosco Black Velvet',
        'Personalizável com qualquer foto ou arte'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 1,
      colorOptions: ['Preto Fosco (Revela Cor)'],
      featured: true,
    },
    {
      id: 'prod-banner-lona',
      name: 'Banner Promocional em Lona 440g c/ Acabamento Madeira e Cordão',
      sku: 'GRF-BAN-001',
      category: 'GRAFICA_PAPELARIA',
      categoryName: 'Banners & Grandes Formatos',
      isGraphic: true,
      price: 65.00,
      costPrice: 24.00,
      stock: 40,
      minStock: 10,
      unit: 'un',
      description: 'Banner promocional impresso em lona vinílica 440g anti-reflexo com tinta solvente resistente ao sol e chuva do Cariri. Acompanha bastão de madeira reflorestada, ponteiras plásticas e cordão pronto para pendurar.',
      features: [
        'Lona Frontlight resistente 440g brilhante ou fosca',
        'Impressão eco-solvente de 1440 DPI em alta definição',
        'Acabamento completo com bastão de madeira e cordão',
        'Ideal para comércio, feiras, aniversários e igrejas'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 1,
      sizeOptions: ['70x100 cm', '100x150 cm', '120x200 cm'],
      featured: true,
    },
    {
      id: 'prod-plotagem-recorte',
      name: 'Plotagem em Vinil e Recorte Eletrônico para Vitrines e Frotas (m²)',
      sku: 'GRF-PLO-001',
      category: 'GRAFICA_PAPELARIA',
      categoryName: 'Plotagens & Comunicação Visual',
      isGraphic: true,
      price: 75.00,
      costPrice: 28.00,
      stock: 50,
      minStock: 10,
      unit: 'm²',
      description: 'Serviço de plotagem computadorizada em vinil colorido ou perfurado de alta performance para vitrines de lojas, envelopamento de frotas e comunicação visual de fachadas no Crato.',
      features: [
        'Plotter industrial de corte milimétrico de alta precisão',
        'Vinil polimérico com durabilidade externa de até 5 anos',
        'Cores sólidas ou vinil transparente com laminação protetora',
        'Aplicável em vidros, paredes lisas e lataria automotiva'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 2,
      featured: true,
    },
    {
      id: 'prod-adesivo-vinil',
      name: 'Adesivos Vinil com Recorte Eletrônico Kiss-Cut (Cartela c/ 50 un)',
      sku: 'GRF-ADE-001',
      category: 'GRAFICA_BRINDES',
      categoryName: 'Adesivos & Brindes',
      isGraphic: true,
      price: 35.00,
      costPrice: 11.00,
      stock: 90,
      minStock: 20,
      unit: 'cartela',
      description: 'Adesivos impressos em vinil à prova d’água com recorte eletrônico preciso no formato da sua logomarca ou ilustração. Perfeito para embalagens delivery, potes, copos e personalização de brindes.',
      features: [
        'Vinil adesivo à prova d’água resistente a geladeira e umidade',
        'Recorte eletrônico no formato exato da sua arte (Kiss-Cut)',
        'Cores vibrantes com secagem instantânea UV',
        'Excelente aderência em vidro, plástico, papel e papelão'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 1,
      featured: false,
    },
    {
      id: 'prod-cartao-visita',
      name: 'Cartões de Visita Couché 300g c/ Laminação Fosca e Verniz UV (500 un)',
      sku: 'GRF-CRD-001',
      category: 'GRAFICA_PAPELARIA',
      categoryName: 'Papelaria & Grandes Formatos',
      isGraphic: true,
      price: 89.90,
      costPrice: 38.00,
      stock: 60,
      minStock: 15,
      unit: 'cento',
      description: 'Cartão de visita executivo em papel Couché 300g encorpado, impressão colorida frente e verso (4x4), laminação fosca pro-touch e aplicação nobre de verniz localizado UV.',
      features: [
        'Papel Couché 300g importado de altíssima rigidez',
        'Laminação Soft Matte fosca aveludada',
        'Verniz UV localizado com brilho espelhado na logo',
        'Corte reto padrão 9x5 cm com cantos perfeitos'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 3,
      featured: true,
    },
    {
      id: 'prod-quadro-canvas',
      name: 'Quadro Decorativo em Tecido Canvas c/ Chassi de Madeira Reflorestada',
      sku: 'GRF-CANV-001',
      category: 'GRAFICA_PAPELARIA',
      categoryName: 'Papelaria & Grandes Formatos',
      isGraphic: true,
      price: 119.00,
      costPrice: 48.00,
      stock: 25,
      minStock: 8,
      unit: 'un',
      description: 'Quadro decorativo com impressão fotográfica artística em tecido Canvas 100% algodão montado em chassi de madeira nobre. Borda infinita com a continuidade da sua arte ou fotografia favorita.',
      features: [
        'Tecido Canvas 100% algodão textura de tela de pintura',
        'Impressão fotográfica Fine Art 12 cores sem reflexo',
        'Chassi de madeira reflorestada chanfrada de 3cm',
        'Pronto para pendurar na parede da sua casa ou escritório'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 2,
      sizeOptions: ['40x60 cm', '60x90 cm'],
      featured: true,
    },
    {
      id: 'prod-copo-longdrink',
      name: 'Copos Long Drink Personalizados em Transfer Laser (Cento)',
      sku: 'GRF-COP-001',
      category: 'GRAFICA_BRINDES',
      categoryName: 'Adesivos & Brindes',
      isGraphic: true,
      price: 199.00,
      costPrice: 95.00,
      stock: 45,
      minStock: 10,
      unit: 'cento',
      description: 'Copos long drink resistentes em acrílico 350ml com personalização colorida frente ou frente/verso em transfer laser. Essencial para aniversários, casamentos, formaturas e eventos no Cariri.',
      features: [
        'Acrílico virgem atóxico e reforçado',
        'Impressão em Transfer Laser de alta fixação que não descasca',
        'Variedade de cores translúcidas, sólidas e neon',
        'Pedido mínimo especial para festas e eventos'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?w=800&auto=format&fit=crop&q=80',
      customizable: true,
      productionDays: 2,
      colorOptions: ['Transparente Cristal', 'Neon Laranja', 'Neon Azul', 'Branco Leitoso', 'Preto Sólido'],
      featured: false,
    },

    // Frente de Loja Eletrônicos & Informática
    {
      id: 'prod-fone-tws-pro',
      name: 'Fone de Ouvido Bluetooth Sem Fio TWS Bass Pro com Display',
      sku: 'ELE-FNE-001',
      category: 'ELETRONICOS_AUDIO',
      categoryName: 'Áudio & Fones',
      isGraphic: false,
      price: 119.90,
      costPrice: 58.00,
      stock: 18,
      minStock: 10,
      unit: 'un',
      description: 'Fone sem fio Bluetooth 5.3 com som estéreo Hi-Fi, graves profundos Dynamic Bass, microfone embutido para chamadas cristalinas e estojo recarregável com display digital de porcentagem de bateria.',
      features: [
        'Conectividade Bluetooth 5.3 com alcance de até 15 metros',
        'Bateria de até 6 horas contínuas + 24h na case carregadora',
        'Controle Touch inteligente para músicas e chamadas',
        'Isolamento acústico passivo confortável para o dia a dia'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      customizable: false,
      colorOptions: ['Preto Grafite', 'Branco Glacial'],
      featured: true,
    },
    {
      id: 'prod-caixa-som-bt',
      name: 'Caixa de Som Bluetooth 40W Portátil com LED RGB e Bateria Longa',
      sku: 'ELE-BOX-001',
      category: 'ELETRONICOS_AUDIO',
      categoryName: 'Áudio & Fones',
      isGraphic: false,
      price: 189.90,
      costPrice: 95.00,
      stock: 8,
      minStock: 12,
      unit: 'un',
      description: 'Caixa acústica potente de 40W RMS com iluminação rítmica em LED RGB que dança com a música. Resistente a respingos (IPX5), rádio FM integrado, entradas USB para pen drive e cartão micro SD.',
      features: [
        'Potência de 40W RMS com radiadores passivos de graves',
        'Show de luzes dinâmico RGB com múltiplos modos',
        'Bateria de 3600mAh com até 10 horas de reprodução contínua',
        'Função TWS: emparelhe duas caixas simultaneamente para som estéreo'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      customizable: false,
      featured: true,
    },
    {
      id: 'prod-carregador-gan-30w',
      name: 'Carregador Turbo 30W GaN Fast Charge + Cabo Tipo-C Reforçado',
      sku: 'ELE-CRG-001',
      category: 'ELETRONICOS_ENERGIA',
      categoryName: 'Carregadores & Energia',
      isGraphic: false,
      price: 79.90,
      costPrice: 32.00,
      stock: 45,
      minStock: 15,
      unit: 'un',
      description: 'Fonte ultra compacta com tecnologia GaN (Nitreto de Gálio) de 30W Power Delivery. Não esquenta, carrega 60% da bateria de smartphones Android e iPhone em apenas 30 minutos. Acompanha cabo de 1m trançado em nylon.',
      features: [
        'Tecnologia GaN de alta eficiência térmica e tamanho reduzido',
        'Compatível com iPhone, Samsung, Motorola e Xiaomi',
        'Proteção contra sobretensão, sobrecorrente e curto-circuito',
        'Acompanha cabo trançado resistente a mais de 10.000 dobras'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
      customizable: false,
      featured: true,
    },
    {
      id: 'prod-cabo-magnetico',
      name: 'Cabo Reforçado em Malha Nylon Trançada Tipo-C / Lightning',
      sku: 'ELE-CAB-001',
      category: 'ELETRONICOS_CABOS',
      categoryName: 'Cabos & Conexões',
      isGraphic: false,
      price: 39.90,
      costPrice: 13.00,
      stock: 52,
      minStock: 15,
      unit: 'un',
      description: 'Cabo ultra resistente em liga de zinco com blindagem de nylon balístico. Carregamento rápido turbo e sincronização de dados estável, suportando mais de 15.000 torções.',
      features: [
        'Pontas reforçadas anti-quebra',
        'Suporte a carregamento rápido Fast Charging',
        'Comprimento de 1.2 metros com abraçadeira organizadora',
        'Garantia balcão na loja Trilha Sonora'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
      customizable: false,
      featured: false,
    },
    {
      id: 'prod-suporte-veicular',
      name: 'Suporte Veicular Magnético com Trava e Rotação 360°',
      sku: 'ELE-ACS-001',
      category: 'ELETRONICOS_ACESSORIOS',
      categoryName: 'Acessórios Tech & Suportes',
      isGraphic: false,
      price: 34.90,
      costPrice: 12.00,
      stock: 30,
      minStock: 10,
      unit: 'un',
      description: 'Suporte veicular para grade de ventilação do carro com 6 imãs de neodímio N52 ultra potentes. Mantém o smartphone firme mesmo em estradas de paralelepípedo ou trepidações.',
      features: [
        'Trava tipo gancho reforçada que não cai da grade',
        'Cabeça esférica com rotação total de 360 graus',
        'Acompanha 2 placas metálicas ultrafinas com fita 3M',
        'Não interfere no sinal de GPS ou na rede celular'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
      customizable: false,
      featured: false,
    }
  ];

  const initialOrders: Order[] = [
    {
      id: 'ord-1001',
      code: '#TS-1048',
      userId: 'usr-client-1',
      userName: 'Maria Cecília Alencar',
      userEmail: 'cliente@cariri.com.br',
      userPhone: '(88) 99765-4321',
      items: [
        {
          id: 'item-1',
          productId: 'prod-camisa-dtf',
          productName: 'Camisa Personalizada Algodão Penteado 30.1',
          category: 'GRAFICA_CAMISAS',
          quantity: 4,
          unitPrice: 49.90,
          totalPrice: 199.60,
          isGraphic: true,
          customization: {
            text: 'Festival do Crato 2026',
            fontFamily: 'Outfit',
            textColor: '#0ea5e9',
            colorSelected: 'Preta',
            sizeSelected: 'G',
            notes: 'Estampar no peito esquerdo e costas grande'
          }
        },
        {
          id: 'item-2',
          productId: 'prod-caneca-magica',
          productName: 'Caneca Mágica Fosca Termossensível 325ml',
          category: 'GRAFICA_CANECAS',
          quantity: 2,
          unitPrice: 49.90,
          totalPrice: 99.80,
          isGraphic: true,
          customization: {
            text: 'Trilha Sonora Rock & Café',
            textColor: '#ffffff',
            colorSelected: 'Preto Fosco'
          }
        }
      ],
      subtotal: 299.40,
      shippingFee: 0,
      discount: 0,
      total: 299.40,
      status: 'EM_PRODUCAO',
      payment: {
        method: 'PIX',
        status: 'APROVADO',
        pixCopyPaste: '00020126580014br.gov.bcb.pix0136trilhasonoracrato@pix.com5204000053039865406299.405802BR5913Trilha Sonora6005Crato62070503***6304E8A2',
        paidAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        transactionId: 'PIX-TX-99210-CRATO'
      },
      delivery: {
        type: 'RETIRADA_BALCAO',
        recipientName: 'Maria Cecília Alencar',
        phone: '(88) 99765-4321',
        city: 'Crato',
        state: 'CE',
        shippingFee: 0,
        estimatedDelivery: 'Pronto p/ retirada em 24h na loja física (Centro do Crato)'
      },
      notes: 'Cliente solicitou conferência da arte antes da prensa térmica',
      createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    },
    {
      id: 'ord-1002',
      code: '#TS-1049',
      userId: 'usr-client-2',
      userName: 'Carlos Eduardo Barreto',
      userEmail: 'carlos.barreto@gmail.com',
      userPhone: '(88) 98112-9988',
      items: [
        {
          id: 'item-3',
          productId: 'prod-fone-tws-pro',
          productName: 'Fone de Ouvido Bluetooth Sem Fio TWS Bass Pro',
          category: 'ELETRONICOS_AUDIO',
          quantity: 1,
          unitPrice: 119.90,
          totalPrice: 119.90,
          isGraphic: false,
        },
        {
          id: 'item-4',
          productId: 'prod-carregador-gan-30w',
          productName: 'Carregador Turbo 30W GaN Fast Charge + Cabo Tipo-C',
          category: 'ELETRONICOS_ENERGIA',
          quantity: 1,
          unitPrice: 79.90,
          totalPrice: 79.90,
          isGraphic: false,
        }
      ],
      subtotal: 199.80,
      shippingFee: 12.00,
      discount: 0,
      total: 211.80,
      status: 'PRONTO_RETIRADA',
      payment: {
        method: 'CREDIT_CARD',
        status: 'APROVADO',
        installments: 3,
        cardLastFour: '4288',
        paidAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
        transactionId: 'CARD-AUTH-77391-VISA'
      },
      delivery: {
        type: 'ENTREGA_LOCAL_CARIRI',
        recipientName: 'Carlos Eduardo Barreto',
        phone: '(88) 98112-9988',
        street: 'Rua São Pedro',
        number: '890',
        neighborhood: 'Centro',
        city: 'Juazeiro do Norte',
        state: 'CE',
        shippingFee: 12.00,
        estimatedDelivery: 'Entrega expressa via motoboy hoje à tarde'
      },
      createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: 'ord-1003',
      code: '#TS-1050',
      userId: 'usr-client-3',
      userName: 'Academia Corpo & Movimento Crato',
      userEmail: 'financeiro@corpoemovimento.com.br',
      userPhone: '(88) 99234-5678',
      items: [
        {
          id: 'item-5',
          productId: 'prod-cartao-visita',
          productName: 'Cartões de Visita 4x4 Cores Couché 300g (500 un)',
          category: 'GRAFICA_PAPELARIA',
          quantity: 2,
          unitPrice: 89.90,
          totalPrice: 179.80,
          isGraphic: true,
          customization: {
            text: 'Cartões Instrutores e Recepção 2026',
            notes: 'Arquivo PDF vetorizado enviado em anexo'
          }
        }
      ],
      subtotal: 179.80,
      shippingFee: 0,
      discount: 0,
      total: 179.80,
      status: 'ENTREGUE',
      payment: {
        method: 'PIX',
        status: 'APROVADO',
        paidAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        transactionId: 'PIX-TX-88301-CRATO'
      },
      delivery: {
        type: 'RETIRADA_BALCAO',
        recipientName: 'Rodrigo Medeiros',
        phone: '(88) 99234-5678',
        city: 'Crato',
        state: 'CE',
        shippingFee: 0,
        estimatedDelivery: 'Entregue no balcão da Trilha Sonora'
      },
      createdAt: new Date(Date.now() - 3600 * 1000 * 52).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    }
  ];

  const initialLogs: StockAuditLog[] = [
    {
      id: 'log-1',
      productId: 'prod-camisa-dtf',
      productName: 'Camisa Personalizada Algodão Penteado 30.1',
      previousStock: 100,
      quantityChange: -15,
      newStock: 85,
      reason: 'Vendas da Semana & Pedidos Confirmados',
      authorName: 'Sistema Automático',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    },
    {
      id: 'log-2',
      productId: 'prod-caixa-som-bt',
      productName: 'Caixa de Som Bluetooth 40W Portátil',
      previousStock: 15,
      quantityChange: -7,
      newStock: 8,
      reason: 'Venda Balcão Frente de Loja',
      authorName: 'Diretoria Trilha Sonora',
      createdAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
    }
  ];

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      if (db.users && db.products && db.orders) {
        // Sync products with updated high-resolution images and features
        initialProducts.forEach((freshProd) => {
          const idx = db.products.findIndex(p => p.id === freshProd.id);
          if (idx >= 0) {
            db.products[idx].imageUrl = freshProd.imageUrl;
            db.products[idx].name = freshProd.name;
            db.products[idx].description = freshProd.description;
            db.products[idx].categoryName = freshProd.categoryName;
          } else {
            db.products.push(freshProd);
          }
        });
        saveDb();
        console.log(`[DB] Banco Trilha Sonora sincronizado com ${db.products.length} produtos e ${db.orders.length} pedidos.`);
        return;
      }
    } catch (e) {
      console.warn('[DB] Erro ao ler store.json existente, gerando sementes novas...', e);
    }
  }

  db = {
    users: initialUsers,
    products: initialProducts,
    orders: initialOrders,
    auditLogs: initialLogs
  };

  saveDb();
}

// Database query interfaces
export const Database = {
  // Users
  findUserByEmail: (email: string) => {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id: string) => {
    return db.users.find(u => u.id === id);
  },

  getAllUsers: () => {
    return db.users.map(({ passwordHash, ...rest }) => rest);
  },

  createUser: (userData: User & { passwordHash: string }) => {
    db.users.push(userData);
    saveDb();
    const { passwordHash, ...rest } = userData;
    return rest;
  },

  updateUserRole: (userId: string, role: User['role']) => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    user.role = role;
    saveDb();
    const { passwordHash, ...rest } = user;
    return rest;
  },

  // Products
  getAllProducts: (filters?: { category?: string; isGraphic?: boolean; search?: string }) => {
    let list = [...db.products];

    if (filters?.category) {
      list = list.filter(p => p.category === filters.category);
    }

    if (filters?.isGraphic !== undefined) {
      list = list.filter(p => p.isGraphic === filters.isGraphic);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getProductById: (id: string) => {
    return db.products.find(p => p.id === id);
  },

  createProduct: (product: Product) => {
    db.products.unshift(product);
    saveDb();
    return product;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates };
    saveDb();
    return db.products[idx];
  },

  deleteProduct: (id: string) => {
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    db.products.splice(idx, 1);
    saveDb();
    return true;
  },

  adjustStock: (productId: string, quantityChange: number, reason: string, authorName: string) => {
    const product = db.products.find(p => p.id === productId);
    if (!product) return null;

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + quantityChange);
    product.stock = newStock;

    const log: StockAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      productName: product.name,
      previousStock,
      quantityChange,
      newStock,
      reason,
      authorName,
      createdAt: new Date().toISOString(),
    };

    db.auditLogs.unshift(log);
    saveDb();
    return { product, log };
  },

  getAuditLogs: () => {
    return db.auditLogs;
  },

  // Orders
  getAllOrders: () => {
    return [...db.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUserOrders: (userId: string) => {
    return db.orders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrderById: (id: string) => {
    return db.orders.find(o => o.id === id || o.code === id);
  },

  createOrder: (order: Order) => {
    db.orders.unshift(order);
    
    // Decrement stock for purchased items
    for (const item of order.items) {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        const prev = prod.stock;
        prod.stock = Math.max(0, prod.stock - item.quantity);
        db.auditLogs.unshift({
          id: `log-ord-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          productId: prod.id,
          productName: prod.name,
          previousStock: prev,
          quantityChange: -item.quantity,
          newStock: prod.stock,
          reason: `Venda do Pedido ${order.code}`,
          authorName: order.userName || 'Checkout Online',
          createdAt: new Date().toISOString(),
        });
      }
    }

    saveDb();
    return order;
  },

  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => {
    const order = db.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (notes) {
      order.notes = order.notes ? `${order.notes} | ${notes}` : notes;
    }

    if (status === 'PAGO' && order.payment.status !== 'APROVADO') {
      order.payment.status = 'APROVADO';
      order.payment.paidAt = new Date().toISOString();
    }

    saveDb();
    return order;
  },

  // Dashboard Analytics
  getDashboardMetrics: (): DashboardMetrics => {
    const orders = db.orders;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let totalRevenueMonth = 0;
    let totalRevenueToday = 0;
    let pendingOrdersCount = 0;
    let inProductionCount = 0;
    let completedOrdersCount = 0;

    const categoryMap = new Map<string, { label: string; amount: number; count: number }>();
    const paymentMap: Record<PaymentMethod, { amount: number; count: number }> = {
      PIX: { amount: 0, count: 0 },
      CREDIT_CARD: { amount: 0, count: 0 },
      BOLETO: { amount: 0, count: 0 },
    };

    for (const ord of orders) {
      if (ord.payment.status === 'APROVADO') {
        totalRevenueMonth += ord.total;
        if (ord.createdAt.startsWith(todayStr)) {
          totalRevenueToday += ord.total;
        }

        const method = ord.payment.method;
        if (paymentMap[method]) {
          paymentMap[method].amount += ord.total;
          paymentMap[method].count += 1;
        }

        for (const item of ord.items) {
          const cat = item.category;
          const current = categoryMap.get(cat) || { label: item.category, amount: 0, count: 0 };
          current.amount += item.totalPrice;
          current.count += item.quantity;
          categoryMap.set(cat, current);
        }
      }

      if (ord.status === 'AGUARDANDO_PAGAMENTO') pendingOrdersCount++;
      if (ord.status === 'EM_PRODUCAO') inProductionCount++;
      if (ord.status === 'ENTREGUE') completedOrdersCount++;
    }

    const lowStockProducts = db.products.filter(p => p.stock <= p.minStock);

    const salesByCategory = Array.from(categoryMap.entries()).map(([cat, val]) => ({
      category: cat,
      label: val.label,
      amount: Number(val.amount.toFixed(2)),
      count: val.count,
    }));

    const salesByPayment = Object.entries(paymentMap).map(([method, val]) => ({
      method: method as PaymentMethod,
      amount: Number(val.amount.toFixed(2)),
      count: val.count,
    }));

    return {
      totalRevenueMonth: Number(totalRevenueMonth.toFixed(2)),
      totalRevenueToday: Number(totalRevenueToday.toFixed(2)),
      pendingOrdersCount,
      inProductionCount,
      completedOrdersCount,
      lowStockCount: lowStockProducts.length,
      totalProductsCount: db.products.length,
      totalCustomersCount: db.users.filter(u => u.role === 'CLIENT').length,
      recentOrders: orders.slice(0, 8),
      lowStockProducts,
      salesByCategory,
      salesByPayment,
    };
  }
};
