import { IProduct } from './product';

// Tipos para o componente ProductCard
export interface ProductCardProps {
  product: IProduct;
  className?: string;
  showCategory?: boolean;
  showDescription?: boolean;
}

// Tipos para o componente ProductGrid
export interface ProductGridProps {
  products: IProduct[];
  title?: string;
  className?: string;
  maxItems?: number;
}

// Tipos para o componente ProductHero
export interface ProductHeroProps {
  product: IProduct;
  onBuyNow?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

// Tipos para ações de produto
export interface ProductActions {
  onAddToCart?: (productId: number, quantity: number) => void;
  onBuyNow?: (productId: number) => void;
  onViewDetails?: (productId: number) => void;
  onToggleFavorite?: (productId: number) => void;
}

// Tipos para configurações de exibição
export interface DisplayConfig {
  showBadges?: boolean;
  showPriceComparison?: boolean;
  showDescription?: boolean;
  showBrand?: boolean;
  showCategory?: boolean;
  maxDescriptionLength?: number;
}

// Tipos para layout responsivo
export interface ResponsiveConfig {
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: string;
  padding?: string;
}