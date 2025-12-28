import axios from "axios";

export const api = axios.create({
    baseURL: "https://fakestoreapi.com",
});

export type Product = {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
    rating?: {
        rate: number;
        count: number;
    };
};

export type CartProduct = {
    productId: number;
    quantity: number;
};

export type Cart = {
    id: number;
    userId: number;
    date: string;
    products: CartProduct[];
};

export type User = {
    id: number;
    email: string;
    username: string;
    password?: string;
    name: {
        firstname: string;
        lastname: string;
    };
    address: {
        city: string;
        street: string;
        number: number;
        zipcode: string;
        geolocation?: {
            lat: string;
            long: string;
        };
    };
    phone: string;
};

export const loginRequest = (username: string, password: string) =>
    api.post<{ token: string }>("/auth/login", { username, password });

export const fetchProducts = () => api.get<Product[]>("/products");
export const fetchProductById = (id: number) => api.get<Product>(`/products/${id}`);
export const fetchCategories = () => api.get<string[]>("/products/categories");
export const fetchProductsByCategory = (name: string) =>
    api.get<Product[]>(`/products/category/${encodeURIComponent(name)}`);

export const fetchUser = (id: number) => api.get<User>(`/users/${id}`);
export const updateUser = (id: number, payload: Partial<User>) => api.put<User>(`/users/${id}`, payload);

export const fetchUserCarts = (userId: number) => api.get<Cart[]>(`/carts/user/${userId}`);
export const updateCart = (cartId: number, payload: Partial<Cart>) => api.put<Cart>(`/carts/${cartId}`, payload);
export const deleteCart = (cartId: number) => api.delete(`/carts/${cartId}`);
export const createCart = (payload: Pick<Cart, "userId" | "date" | "products">) => api.post<Cart>("/carts", payload);
