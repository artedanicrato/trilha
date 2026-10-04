import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Send, 
  CheckCircle2, 
  Building2, 
  Receipt, 
  FileSpreadsheet, 
  QrCode, 
  ExternalLink,
  Search,
  Filter,
  X,
  AlertTriangle
} from 'lucide-react';
import type { Order } from '../../types';

export interface NfseDocument {
  id: string;
  orderId?: string;
  orderCode?: string;
  number: string;
  rpsNumber: string;
  series: string;
  authCode: string;
  issueDate: string;
  clientName: string;
  clientCpfCnpj: string;
  clientEmail: string;
  clientCity: string;
  serviceDescription: string;
  serviceCode: string;
  totalServiceValue: number;
  issRate: number; // 2.0%
  issValue: number;
  netValue: number;
  status: 'EMITIDA' | 'CANCELADA' | 'PENDENTE';
}

const PREFECTURE_SEFIN_CONFIG = {
  city: 'Crato',
  state: 'CE',
  prefectureName: 'Prefeitura Municipal do Crato - Secretaria das Finanças (SEFIN)',
  system: 'Sistema Tributário de NFS-e Padrão ABRASF 2.04',
  companyName: 'TRILHA SONORA GRAFICA & ELETRONICOS LTDA',
  tradeName: 'Trilha Sonora Gráfica & Informática',
  cnpj: '08.123.456/0001-78',
  municipalRegistration: '048912-3',
  address: 'Rua Dr. João Pessoa, 91 - Centro, Crato - CE, CEP: 63100-000',
  taxRegime: 'Simples Nacional (ME)',
  cnae: '1813-0/01 - Impressão de material para outros usos',
  defaultServiceCode: '13.05 - Serviços de reprografia, microfilmagem e digitalização',
  issRate: 2.0,
};

const INITIAL_NFSES: NfseDocument[] = [
  {
    id: 'nfse-1',
    orderId: 'ord-101',
    orderCode: 'TS-482910',
    number: '20260000000412',
    rpsNumber: 'RPS-0412',
    series: '1',
    authCode: '9B2C-7A4D-8F26-3001',
    issueDate: '04/10/2026 09:14:22',
    clientName: 'Maria Cecília Alencar',
    clientCpfCnpj: '038.991.243-10',
    clientEmail: 'cliente@cariri.com.br',
    clientCity: 'Crato - CE',
    serviceDescription: 'Confecção gráfica personalizada: 4 Canecas de Porcelana Resinadas com impressão fotográfica de alta definição para evento de formatura.',
    serviceCode: '13.05',
    totalServiceValue: 144.40,
    issRate: 2.0,
    issValue: 2.89,
    netValue: 144.40,
    status: 'EMITIDA',
  },
  {
    id: 'nfse-2',
    orderId: 'ord-102',
    orderCode: 'TS-391824',
    number: '20260000000411',
    rpsNumber: 'RPS-0411',
    series: '1',
    authCode: '8E41-3F99-1A02-5578',
    issueDate: '03/10/2026 15:40:08',
    clientName: 'Colégio Diocesano do Crato',
    clientCpfCnpj: '07.391.824/0001-55',
    clientEmail: 'eventos@diocesano.com.br',
    clientCity: 'Crato - CE',
    serviceDescription: 'Serviço de estamparia digital DTF e silk em 20 Camisetas de Algodão Penteado 30.1 com logotipo dos Jogos Estudantis do Cariri.',
    serviceCode: '13.05',
    totalServiceValue: 955.10,
    issRate: 2.0,
    issValue: 19.10,
    netValue: 955.10,
    status: 'EMITIDA',
  },
  {
    id: 'nfse-3',
    number: '20260000000410',
    rpsNumber: 'RPS-0410',
    series: '1',
    authCode: '5C11-0982-BA73-4419',
    issueDate: '02/10/2026 11:22:45',
    clientName: 'Advocacia Cariri & Associados',
    clientCpfCnpj: '12.448.910/0001-32',
    clientEmail: 'financeiro@caririadv.com.br',
    clientCity: 'Crato - CE',
    serviceDescription: 'Impressão executiva em Couché 300g com laminação fosca e verniz localizado UV (1.000 cartões) + Banner em Lona 440g.',
    serviceCode: '13.05',
    totalServiceValue: 243.90,
    issRate: 2.0,
    issValue: 4.88,
    netValue: 243.90,
    status: 'EMITIDA',
  },
];

