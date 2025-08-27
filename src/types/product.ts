
// Interface para usuário
export interface IUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// Interface para review
export interface IReview {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user: IUser;
}

// Interface para categoria
export interface ICategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  is_main: number;
  is_featured: number;
  sort_order: number;
  image: string | null;
  secondary_image: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

// Interface para produto da API
export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  old_price: string | null;
  stock: number;
  category_id: number;
  image: string;
  secondary_image: string | null;
  slug: string;
  is_active: boolean;
  is_featured: boolean;
  sku: string;
  weight: string;
  dimensions: string;
  color: string;
  material: string;
  menu_order: number;
  created_at: string;
  updated_at: string;
  category: ICategory;
  reviews?: IReview[];
}


