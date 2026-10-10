import { supabase } from "../supabase/supabase";
import { CartStat, CartItem, Product } from "@/types";
import { toast } from "sonner";

export class CartService {
  static async getCart(userId: string): Promise<CartStat> {
    try {
      const { data: cart, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (cartError) toast(cartError.message);

      if (!cart) {
        const { data: newCart, error: createError } = await supabase
          .from("cart")
          .insert({ user_id: userId })
          .select()
          .single();

        if (createError) {
          console.error("Error creating cart:", createError);
          throw createError;
        }

        const { data: items, error: itemsError } = await supabase
          .from("cart_items")
          .select(
            `
                    *,
                    products (*)
                `,
          )
          .eq("cart_id", newCart.id);

        if (itemsError) {
          toast("Error fetching cart items: " + itemsError.message);
        }

        const cartItems: CartItem[] = (items || []).map((item) => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.products
            ? ({
                id: item.products.id,
                name: item.products.name,
                description: item.products.description || "",
                price: item.products.price,
                discount: item.products.discount,
                stock: item.products.stock,
                image_url: item.products.image_url,
                created_at: item.products.created_at,
                categories: item.products.categories || null,
                brands: item.products.brands || null,
                variants: [],
              } as Product)
            : null,
        }));

        return {
          id: newCart.id,
          user_id: newCart.user_id,
          created_at: newCart.created_at,
          items: cartItems,
        };
      } else {
        // Get items for EXISTING cart
        const { data: items, error: itemsError } = await supabase
          .from("cart_items")
          .select(
            `
                    *,
                    products (*)
                `,
          )
          .eq("cart_id", cart.id);

        if (itemsError) {
          toast("Error fetching cart items: " + itemsError.message);
        }

        // Transform data
        const cartItems: CartItem[] = (items || []).map((item) => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.products
            ? ({
                id: item.products.id,
                name: item.products.name,
                description: item.products.description || "",
                price: item.products.price,
                discount: item.products.discount,
                stock: item.products.stock,
                image_url: item.products.image_url,
                created_at: item.products.created_at,
                categories: item.products.categories || null,
                brands: item.products.brands || null,
                variants: [],
              } as Product)
            : null,
        }));

