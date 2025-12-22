// User Types
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'customer' | 'admin';
    created_at: string;
    updated_at: string;
}
export type UserFormData = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export interface UserData {
    name: string;
    email: string;
    phone: string | null;
    role: 'customer' | 'admin';
    password?: string;
}
// export interface Address {
//     id: string;
//     user_id: string;
//     city: string;
//     street: string;
//     apartment: string;
//     phone?: string;
// }

// // Product Types
// export interface ProductVariant {
//     id: string;
//     product_id: string;
//     size: string | null;
//     color: string | null;
//     sku: string | null;
//     stock: number;
//     created_at: string;
//     updated_at: string;
// }
// export interface Category {
//     id: string;
//     name: string;
// }
//
// export interface Brand {
//     id?: string;
//     name: string;
// }

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    discount: string;
    stock: string;
    image_url: string;
    categories: Category[] | null;
    brands: brand | null;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount: number | null;
    stock: number | null;
    image_url: string;
    created_at: string;
    categories: Category[] | null;
    brands: brand | null;
}

export interface Category {
    id: string;
    name: string;
}
export interface brand {
    id: string;
    name: string;
}

export interface CartStat {
    id: string;
    user_id: string;
    created_at: string;
    items: CartItem[];// إضافة هذه الخاصية
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    product?: Product | null;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order Types
export interface Order {
    id: string;
    user_id: string;
    total_price: number;
    payment_method: string;
    status: OrderStatus;
    created_at: string;
    updated_at?: string;
    order_items?: OrderItem[];
    address: Address;
    payments: Payment;
}


export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
    products: Product;
}
export interface OrderStat {
    id: string;
    user_id: string;
    total_price: number;
    payment_method: string;
    status: OrderStatus;
    address_id?: string;
    address?: Address;
    notes?: string;
    tracking_number?: string;
    shipping_method?: string;
    payment_status?: string;
    order_items?: OrderItem[];
    user?: User;
    created_at: string;
    updated_at?: string;
}
export interface orderResponse {
    orders:OrderStat[] ;
    total: number|0;
    page: number;
    limit: number;
    totalPages: number;
}

//
//
// export interface OrderItemStat {
//     id: string;
//     order_id: string;
//     product_id: string;
//     variant_id?: string;
//     quantity: number;
//     price: number;
//     product?: Product;
//     variant?: ProductVariant;
// }

export interface Address {
    id: string;
    user_id: string;
    city: string;
    street: string;
    apartment: string;
    phone?: string;
}
// Payment Types
export interface Payment {
    id: string;
    order_id: string;
    status: string;
    transaction_id?: string;
    amount: number;
    created_at: string;
}


// Blog Types
export interface Blog {
    id: string;
    author_id: string;
    title: string;
    body: string | null;
    image_url: string;
    created_at: string;
    updated_at: string;
    users?: User;
    tags: string[];
}

export interface  BlogFormData {
    author_id: string;
    title: string;
    body: string | null;
    image_url: string;
    tags: string[];
}
export type userData ={
    created_at: string;
    email: string;
    id:string;
    name:string;
    orders:Order[];
    password:string;
    phone:string;
    role:string;
    updated_at:string;
}

