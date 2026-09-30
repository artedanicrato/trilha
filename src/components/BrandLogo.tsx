import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  inverse?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'md' ? 36 : size === 'lg' ? 48 : 60;
  const titleSize = size === 'sm' ? 'text-sm sm:text-base' : size === 'md' ? 'text-lg sm:text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl';
  const subtitleSize = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-xs';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      
      {/* Official Trilha Sonora Logo Icon (Pick + Headphone + Musical Note + Lightning) */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md select-none"
        >
          {/* Orange Headphone Arc */}
          <path
            d="M 18 55 C 18 20, 82 20, 82 55"
            fill="none"
            stroke="#ff6600"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* White Outer Lightning Wings */}
          <path
            d="M 12 52 L 24 38 L 20 48 L 30 40 L 22 62 Z"
            fill="#ffffff"
          />
          <path
            d="M 88 52 L 76 38 L 80 48 L 70 40 L 78 62 Z"
            fill="#ffffff"
          />

          {/* Orange Accent Flashes */}
          <path
            d="M 8 55 L 18 44 L 15 52 L 23 46 L 16 64 Z"
            fill="#ff6600"
          />
          <path
            d="M 92 55 L 82 44 L 85 52 L 77 46 L 84 64 Z"
            fill="#ff6600"
          />

          {/* Central Shield / Guitar Pick Base (Royal Blue with White Contour) */}
          <path
            d="M 50 25 C 67 25, 75 42, 68 65 L 50 92 L 32 65 C 25 42, 33 25, 50 25 Z"
            fill="#004bbf"
            stroke="#ffffff"
            strokeWidth="4"
          />

          {/* Double Musical Note in Pure White */}
          <g fill="#ffffff">
            {/* Note Heads */}
            <ellipse cx="44" cy="62" rx="4.5" ry="3.5" transform="rotate(-15 44 62)" />
            <ellipse cx="57" cy="57" rx="4.5" ry="3.5" transform="rotate(-15 57 57)" />
            {/* Stems */}
            <rect x="47" y="44" width="3" height="18" rx="1.5" />
            <rect x="60" y="39" width="3" height="18" rx="1.5" />
            {/* Beam */}
            <polygon points="47,44 63,39 63,44 47,49" />
          </g>
        </svg>
      </div>

      {/* Typography: TRILHA (white) SONORA (orange pill) & GRÁFICA | INFORMÁTICA | BRINDES */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-heading font-black tracking-tight text-white ${titleSize}`}>
            TRILHA
          </span>
          <span className={`font-heading font-black tracking-tight text-white bg-[#ff6600] px-2 py-0.5 rounded-md shadow-sm ${titleSize}`}>
            SONORA
          </span>
        </div>

        {showSubtitle && (
          <div className={`flex items-center gap-1.5 font-bold tracking-wider text-white/95 mt-1 uppercase ${subtitleSize}`}>
            <span>GRÁFICA</span>
            <span className="text-[#ff6600]">|</span>
            <span>INFORMÁTICA</span>
            <span className="text-[#ff6600]">|</span>
            <span>BRINDES</span>
          </div>
        )}
      </div>

    </div>
  );
};