        return {
          id: cart.id,
          user_id: cart.user_id,
          created_at: cart.created_at,
          items: cartItems,
        };
      }
    } catch (error) {
      toast("Error getting cart: " + error);
      throw error;
    }
  }

  static async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
  ): Promise<CartStat> {
    try {
      const cart = await this.getCart(userId);
      console.log("cart " + cart);

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError || !product) {
        throw new Error("Product not found");
      }

      const isAvailable = await this.checkStock(productId, quantity);
      if (!isAvailable) {
        throw new Error("Insufficient stock");
      }

      const existingItem = cart.items.find(
        (item) => item.product_id === productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        const { error: updateError } = await supabase
          .from("cart_items")
          .update({
            quantity: newQuantity,
          })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({
            cart_id: cart.id,
            product_id: productId,
            quantity,
          });

        if (insertError) throw insertError;
      }

      return await this.getCart(userId);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  static async updateCartItem(itemId: string, quantity: number): Promise<void> {
    try {
      if (quantity < 1) {
        return this.removeFromCart(itemId);
      }

      const { data: item, error: itemError } = await supabase
        .from("cart_items")
        .select("product_id")
        .eq("id", itemId)
        .single();
      console.log(item);
      if (itemError) throw itemError;

      const isAvailable = await this.checkStock(item.product_id, quantity);
      console.log(isAvailable);
      if (!isAvailable) {
        throw new Error("Insufficient stock");
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity,
        })
        .eq("id", itemId);
      console.log(updateError);
      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  static async removeFromCart(itemId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  static async clearCart(userId: string): Promise<void> {
    try {
      const cart = await this.getCart(userId);

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  static async getCartCount(userId: string): Promise<number> {
    try {
      const cart = await this.getCart(userId);
      return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }
  }

  static async calculateCartTotal(userId: string): Promise<number> {
    try {
      const cart = await this.getCart(userId);
      let total = 0;

      for (const item of cart.items) {
        if (item.product) {
          const discount = item.product.discount || 0;
          const price =
            discount > 0
              ? item.product.price * (1 - discount / 100)
              : item.product.price;

          total += price * item.quantity;
        }
      }

      return total;
    } catch (error) {
      console.error("Error calculating cart total:", error);
      return 0;
    }
  }

  static async mergeCarts(
    userId: string,
    guestItems: CartItem[],
  ): Promise<CartStat> {
    try {
      const userCart = await this.getCart(userId);

      for (const guestItem of guestItems) {
        // Check if item exists in user cart
        const existingItem = userCart.items.find(
          (item) => item.product_id === guestItem.product_id,
        );

        if (existingItem) {
          // Update quantity
          await this.updateCartItem(
            existingItem.id,
            existingItem.quantity + guestItem.quantity,
          );
        } else {
          // Add new item
          await this.addToCart(
            userId,
            guestItem.product_id,
            guestItem.quantity,
          );
        }
      }

      return await this.getCart(userId);
    } catch (error) {
      console.error("Error merging carts:", error);
      throw error;
    }
  }

  private static async checkStock(
    productId: string,
    quantity: number,
  ): Promise<boolean> {
    try {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single();

      if (productError) return false;
      return (product.stock || 0) >= quantity;
    } catch (error) {
      console.error("Error checking stock:", error);
      return false;
    }
  }

  static async getCartItemsByProductIds(
    productIds: string[],
    userId: string,
  ): Promise<CartItem[]> {
    try {
      const cart = await this.getCart(userId);
      return cart.items.filter((item) => productIds.includes(item.product_id));
    } catch (error) {
      console.error("Error getting cart items by product IDs:", error);
      return [];
    }
  }

  static async validateCart(userId: string): Promise<{
    valid: boolean;
    errors: string[];
    unavailableItems: CartItem[];
  }> {
    try {
      const cart = await this.getCart(userId);
      const errors: string[] = [];
      const unavailableItems: CartItem[] = [];

      for (const item of cart.items) {
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("id, name, stock")
          .eq("id", item.product_id)
          .single();

        if (productError || !product) {
          errors.push(
            `${item.product?.name || "Product"} is no longer available`,
          );
          unavailableItems.push(item);
          continue;
        }

        const isAvailable = await this.checkStock(
          item.product_id,
          item.quantity,
        );

        if (!isAvailable) {
          const productName = item.product?.name || "Product";
          const availableStock = product.stock || 0;

          errors.push(
            `${productName} only has ${availableStock} units in stock`,
          );
          unavailableItems.push(item);
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        unavailableItems,
      };
    } catch (error) {
      console.error("Error validating cart:", error);
      return {
        valid: false,
        errors: ["Unable to validate cart"],
        unavailableItems: [],
      };
    }
  }

  static async updateCartItemFull(
    itemId: string,
    updates: Partial<{
      product_id: string;
      quantity: number;
    }>,
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({
          ...updates,
        })
        .eq("id", itemId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  static async getCartSummary(userId: string): Promise<{
    itemCount: number;
    totalPrice: number;
    items: Array<{
      id: string;
      product_name: string;
      quantity: number;
      price: number;
      image_url: string;
    }>;
  }> {
    try {
      const cart = await this.getCart(userId);
      const totalPrice = await this.calculateCartTotal(userId);

      const summaryItems = cart.items.map((item) => {
        const productName = item.product?.name || "Product";
        const discount = item.product?.discount || 0;
        const price =
          discount > 0
            ? item.product!.price * (1 - discount / 100)
            : item.product!.price;

        return {
          id: item.id,
          product_name: productName,
          quantity: item.quantity,
          price: price,
          image_url: item.product?.image_url || "",
        };
      });

      return {
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice,
        items: summaryItems,
      };
    } catch (error) {
      console.error("Error getting cart summary:", error);
      throw error;
    }
  }
}