interface FiscalModuleProps {
  orders?: Order[];
}

export const FiscalModule: React.FC<FiscalModuleProps> = ({ orders = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ISSUED' | 'EMIT_NEW' | 'ACCOUNTING_REPORT'>('ISSUED');
  const [nfseList, setNfseList] = useState<NfseDocument[]>(() => {
    try {
      const saved = localStorage.getItem('trilha_fiscal_nfses');
      return saved ? JSON.parse(saved) : INITIAL_NFSES;
    } catch {
      return INITIAL_NFSES;
    }
  });

  const [selectedNfseForView, setSelectedNfseForView] = useState<NfseDocument | null>(null);
  const [notification, setNotification] = useState<string>('');

  // Form for New NFS-e
  const [newNfse, setNewNfse] = useState({
    clientName: '',
    clientCpfCnpj: '',
    clientEmail: '',
    clientCity: 'Crato - CE',
    serviceDescription: 'Serviços gráficos personalizados e confecção de brindes promocionais.',
    totalServiceValue: 120.00,
  });

  const saveNfses = (list: NfseDocument[]) => {
    setNfseList(list);
    try {
      localStorage.setItem('trilha_fiscal_nfses', JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  const handleEmitFromOrder = (order: Order) => {
    const nextNumber = (20260000000413 + nfseList.length).toString();
    const authCode = `${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}-CRATO`;
    
    const itemsDescription = order.items.map((it) => `${it.quantity}x ${it.productName}`).join('; ');

    const document: NfseDocument = {
      id: 'nfse-' + Date.now(),
      orderId: order.id,
      orderCode: order.code,
      number: nextNumber,
      rpsNumber: `RPS-0${nfseList.length + 413}`,
      series: '1',
      authCode,
      issueDate: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      clientName: order.userName || 'Cliente Trilha Sonora',
      clientCpfCnpj: '088.192.345-09',
      clientEmail: order.userEmail || 'cliente@trilhasonora.com.br',
      clientCity: `${order.delivery?.city || 'Crato'} - ${order.delivery?.state || 'CE'}`,
      serviceDescription: `Prestação de serviços gráficos e estamparia personalizada para o pedido ${order.code}: ${itemsDescription}`,
      serviceCode: '13.05',
      totalServiceValue: order.total,
      issRate: 2.0,
      issValue: order.total * 0.02,
      netValue: order.total,
      status: 'EMITIDA',
    };

    const updated = [document, ...nfseList];
    saveNfses(updated);
    setSelectedNfseForView(document);
    setNotification(`NFS-e Nº ${nextNumber} emitida com sucesso e transmitida à SEFIN Crato!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleCreateManualNfse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNfse.clientName || !newNfse.clientCpfCnpj || !newNfse.totalServiceValue) {
      alert('Preencha os campos obrigatórios do tomador do serviço.');
      return;
    }

    const nextNumber = (20260000000413 + nfseList.length).toString();
    const authCode = `${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}-CRATO`;

    const val = Number(newNfse.totalServiceValue);
    const document: NfseDocument = {
      id: 'nfse-' + Date.now(),
      number: nextNumber,
      rpsNumber: `RPS-0${nfseList.length + 413}`,
      series: '1',
      authCode,
      issueDate: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      clientName: newNfse.clientName,
      clientCpfCnpj: newNfse.clientCpfCnpj,
      clientEmail: newNfse.clientEmail || 'financeiro@cliente.com.br',
      clientCity: newNfse.clientCity,
      serviceDescription: newNfse.serviceDescription,
      serviceCode: '13.05',
      totalServiceValue: val,
      issRate: 2.0,
      issValue: val * 0.02,
      netValue: val,
      status: 'EMITIDA',
    };

    const updated = [document, ...nfseList];
    saveNfses(updated);
    setSelectedNfseForView(document);
    setActiveSubTab('ISSUED');
    setNotification(`NFS-e Nº ${nextNumber} emitida com sucesso!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDownloadXml = (doc: NfseDocument) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd">
  <Nfse versao="2.04">
    <InfNfse Id="NFSE${doc.number}">
      <Numero>${doc.number}</Numero>
      <CodigoVerificacao>${doc.authCode}</CodigoVerificacao>
      <DataEmissao>${new Date().toISOString()}</DataEmissao>
      <IdentificacaoRps>
        <Numero>${doc.rpsNumber.replace(/\D/g, '')}</Numero>
        <Serie>${doc.series}</Serie>
        <Tipo>1</Tipo>
      </IdentificacaoRps>
      <Prefeitura>
        <Municipio>Crato</Municipio>
        <Uf>CE</Uf>
        <CodigoMunicipio>2304202</CodigoMunicipio>
      </Prefeitura>
      <PrestadorServico>
        <IdentificacaoPrestador>
          <CpfCnpj><Cnpj>${PREFECTURE_SEFIN_CONFIG.cnpj.replace(/\D/g, '')}</Cnpj></CpfCnpj>
          <InscricaoMunicipal>${PREFECTURE_SEFIN_CONFIG.municipalRegistration}</InscricaoMunicipal>
        </IdentificacaoPrestador>
        <RazaoSocial>${PREFECTURE_SEFIN_CONFIG.companyName}</RazaoSocial>
        <NomeFantasia>${PREFECTURE_SEFIN_CONFIG.tradeName}</NomeFantasia>
        <Endereco>${PREFECTURE_SEFIN_CONFIG.address}</Endereco>
      </PrestadorServico>
      <TomadorServico>
        <IdentificacaoTomador>
          <CpfCnpj>${doc.clientCpfCnpj.replace(/\D/g, '')}</CpfCnpj>
        </IdentificacaoTomador>
        <RazaoSocial>${doc.clientName}</RazaoSocial>
        <Endereco><Municipio>${doc.clientCity}</Municipio></Endereco>
        <Contato><Email>${doc.clientEmail}</Email></Contato>
      </TomadorServico>
      <Servico>
        <Valores>
          <ValorServicos>${doc.totalServiceValue.toFixed(2)}</ValorServicos>
          <Aliquota>${doc.issRate.toFixed(2)}</Aliquota>
          <ValorIss>${doc.issValue.toFixed(2)}</ValorIss>
          <ValorLiquidoNfse>${doc.netValue.toFixed(2)}</ValorLiquidoNfse>
        </Valores>
        <ItemListaServico>${doc.serviceCode}</ItemListaServico>
        <Discriminacao>${doc.serviceDescription}</Discriminacao>
      </Servico>
    </InfNfse>
  </Nfse>
</CompNfse>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NFSE-${doc.number}-CRATO-CE.xml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAccountingBook = () => {
    const totalServicos = nfseList.reduce((acc, n) => acc + n.totalServiceValue, 0);
    const totalIss = nfseList.reduce((acc, n) => acc + n.issValue, 0);

    const report = [
      'PREFEITURA MUNICIPAL DE CRATO - CEARA',
      'SECRETARIA DE FINANCAS (SEFIN) - LIVRO ELETRONICO DE SERVICOS PRESTADOS',
      'CONTRIBUINTE: ' + PREFECTURE_SEFIN_CONFIG.companyName,
      'CNPJ: ' + PREFECTURE_SEFIN_CONFIG.cnpj + ' | INSCRICAO MUNICIPAL: ' + PREFECTURE_SEFIN_CONFIG.municipalRegistration,
      'ENDERECO: ' + PREFECTURE_SEFIN_CONFIG.address,
      'PERIODO DE APURACAO: ' + new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase(),
      '----------------------------------------------------------------------------------------------------------',
      'NUMERO NFS-E | DATA EMISSAO | CODIGO VERIFICACAO | TOMADOR | CNPJ/CPF | VALOR (R$) | ALIQUOTA | ISSQN (R$)',
      '----------------------------------------------------------------------------------------------------------',
      ...nfseList.map((n) => 
        `${n.number} | ${n.issueDate} | ${n.authCode} | ${n.clientName} | ${n.clientCpfCnpj} | R$ ${n.totalServiceValue.toFixed(2)} | 2.00% | R$ ${n.issValue.toFixed(2)}`
      ),
      '----------------------------------------------------------------------------------------------------------',
      `TOTAL DOS SERVICOS TRIBUTADOS: R$ ${totalServicos.toFixed(2)}`,
      `TOTAL DO ISSQN DEVIDO AO MUNICIPIO DE CRATO: R$ ${totalIss.toFixed(2)}`,
      'REGIME DE TRIBUTACAO: Simples Nacional - ISS recolhido via DAS Municipal',
      `DOCUMENTO GERADO EM: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `livro-fiscal-contabilidade-crato-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Municipal Identification */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">NFS-e Prefeitura de Crato - CE</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                SEFIN ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secretaria das Finanças do Crato · ISSQN 2% · Padrão ABRASF WebISS · CNPJ: {PREFECTURE_SEFIN_CONFIG.cnpj}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('ISSUED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'ISSUED'
                ? 'bg-[#004bbf] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Notas Emitidas ({nfseList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('EMIT_NEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'EMIT_NEW'
                ? 'bg-[#004bbf] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Emitir Nova NFS-e
          </button>
          <button
            onClick={() => setActiveSubTab('ACCOUNTING_REPORT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'ACCOUNTING_REPORT'
                ? 'bg-[#004bbf] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Relatório Contábil
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* SUBTAB 1: ISSUED NFS-E */}
      {activeSubTab === 'ISSUED' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#ff944d]" />
              Relação de Notas Fiscais de Serviços Emitidas
            </h3>
            <span className="text-xs text-slate-400">
              Chaves homologadas e assinadas digitalmente pela Prefeitura de Crato
            </span>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nº da Nota</th>
                    <th className="py-3 px-3">Data/Hora</th>
                    <th className="py-3 px-4">Tomador (Cliente)</th>
                    <th className="py-3 px-3">Código Verificação SEFIN</th>
                    <th className="py-3 px-3">Valor Total</th>
                    <th className="py-3 px-3">ISSQN (2%)</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {nfseList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {doc.number}
                        {doc.orderCode && (
                          <span className="block text-[10px] text-[#ff944d] font-normal">Ped: {doc.orderCode}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{doc.issueDate}</td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {doc.clientName}
                        <span className="block text-[10px] text-slate-400 font-normal">{doc.clientCpfCnpj}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 text-[11px] font-bold">
                        {doc.authCode}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        R$ {doc.totalServiceValue.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-400">
                        R$ {doc.issValue.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedNfseForView(doc)}
                            className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 font-semibold flex items-center gap-1 text-[11px]"
                            title="Visualizar e Imprimir DANFSE Crato"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>DANFSE</span>
                          </button>
                          <button
                            onClick={() => handleDownloadXml(doc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 text-[11px]"
                            title="Baixar Arquivo XML ABRASF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>XML</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Emit from pending Store Orders */}
          {orders && orders.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#ff944d]" />
                Pedidos Recentes da Loja Prontos para Emissão de Nota Fiscal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {orders.slice(0, 3).map((ord) => {
                  const alreadyIssued = nfseList.some((n) => n.orderCode === ord.code);
                  return (
                    <div key={ord.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white block">{ord.code}</strong>
                        <span className="text-slate-400 text-[11px]">{ord.userName}</span>
                        <span className="block font-mono text-emerald-400 font-bold">R$ {ord.total.toFixed(2)}</span>
                      </div>
                      {alreadyIssued ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                          NFS-e Emitida
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEmitFromOrder(ord)}
                          className="px-2.5 py-1.5 rounded bg-[#ff6600] hover:bg-[#ea580c] text-white text-[11px] font-bold shadow-xs transition-colors"
                        >
                          Emitir NFS-e
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: EMIT NEW MANUAL NFS-E */}
      {activeSubTab === 'EMIT_NEW' && (
        <div className="max-w-2xl mx-auto rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ff6600]" />
              Emissor de Nota Fiscal de Serviços (SEFIN Crato - CE)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gera documento oficial transmitido automaticamente aos servidores da Prefeitura Municipal de Crato.
            </p>
          </div>

          <form onSubmit={handleCreateManualNfse} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome / Razão Social do Tomador *</label>
                <input
                  type="text"
                  required
                  value={newNfse.clientName}
                  onChange={(e) => setNewNfse({ ...newNfse, clientName: e.target.value })}
                  placeholder="Nome do cliente ou empresa"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">CPF ou CNPJ *</label>
                <input
                  type="text"
                  required
                  value={newNfse.clientCpfCnpj}
                  onChange={(e) => setNewNfse({ ...newNfse, clientCpfCnpj: e.target.value })}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">E-mail para Envio</label>
                <input
                  type="email"
                  value={newNfse.clientEmail}
                  onChange={(e) => setNewNfse({ ...newNfse, clientEmail: e.target.value })}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Município do Tomador</label>
                <input
                  type="text"
                  value={newNfse.clientCity}
                  onChange={(e) => setNewNfse({ ...newNfse, clientCity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Discriminação dos Serviços Prestados *</label>
              <textarea
                rows={3}
                required
                value={newNfse.serviceDescription}
                onChange={(e) => setNewNfse({ ...newNfse, serviceDescription: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Valor dos Serviços (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newNfse.totalServiceValue}
                  onChange={(e) => setNewNfse({ ...newNfse, totalServiceValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-[#ff6600]"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Alíquota ISSQN Crato</label>
                <input
                  type="text"
                  disabled
                  value="2,00% (Crato - CE)"
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">ISSQN Apurado</label>
                <input
                  type="text"
                  disabled
                  value={`R$ ${(Number(newNfse.totalServiceValue) * 0.02).toFixed(2)}`}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmitir & Emitir NFS-e Crato</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 3: ACCOUNTING REPORTS FOR EXTERNAL ACCOUNTANT */}
      {activeSubTab === 'ACCOUNTING_REPORT' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Fechamento Fiscal & Contábil Mensal (Para Envio ao Escritório de Contabilidade)
              </h3>
              <p className="text-xs text-slate-400">
                Resumo de serviços faturados, base tributária e recolhimento de tributos do município de Crato.
              </p>
            </div>

            <button
              onClick={handleExportAccountingBook}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Livro Fiscal (.TXT / .CSV)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Faturamento Total em Serviços</span>
              <p className="text-xl font-bold font-mono text-white">
                R$ {nfseList.reduce((acc, n) => acc + n.totalServiceValue, 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-400">100% acobertado com NFS-e</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">ISSQN Devido ao Município (Crato)</span>
              <p className="text-xl font-bold font-mono text-amber-400">
                R$ {nfseList.reduce((acc, n) => acc + n.issValue, 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-400">Alíquota efetiva: 2.0%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Regime Tributário</span>
              <p className="text-base font-bold text-blue-400">Simples Nacional (ME)</p>
              <span className="text-[10px] text-slate-400">Anexo III (Serviços)</span>
            </div>
          </div>
        </div>
      )}

      {/* DANFSE OFFICIAL PRINT & VIEW MODAL */}
      {selectedNfseForView && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
          <div className="relative w-full max-w-3xl rounded-xl bg-white text-slate-900 shadow-2xl p-6 sm:p-8 space-y-4 print:shadow-none print:p-0 print:w-full">
            
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Documento Oficial Autorizado pela SEFIN Crato
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#004bbf] hover:bg-[#003891] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir DANFSE</span>
                </button>
                <button
                  onClick={() => handleDownloadXml(selectedNfseForView)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar XML</span>
                </button>
                <button
                  onClick={() => setSelectedNfseForView(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PREFECTURE OFFICIAL DANFSE LAYOUT */}
            <div className="border-2 border-slate-900 p-5 space-y-4 text-xs font-sans">
              
              {/* Header with Crato coat of arms & title */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-[#004bbf] text-lg">
                    CE
                  </div>
                  <div>
                    <h2 className="font-bold text-xs uppercase tracking-tight text-slate-900">
                      PREFEITURA MUNICIPAL DO CRATO - ESTADO DO CEARÁ
                    </h2>
                    <h3 className="text-[11px] text-slate-700 font-semibold">
                      SECRETARIA DAS FINANÇAS - SEFIN
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      DOCUMENTO AUXILIAR DA NOTA FISCAL DE SERVIÇOS ELETRÔNICA (DANFSE)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Número da NFS-e</p>
                  <p className="text-lg font-black font-mono text-slate-900">{selectedNfseForView.number}</p>
                  <p className="text-[10px] text-slate-600">Emissão: {selectedNfseForView.issueDate}</p>
                </div>
              </div>

              {/* Prestador de Serviços (Trilha Sonora) */}
              <div className="p-2.5 bg-slate-50 border border-slate-300 space-y-1 text-[11px]">
                <strong className="block text-slate-900 text-xs uppercase">PRESTADOR DE SERVIÇOS</strong>
                <p className="font-bold text-slate-900">{PREFECTURE_SEFIN_CONFIG.companyName} ({PREFECTURE_SEFIN_CONFIG.tradeName})</p>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p>CNPJ: <strong>{PREFECTURE_SEFIN_CONFIG.cnpj}</strong></p>
                  <p>Inscrição Municipal: <strong>{PREFECTURE_SEFIN_CONFIG.municipalRegistration}</strong></p>
                  <p className="col-span-2">Endereço: {PREFECTURE_SEFIN_CONFIG.address}</p>
                </div>
              </div>

              {/* Tomador de Serviços (Cliente) */}
              <div className="p-2.5 bg-slate-50 border border-slate-300 space-y-1 text-[11px]">
                <strong className="block text-slate-900 text-xs uppercase">TOMADOR DOS SERVIÇOS</strong>
                <p className="font-bold text-slate-900">{selectedNfseForView.clientName}</p>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p>CPF/CNPJ: <strong>{selectedNfseForView.clientCpfCnpj}</strong></p>
                  <p>Município: <strong>{selectedNfseForView.clientCity}</strong></p>
                  <p className="col-span-2">E-mail: {selectedNfseForView.clientEmail}</p>
                </div>
              </div>

              {/* Discriminação dos Serviços */}
              <div className="border border-slate-300 p-3 space-y-1">
                <strong className="block text-slate-900 text-[11px] uppercase">DISCRIMINAÇÃO DOS SERVIÇOS PRESTADOS</strong>
                <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedNfseForView.serviceDescription}
                </p>
                <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
                  Código de Tributação do Município: {PREFECTURE_SEFIN_CONFIG.defaultServiceCode}
                </p>
              </div>

              {/* Valores & Tributos */}
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 border border-slate-300 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Valor dos Serviços</span>
                  <strong className="font-mono text-slate-900">R$ {selectedNfseForView.totalServiceValue.toFixed(2)}</strong>
                </div>
                <div className="p-2 border border-slate-300 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Alíquota ISS</span>
                  <strong className="font-mono text-slate-900">{selectedNfseForView.issRate.toFixed(2)}%</strong>
                </div>
                <div className="p-2 border border-slate-300 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Valor do ISSQN</span>
                  <strong className="font-mono text-slate-900">R$ {selectedNfseForView.issValue.toFixed(2)}</strong>
                </div>
                <div className="p-2 border border-slate-900 bg-slate-900 text-white">
                  <span className="text-[10px] text-slate-300 block">Valor Líquido</span>
                  <strong className="font-mono text-emerald-300 text-xs">R$ {selectedNfseForView.netValue.toFixed(2)}</strong>
                </div>
              </div>

              {/* Rodapé de Autenticidade & QR Code */}
              <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between text-[10px] text-slate-600">
                <div className="space-y-0.5">
                  <p>Código de Verificação de Autenticidade SEFIN Crato: <strong className="font-mono text-slate-900">{selectedNfseForView.authCode}</strong></p>
                  <p>Consulte a veracidade em: <strong>http://nfse.crato.ce.gov.br/consultar</strong></p>
                  <p>Regime de Recolhimento: Simples Nacional (Crato - CE). ISS devido no município do prestador.</p>
                </div>
                <div className="w-14 h-14 bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
