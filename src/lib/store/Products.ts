// @/store/useProductStore.ts
import { create } from "zustand";
import { ProductService } from "@/lib/services/products";
import { Product } from "@/types";
import { toast } from "sonner";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  featuredProducts: Product[];
  isFeaturedLoading: boolean;
  featuredError: string | null;

  newArrivalProducts: Product[];
  isNewArrivalLoading: boolean;
  newArrivalError: string | null;

  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchNewArrivalProducts: () => Promise<void>;
  fetchAll: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  products: [],
  isLoading: false,
  error: null,

  featuredProducts: [],
  isFeaturedLoading: false,
  featuredError: null,

  newArrivalProducts: [],
  isNewArrivalLoading: false,
  newArrivalError: null,
};

export const useProductStore = create<ProductState>((set, get) => ({
  ...initialState,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await ProductService.getProducts();
      set({ products, isLoading: false });
    } catch (err) {
      const message = `Error fetching products: ${err}`;
      set({ error: message, isLoading: false });
      toast.error("Failed to load products");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isFeaturedLoading: true, featuredError: null });
    try {
      // لو عندك endpoint مخصوص للـ featured استخدمه هنا بدل ما تعتمد على products الكاملة
      const products = await ProductService.getProducts();
      set({
        featuredProducts: products.slice(0, 10),
        isFeaturedLoading: false,
      });
    } catch (err) {
      const message = `Error fetching featured products: ${err}`;
      set({ featuredError: message, isFeaturedLoading: false });
      toast.error("Failed to load featured products");
    }
  },

  fetchNewArrivalProducts: async () => {
    set({ isNewArrivalLoading: true, newArrivalError: null });
    try {
      const products = await ProductService.getProducts();
      set({
        newArrivalProducts: products.slice(10, 20),
        isNewArrivalLoading: false,
      });
    } catch (err) {
      const message = `Error fetching new arrival products: ${err}`;
      set({ newArrivalError: message, isNewArrivalLoading: false });
      toast.error("Failed to load new arrivals");
    }
  },

  // helper لو محتاج تجيب الـ 3 مع بعض دفعة واحدة (مثلاً في الـ landing page)
  fetchAll: async () => {
    const { fetchProducts, fetchFeaturedProducts, fetchNewArrivalProducts } =
      get();
    await Promise.all([
      fetchProducts(),
      fetchFeaturedProducts(),
      fetchNewArrivalProducts(),
    ]);
  },

  reset: () => set(initialState),
}));
