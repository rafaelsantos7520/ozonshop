export interface CheckoutData {
  // Dados de contato
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Endereço de entrega
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Dados do pedido
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  shipping_option: string;
}

export interface CheckoutItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  order_id?: string;
  payment_url?: string;
  error?: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Tipos para a resposta do backend
export interface CartItemBackend {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
  product: {
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
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  min_order?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface CheckoutDataResponse {
  success: boolean;
  message: string;
  data: {
    cart_items: CartItemBackend[];
    total: string;
    item_count: number;
    shipping_options: ShippingOption[];
    payment_methods: PaymentMethod[];
  };
  timestamp: string;
  status_code: number;
}