import { supabase } from '../supabase/supabase';
import { Product, ProductFormData,Category,brand} from '@/types';
import {toast} from "sonner";
interface ProductCategoryJoin {
    categories: Category;
    // other fields if any
}
export class ProductService {

    // Get all products
    static async getProducts() {
        try {
            const { data: products, error } = await supabase
                .from('products')
                .select(`
                *,
                product_brands (
                    brands (
                        id,
                        name
                    )
                ),
                product_categories (
                    categories (
                        id,
                        name
                    )
                )
            `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Format the data
            const formattedProducts = products.map(product => ({
                ...product,
                brands: product.product_brands?.[0]?.brands || null,
                categories: product.product_categories?.map((pc:ProductCategoryJoin) => pc.categories) || []
            }));

            return formattedProducts;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    };


    // Get product by ID
    static async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_brands (
                    brands (
                        id,
                        name
                    )
                ),
                product_categories (
                    categories (
                        id,
                        name
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const formattedProducts = {
            ...data,
            brand: data.products_brands?.[0]?.brands || null,
            categories: data.product_categories?.map((pc:ProductCategoryJoin) => pc.categories) || []
        }
        return formattedProducts as Product;
    };


    // Create product (admin only)
    static async createProduct(product: ProductFormData) {
        try {
            const { data: createdProduct, error: productError } = await supabase
                .from('products')
                .insert([{
                    name: product.name,
                    description: product.description,
                    price: parseFloat(product.price) || 0,
                    discount: product.discount ? parseFloat(product.discount) : null,
                    stock: product.stock ? parseInt(product.stock) : null,
                    image_url: product.image_url
                }])
                .select()
                .single();

            if (productError) return productError;

            const relationsPromises = [];

            //  Check if categories is an array
            if (product.categories && Array.isArray(product.categories) && product.categories.length > 0) {
                relationsPromises.push(
                    supabase.from('product_categories').insert(
                        product.categories.map((cat: Category) => ({
                            product_id: createdProduct.id,
                            category_id: cat.id
                        }))
                    )
                );
            }

            //  Check if brands is an array AND has length property
            if (product.brands && Array.isArray(product.brands) && product.brands.length > 0) {
                relationsPromises.push(
                    supabase.from('product_brands').insert(
                        product.brands.map((brandItem: brand) => ({ // 🔧 Add type annotation
                            product_id: createdProduct.id,
                            brand_id: brandItem.id
                        }))
                    )
                );
            }

            // Execute all insertions
            if (relationsPromises.length > 0) {
                await Promise.all(relationsPromises);
            }

            return {
                success: true,
                message: 'Product created successfully',
                productId: createdProduct.id
            };

        } catch (error) {
            console.error('Create product error:', error);
            return {
                success: false,
                message: `Failed to create product: ${error}`
            };
        }
    };

    // Update product (admin only)
    static async updateProduct(id: string, product: ProductFormData) {
        try {
            console.log('Updating product:', id, product);

            // 1. Update basic product data
            const productToUpdate = {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price) || 0,
                discount: product.discount ? parseFloat(product.discount) : null,
                stock: product.stock ? parseInt(product.stock) : null,
                image_url: product.image_url,
            };

            const { data: updatedProduct, error: productError } = await supabase
                .from('products')
                .update(productToUpdate)
                .eq('id', id)
                .select()
                .single();

            if (productError) {
                return productError.message;
            }

            // Check if arrays exist and have length
            const categoryIds = product.categories && Array.isArray(product.categories)
                ? product.categories.map((cat: Category) => cat.id).filter(Boolean)
                : [];

            const brandIds = product.brands && Array.isArray(product.brands)
                ? product.brands.map((brandItem: brand) => brandItem.id).filter(Boolean) // 🔧 Add type
                : [];

            // 2. Update relations only if we have categories or brands
            if (categoryIds.length > 0 || brandIds.length > 0) {
                const relationsResult = await this.updateProductRelations(
                    id,
                    categoryIds,
                    brandIds
                );

                if (relationsResult?.success) {
                    toast('Product and relations updated successfully');

                } else {
                    toast(`Product updated but relations failed`);
                }
            }

            toast('Product updated successfully');

        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            } else {
                console.error('Unexpected error in updateProduct:', error);
                return 'Unexpected error occurred';
            }
        }
    };

    static async updateProductRelations(
        productId: string,
        categoryIds: string[],
        brandIds: string[]
    ) {
        try {
            const promises = [];

            // تحديث التصنيفات
            if (categoryIds) {
                // حذف التصنيفات القديمة
                await supabase
                    .from('product_categories')
                    .delete()
                    .eq('product_id', productId);

                // إضافة التصنيفات الجديدة
                if (categoryIds.length > 0) {
                    const categoryRelations = categoryIds.map(categoryId => ({
                        product_id: productId,
                        category_id: categoryId
                    }));

                    promises.push(
                        supabase.from('product_categories').insert(categoryRelations)
                    );
                }
            }

            // تحديث العلامات التجارية
            if (brandIds) {
                // حذف العلامات القديمة
                await supabase
                    .from('products_brands')
                    .delete()
                    .eq('product_id', productId);

                // إضافة العلامات الجديدة
                if (brandIds.length > 0) {
                    const brandRelations = brandIds.map(brandId => ({
                        product_id: productId,
                        brand_id: brandId
                    }));

                    promises.push(
                        supabase.from('products_brands').insert(brandRelations)
                    );
                }
            }

            // تنفيذ جميع العمليات
            if (promises.length > 0) {
                await Promise.all(promises);
            }

            return { success: true, message: 'Product relations updated successfully' };

        } catch (error) {
            if (error instanceof Error) {
                return { success: false, error: error.message };
            } else {
                console.error('Error updating product relations:', error);
            }

        }
    };

    // Delete product (admin only)
    static async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        return error?.message;
    };

