import type { Product } from '../types';

export interface CdnConfig {
  provider: 'unsplash' | 'cloudinary' | 'imgix';
  cloudinaryCloudName?: string;
  cloudinaryFolder?: string;
  imgixDomain?: string;
}

export const DEFAULT_CDN_CONFIG: CdnConfig = {
  provider: 'cloudinary',
  cloudinaryCloudName: 'trilhasonora-crato',
  cloudinaryFolder: 'catalogo-produtos',
  imgixDomain: 'trilhasonora.imgix.net',
};

/**
 * Resolves an image URL to an optimized remote CDN URL.
 * Automatically transforms Cloudinary, Imgix, or Unsplash images for maximum speed and fidelity on Vercel.
 */
export function getOptimizedImageUrl(url: string, width = 800, quality = 80): string {
  if (!url) return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

  // If already Cloudinary URL, add auto format & quality transformations
  if (url.includes('res.cloudinary.com')) {
    if (url.includes('/image/upload/') && !url.includes('/f_auto')) {
      return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
    }
    return url;
  }

  // If Imgix URL
  if (url.includes('imgix.net')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format,compress&w=${width}&q=${quality}`;
  }

  // If Unsplash CDN URL
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&auto=format&fit=crop&q=${quality}`;
  }

  return url;
}

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Camiseta Personalizada DTF
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

  // 2. Caneca de Porcelana Resinada
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

  // 3. Caneca Mágica Termossensível
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

  // 4. Banner Promocional em Lona
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

  // 5. Plotagem em Vinil e Recorte Eletrônico
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

  // 6. Adesivos Vinil com Recorte Kiss-Cut
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

  // 7. Cartões de Visita Couché 300g
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

  // 8. Fone de Ouvido Bluetooth Sem Fio TWS
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

  // 9. Caixa de Som Bluetooth 40W Portátil
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

  // 10. Carregador Turbo 30W GaN
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

  // 11. Cabo Reforçado em Malha Nylon
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

  // 12. Suporte Veicular Magnético
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
  },
];
