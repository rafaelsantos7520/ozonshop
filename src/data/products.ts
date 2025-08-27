import { IProduct } from '@/types/product';


const categoryMap: { [key: number]: string } = {
  2: 'Perfumaria',
  3: 'Suplementos alimentares',
  4: 'Bem estar ozonizada',
  5: 'Capilar Ozonizada',
  7: 'Acessórios',
};



export const getProductById = (id: number): IProduct | undefined => {
    const product = await fetch('')
};

export const getFeaturedProducts = (): IProduct[] => {
};

export const getOtherProducts = (currentProductId: number): IProduct[] => {
};

export const getAllCategories = (): string[] => {

};

export const getProductsByCategory = (categoryName: string): IProduct[] => {
};

export const getBestSellers = (): Product[] => {
  // For demonstration, let's return products with a rating of 5 and active status
};