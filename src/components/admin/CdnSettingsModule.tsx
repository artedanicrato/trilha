import React, { useState } from 'react';
import { 
  Cloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  ExternalLink, 
  Zap, 
  Copy, 
  Key, 
  Globe, 
  Settings, 
  UploadCloud,
  Check
} from 'lucide-react';
import { getOptimizedImageUrl } from '../../data/initialProducts';

export const CdnSettingsModule: React.FC = () => {
  const [provider, setProvider] = useState<'cloudinary' | 'imgix'>('cloudinary');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState<string>(() => {
    return localStorage.getItem('trilha_cdn_cloud_name') || 'trilhasonora-crato';
  });
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState<string>(() => {
    return localStorage.getItem('trilha_cdn_upload_preset') || 'trilha_products';
  });
  const [imgixDomain, setImgixDomain] = useState<string>(() => {
    return localStorage.getItem('trilha_cdn_imgix_domain') || 'trilhasonora.imgix.net';
  });

  const [testImageUrl, setTestImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('trilha_cdn_provider', provider);
      localStorage.setItem('trilha_cdn_cloud_name', cloudinaryCloudName);
      localStorage.setItem('trilha_cdn_upload_preset', cloudinaryUploadPreset);
      localStorage.setItem('trilha_cdn_imgix_domain', imgixDomain);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Ignore
    }
  };

  const getGeneratedCdnUrl = () => {
    if (provider === 'cloudinary') {
      return `https://res.cloudinary.com/${cloudinaryCloudName || 'sua-conta'}/image/upload/f_auto,q_auto,w_800/catalogo/caneca-personalizada.jpg`;
    } else {
      return `https://${imgixDomain || 'sua-conta.imgix.net'}/catalogo/caneca-personalizada.jpg?auto=format,compress&w=800&q=80`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-600/20 text-[#ff6600] border border-orange-500/30 flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Armazenamento Remoto de Imagens (Cloudinary / Imgix)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evita falhas de caminhos locais no Vercel carregando fotos de um CDN mundial de alta velocidade.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setProvider('cloudinary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              provider === 'cloudinary'
                ? 'bg-[#ff6600] text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Cloudinary (Recomendado)
          </button>
          <button
            onClick={() => setProvider('imgix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              provider === 'imgix'
                ? 'bg-[#004bbf] text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Imgix CDN
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Configurações de CDN salvas com sucesso no navegador!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#ff944d]" />
              {provider === 'cloudinary' ? 'Configuração Cloudinary' : 'Configuração Imgix'}
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              {provider === 'cloudinary' ? (
                <>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Cloud Name (Nome da sua nuvem no Cloudinary) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cloudinaryCloudName}
                      onChange={(e) => setCloudinaryCloudName(e.target.value)}
                      placeholder="Ex: trilhasonora-crato"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-[#ff6600]"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Encontre em seu Dashboard do Cloudinary (ex: <code>res.cloudinary.com/[SEU-CLOUD-NAME]</code>).
                    </span>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Upload Preset (Não assinado / Unsigned)
                    </label>
                    <input
                      type="text"
                      value={cloudinaryUploadPreset}
                      onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
                      placeholder="Ex: trilha_products"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-[#ff6600]"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Permite enviar imagens diretamente do navegador sem expor sua Secret Key.
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Domínio Imgix Source *
                  </label>
                  <input
                    type="text"
                    required
                    value={imgixDomain}
                    onChange={(e) => setImgixDomain(e.target.value)}
                    placeholder="Ex: trilhasonora.imgix.net"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-[#004bbf]"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Seu subdomínio configurado no painel da Imgix apontando para um bucket S3 ou servidor.
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Configuração</span>
                </button>
              </div>
            </form>
          </div>

          {/* Test and URL Generator */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Exemplo de URL Gerada para o Catálogo (100% Compatível com Vercel)
            </h4>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono text-emerald-400 overflow-x-auto">
              <span className="truncate">{getGeneratedCdnUrl()}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(getGeneratedCdnUrl())}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-bold shrink-0 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Transformações automáticas aplicadas: <code>f_auto</code> (formato WebP/AVIF conforme o navegador) e <code>q_auto</code> (compressão sem perda visual).
            </p>
          </div>
        </div>

        {/* Right Column: Step by step Guide */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            Passo a Passo para Publicar no Vercel sem Erros de Imagem
          </h3>

          <ol className="space-y-3 list-decimal list-inside text-slate-300 leading-relaxed">
            <li className="pl-1">
              <strong className="text-white">Crie sua conta gratuita no Cloudinary:</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 ml-5">
                Acesse <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-[#ff944d] underline">cloudinary.com</a> e crie uma conta gratuita (inclui 25GB de tráfego mensal).
              </p>
            </li>

            <li className="pl-1">
              <strong className="text-white">Faça upload das fotos da loja:</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 ml-5">
                No painel da Cloudinary em <em>Media Library</em>, crie a pasta <code>catalogo</code> e envie as fotos das canecas, camisas e eletrônicos.
              </p>
            </li>

            <li className="pl-1">
              <strong className="text-white">Copie o link HTTPS da imagem:</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 ml-5">
                Cole a URL no cadastro de produtos no Painel da Trilha Sonora.
              </p>
            </li>

            <li className="pl-1">
              <strong className="text-white">Por que o catálogo agora nunca falha no Vercel?</strong>
              <p className="text-[11px] text-slate-400 mt-0.5 ml-5">
                Implementamos o resolvedor CDN com fallback automático local. Mesmo que a API do backend esteja ausente na hospedagem estática do Vercel, todos os produtos e imagens carregam instantaneamente via CDN!
              </p>
            </li>
          </ol>

          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-200 text-[11px]">
            <p className="font-semibold text-white mb-0.5">Dica de Ouro da Trilha Sonora:</p>
            Sempre use URLs completas iniciadas com <code>https://...</code> em vez de caminhos relativos como <code>/images/foto.jpg</code>. Assim suas imagens funcionam no Vercel, Netlify, celular e redes sociais.
          </div>
        </div>

      </div>
    </div>
  );
};
