export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount: number;
  description?: string;
  specs?: string;
  brand?: string;
  stock: number;
  rating_avg: number;
  rating_count: number;
  category_id?: number;
  created_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  is_primary: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color?: string;
  storage?: string;
  size?: string;
  sku?: string;
  stock: number;
  price_override?: number;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id?: number;
  qty: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: number;
  user_id?: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  delivery_fee: number;
  address_json: string;
  payment_method: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  qty: number;
  price_at_purchase: number;
  product?: Product;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

export interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address_line: string;
  city: string;
  is_default: number;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  minRating?: number;
  inStock?: boolean;
  discountOnly?: boolean;
  condition?: 'new' | 'used';
}

export interface SortOption {
  value: string;
  label: string;
}
