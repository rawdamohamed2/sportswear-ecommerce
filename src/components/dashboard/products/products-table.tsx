'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ShoppingBag, Percent, Package } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {brand, Category, Product} from '@/types/index';

interface ProductsTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDiscount = (discount: number | null) => {
        if (!discount || discount === 0) return 'No discount';
        return `${discount}%`;
    };

    const getStockStatus = (stock: number | null) => {
        if (!stock && stock !== 0) return 'Unknown';
        if (stock <= 0) return 'Out of Stock';
        if (stock <= 10) return 'Low Stock';
        return 'In Stock';
    };

    const getStockColor = (stock: number | null) => {
        if (!stock && stock !== 0) return 'bg-gray-100 text-gray-800';
        if (stock <= 0) return 'bg-red-100 text-red-800';
        if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatCategories = (categories: Category[] | null) => {
        if (!categories || categories.length === 0) return 'No categories';
        return categories.map(cat => cat.name).join(', ');
    };

    const formatBrands = (brands: brand[] | null) => {
        if (!brands || brands.length === 0) return 'No brands';
        return brands.map(brand => brand.name).join(', ');
    };

    return (
        <div className="rounded-md border">
            <Table >
                <TableHeader className={`sticky top-0 z-10`}>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 ">
                        <TableHead className="w-[250px]">Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Brands</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Package className="h-12 w-12 text-gray-300" />
                                    <p className="text-lg font-medium">No products found</p>
                                    <p className="text-sm">Add your first product to get started</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage
                                                src={product.image_url}
                                                alt={product.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-blue-50 text-blue-600">
                                                <ShoppingBag className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900">
                                                {truncateText(product.name, 30)}
                                            </p>
                                            <p className="text-sm text-gray-500 max-w-[200px] truncate">
                                                {truncateText(product.description, 50)}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-gray-900">
                                            {formatCurrency(product.price)}
                                        </div>
                                        {product.discount && product.discount > 0 && (
                                            <div className="text-sm text-gray-500 line-through">
                                                {formatCurrency(product.price * (1 + product.discount / 100))}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${product.discount && product.discount > 0
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }
                                        `}
                                    >
                                        <Percent className="h-3 w-3 mr-1" />
                                        {formatDiscount(product.discount)}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`${getStockColor(product.stock)} border-transparent`}
                                    >
                                        {getStockStatus(product.stock)}
                                        {product.stock !== null && product.stock > 0 && (
                                            <span className="ml-1">({product.stock})</span>
                                        )}
                                    </Badge>
                                </TableCell>

                                <TableCell className="max-w-[200px]">
                                    <div className="text-sm text-gray-600">
                                        {truncateText(formatCategories(product.categories), 30)}
                                    </div>
                                </TableCell>

                                <TableCell className="max-w-[70px]">
                                    <div className="text-sm text-gray-600">
                                        {product.brands?.name}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`bg-primary hover:bg-primary/80 hover:text-font`}
                                            onClick={() => onEdit(product)}
                                            title="Edit Product"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="bg-red-600 hover:bg-red-700 hover:text-font"
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                                    onDelete(product.id);
                                                }
                                            }}
                                            title="Delete Product"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}