    // Get product statistics
    static async getProductStats() {
        const { count: totalProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        const { count: outOfStock } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('stock', 0);

        const { data: topProducts } = await supabase
            .from('products')
            .select('*')
            .order('stock', { ascending: false })
            .limit(5);

        return {
            total: totalProducts || 0,
            outOfStock: outOfStock || 0,
            inStock: (totalProducts || 0) - (outOfStock || 0),
            topProducts: topProducts || []
        };
    };

    static async getAllCategories() {
        try {
            const { data: categories, error } = await supabase
                .from('categories')
                .select('*')

            if (error) return error.message;
            return categories;
        } catch (error) {
            return error;
        }
    };

    static async getAllBrands() {
        try {
            const { data: brands, error } = await supabase
                .from('brands')
                .select('*')

            if (error) return error.message;
            return brands;
        } catch (error) {
            return error;
        }
    };

    static async getFilteredProducts(selectedBrands: string[], selectedCategories: string[]) {

        try {
            let productIdsFromBrands: string[] = [];
            let productIdsFromCategories: string[] = [];

            // 1. احصل على product_ids من الماركات
            if (selectedBrands.length > 0) {
                const { data: brandsData } = await supabase
                    .from('brands')
                    .select('id')
                    .in('name', selectedBrands);

                if (brandsData && brandsData.length > 0) {
                    const brandIds = brandsData.map(brand => brand.id);

                    const { data: productBrandsData } = await supabase
                        .from('product_brands')
                        .select('product_id')
                        .in('brand_id', brandIds);

                    if (productBrandsData && productBrandsData.length > 0) {
                        productIdsFromBrands = productBrandsData.map(pb => pb.product_id);
                    }
                }
            }

            // 2. احصل على product_ids من الفئات
            if (selectedCategories.length > 0) {
                const { data: categoriesData } = await supabase
                    .from('categories')
                    .select('id')
                    .in('name', selectedCategories);

                if (categoriesData && categoriesData.length > 0) {
                    const categoryIds = categoriesData.map(category => category.id);

                    const { data: productCategoriesData } = await supabase
                        .from('product_categories')
                        .select('product_id')
                        .in('category_id', categoryIds);

                    if (productCategoriesData && productCategoriesData.length > 0) {
                        productIdsFromCategories = productCategoriesData.map(pc => pc.product_id);
                    }
                }
            }

            // 3. طبق الفلترة بناءً على المنطق المطلوب
            let finalProductIds: string[] = [];

            if (selectedBrands.length > 0 && selectedCategories.length > 0) {
                // منطق AND: المنتجات التي تحتوي على الماركات المحددة والفئات المحددة
                const intersection = productIdsFromBrands.filter(id =>
                    productIdsFromCategories.includes(id)
                );
                finalProductIds = intersection;
            } else if (selectedBrands.length > 0) {
                // فلترة بالماركات فقط
                finalProductIds = productIdsFromBrands;
            } else if (selectedCategories.length > 0) {
                // فلترة بالفئات فقط
                finalProductIds = productIdsFromCategories;
            }

            // 4. إذا لم توجد نتائج، أرجع مصفوفة فارغة
            if (finalProductIds.length === 0 &&
                (selectedBrands.length > 0 || selectedCategories.length > 0)) {
                return [];
            }

            // 5. قم باسترجاع المنتجات
            let query = supabase
                .from('products')
                .select(`
                *,
                product_brands (
                    brands (
                        id,
                        name
                    )
                ),
                product_categories (
                    categories (
                        id,
                        name
                    )
                )
            `)
                .order('created_at', { ascending: false });

            if (finalProductIds.length > 0) {
                query = query.in('id', finalProductIds);
            }

            const { data, error } = await query;
            if (error) throw error;

            return data.map((product) => ({
                ...product,
                brands: product.product_brands?.[0]?.brands || null,
                categories:
                    product.product_categories?.map((pc:ProductCategoryJoin) => pc.categories) || [],
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }
}