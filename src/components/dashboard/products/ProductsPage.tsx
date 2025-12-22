'use client';

import { useState, useEffect } from 'react';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import { ProductDialog } from '@/components/dashboard/products/product-dialog';
import { Button } from '@/components/ui/button';
import { Plus} from 'lucide-react';
import { Product,ProductFormData} from '@/types';
import Loader from "@/components/Loader";
import {ProductService} from "@/lib/services/products";
import { Package, PackageCheck, PackageX} from 'lucide-react';
import {toast} from "sonner";



export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [relod, setrelod]=useState(false);
    const [error, setError]=useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        inStock:0,
        outOfStock:0,
        total:0
    });
    useEffect(() => {
        loadStats();
        getProducts();
    }, [relod]);

    const getProducts = async () => {
        setLoading(true);
        try {

            const [products] = await Promise.all([
                ProductService.getProducts()
            ]);
            setProducts(products);
        } catch (error) {
            toast(`Failed to load dashboard products: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (id: string | null, productData: ProductFormData) => {
        setLoading(true);
        try {
            console.log(productData);
            const [result] = await Promise.all([
                ProductService.createProduct(productData)
            ]);
            console.log(result);
            if(result.message){
                toast(result.message);
                setrelod(!relod);
                return;
            }
            setrelod(!relod);

        } catch (error) {
            console.error('Failed to load dashboard users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = async (id: string|null , ProductData: ProductFormData) => {
        if (!editingProduct) return;
        console.log(id  , ProductData);
        try {
            setLoading(true);

            const [result] = await Promise.all([
                ProductService.updateProduct(id?id:'',ProductData)
            ]);
            if(result){
                toast(result);
                setrelod(!relod);
                return;
            }
            setrelod(!relod);

        } catch (error) {
            setError(`Failed to load dashboard Products: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            setLoading(true);
            const [error] = await Promise.all([
                ProductService.deleteProduct(id)
            ]);
            if(error){
                setError(error);
                return;
            }
            toast('The product was deleted');
            setrelod(!relod);
        } catch (error) {
            setError(`Failed to Delete Product: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: Product) => {
        setEditingProduct(user);
        setIsDialogOpen(true);
    };

    const loadStats = async () => {
        try {
            setLoading(true);

            const [productsStats] = await Promise.all([
                ProductService.getProductStats(),
            ]);
            setStats({
                inStock:productsStats.inStock,
                outOfStock:productsStats.outOfStock,
                total:productsStats.total
            });
        } catch (error) {
            setError(`Failed to load dashboard stats: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    if(loading) return <Loader />;
    return (
        <section className="margin-up container mx-auto p-6">
            {error.length>0?<div className={`my-3 p-2 bg-red-200 text-darkgray`}>{error}</div>:''}
            {/* Header */}
            <div className="flex sm:flex-row gap-3 flex-col justify-between items-center mb-8 text-darkgray">
                <div>
                    <h1 className="text-3xl font-bold ">Products Management</h1>
                    <p className="text-gray-500 mt-2">Manage all Products in the system</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingProduct(null);
                        setIsDialogOpen(true);
                    }}
                    size="lg"
                >
                    <Plus className="me-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-font rounded-lg border p-6">
                    <div className="flex items-center justify-between text-darkgray">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between text-darkgray">
                        <div>
                            <p className="text-sm text-gray-500">Products inStock</p>
                            <p className="text-3xl font-bold mt-2">{stats.inStock}</p>
                        </div>
                        <PackageCheck  className="h-8 w-8 text-red-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between text-darkgray">
                        <div>
                            <p className="text-sm text-gray-500">Products outOfStock</p>
                            <p className="text-3xl font-bold mt-2">{stats.outOfStock}</p>
                        </div>
                        <PackageX  className="h-8 w-8 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
                <ProductsTable
                    products={products}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                />
            </div>

            {/* Dialog */}
            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                editingProduct={editingProduct}
                availableCategories={[]}
                availableBrands={[]}
            />
        </section>
    );
}