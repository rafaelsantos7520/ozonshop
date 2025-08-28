import { IProduct } from '@/types/product';

const categoryMap: { [key: number]: string } = {
  2: 'Perfumaria',
  3: 'Suplementos alimentares',
  4: 'Bem estar ozonizada',
  5: 'Capilar Ozonizada',
  7: 'Acessórios',
};

// Funções de exemplo - implementação será feita conforme necessário
export const getProductById = (id: number): IProduct | undefined => {
  // TODO: Implementar busca por ID
  return undefined;
};

export const getFeaturedProducts = (): IProduct[] => {
  // TODO: Implementar busca de produtos em destaque
  return [];
};

export const getOtherProducts = (currentProductId: number): IProduct[] => {
  // TODO: Implementar busca de outros produtos
  return [];
};

export const getAllCategories = (): string[] => {
  // TODO: Implementar busca de categorias
  return Object.values(categoryMap);
};

export const getProductsByCategory = (categoryName: string): IProduct[] => {
  // TODO: Implementar busca por categoria
  return [];
};

export const getBestSellers = (): IProduct[] => {
  // TODO: Implementar busca de mais vendidos
  return [];
};