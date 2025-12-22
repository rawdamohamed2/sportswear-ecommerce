'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {brand, Category, Product} from '@/types';
import {ProductService} from "@/lib/services/products";
import {toast} from "sonner";
import Loader from "@/components/Loader";
interface productData {
    name: string;
    description: string;
    price: string;
    discount: string | '0';
    stock: string ;
    image_url: string;
    categories: Category[] | null;
    brands: brand[] | null;

}
interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (id: string | null, ProductData: productData) => void;
    editingProduct: Product | null;
    availableCategories: Category[];
    availableBrands: brand[];
}

export function ProductDialog({
                               open,
                               onOpenChange,
                               onSubmit,
                               editingProduct,
                           }: ProductDialogProps) {
    const [formData, setFormData] = useState<productData>({
        name: '',
        description: '',
        price: '',
        discount: '',
        stock: '',
        image_url: '',
        categories: [] ,
        brands:[] ,
    });

    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [availableCategories, setfilteredCategories] = useState<Category[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<brand[]>([]);
    const [availableBrands, setfilteredBrands] = useState<brand[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const [IsLoading, setIsLoading] = useState(false);
    const [categoryValue, setCategoryValue] = useState('');
    const [brandValue, setBrandValue] = useState('');
    useEffect(() => {
        getCategories();
        if (editingProduct) {
            const { id, created_at, categories, brands, ...productData } = editingProduct;
            const formattedData = {
                ...productData,
                price: productData.price.toString(),
                discount: productData.discount?.toString() ?? '0',
                stock: productData.stock?.toString() || '',
                categories: categories || [],
                brands: brands || [],
            };
            setFormData(formattedData);
            setSelectedCategories(categories || []);
            setSelectedBrands(brands || []);
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                discount: '',
                stock: '',
                image_url: '',
                categories: [],
                brands: [],
            });
            setSelectedCategories([]);
            setSelectedBrands([]);
            setNewCategoryName('');
            setNewBrandName('');

        }
    }, [editingProduct]);

    const handleCategorySelect = (categoryName: string) => {
        const category = availableCategories.find(c => c.name === categoryName);
        console.log(category);
        if (category && !selectedCategories.some(c => c.name === category.name)) {
            const updatedCategories = [...selectedCategories, category];
            setSelectedCategories(updatedCategories);
            setFormData(prev => ({ ...prev, categories: updatedCategories }));
        }
    };

    const handleBrandSelect = (brandName: string) => {
        const brand = availableBrands.find(b => b.name === brandName);
        console.log(brand);
        if (brand && !selectedBrands.some(b => b.name === brand.name)) {
            const updatedBrands = [...selectedBrands, brand];
            setSelectedBrands(updatedBrands);
            setFormData(prev => ({ ...prev, brands: updatedBrands }));
        }
    };

    const addNewCategory = () => {
        if (newCategoryName.trim() && !selectedCategories.some(c => c.name === newCategoryName.trim())) {
            const newCategory: Category = {
                id: `temp-${Date.now()}`,
                name: newCategoryName.trim()
            };
            const updatedCategories = [...selectedCategories, newCategory];
            setSelectedCategories(updatedCategories);
            setFormData(prev => ({ ...prev, categories: updatedCategories }));
            setNewCategoryName('');
        }
    };

    const addNewBrand = () => {
        if (newBrandName.trim() && !selectedBrands.some(b => b.name === newBrandName.trim())) {
            const newBrand: brand = {
                id: `temp-${Date.now()}`, // Temporary ID for new brand
                name: newBrandName.trim()
            };
            const updatedBrands = [...selectedBrands, newBrand];
            setSelectedBrands(updatedBrands);
            setFormData(prev => ({ ...prev, brands: updatedBrands }));
            setNewBrandName('');
        }
    };

    const removeCategoryByName = (categoryName: string) => {
        const updatedCategories = selectedCategories.filter(
            c => c.name !== categoryName
        );
        setSelectedCategories(updatedCategories);
        setFormData(prev => ({ ...prev, categories: updatedCategories }));
    };

    const removeBrandByName = (brandName: string) => {

        const updatedBrands = selectedBrands.filter(
            b => b.name !== brandName
        );
        setSelectedBrands(updatedBrands);
        setFormData(prev => ({ ...prev, brands: updatedBrands }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.image_url || !formData.price) {
            toast('Name, image and price are required');
            return;
        }

        // Validate price, discount, and stock are valid numbers
        if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
            toast('Price must be a valid positive number');
            return;
        }

        if (formData.discount && (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0)) {
            toast('Discount must be a valid positive number');
            return;
        }

        if (formData.stock && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
            toast('Stock must be a valid positive number');
            return;
        }

        const id = editingProduct?.id ?? null;
        onSubmit(id, formData);
        onOpenChange(false);
    };

    const getCategories  = async () => {
        setIsLoading(true);
        try {
            const result = await  ProductService.getAllCategories();
            const cetegory = result as Category[];
            setfilteredCategories(cetegory);
            const brands = await ProductService.getAllBrands();
            const brand = brands as brand[];
            setfilteredBrands(brand);
        }
        catch (error) {
            if (error instanceof Error) {
                toast(error.message);
            } else {
                toast('Something went wrong');
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    const filteredCategories = availableCategories.filter(
        category => !selectedCategories.some(c => c.id === category.id)
    );

    const filteredBrands = availableBrands.filter(
        brand => !selectedBrands.some(b => b.id === brand.id)
    );

    if (IsLoading)return <Loader/>;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-[450px] max-h-[500px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingProduct
                            ? 'Update Product information.'
                            : 'Add a new Product to the system.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Product name"
                            required
                            className="border-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Product Description *</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Product description"
                            required
                            className="border-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL *</Label>
                        <Input
                            id="image_url"
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                            required
                            className="border-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                placeholder="0.00"
                                required
                                className="border-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="discount">Discount (%)</Label>
                            <Input
                                id="discount"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={formData.discount?formData.discount:''}
                                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                                placeholder="0"
                                className="border-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                placeholder="0"
                                className="border-gray-400"
                            />
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="space-y-2">
                        <Label htmlFor="categories">Categories</Label>

                        {/* Input for adding new category */}
                        <div className="flex gap-2">
                            <Input
                                id="new-category"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter new category name"
                                className="flex-1 border-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addNewCategory();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addNewCategory}
                                disabled={!newCategoryName.trim()}
                            >
                                Add
                            </Button>
                        </div>

                        {/* Select from available categories */}
                        <Select
                            value={categoryValue}
                            onValueChange={(value) => {
                                handleCategorySelect(value);
                                setCategoryValue(''); // reset بعد الاختيار
                            }}
                        >
                            <SelectTrigger className="border-gray-400 mt-2">
                                <SelectValue placeholder="Or select from existing categories" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Display selected categories */}
                        {selectedCategories.map((category) => (
                            <Badge
                                key={category.id}
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1"
                            >
                                {category.name}
                                <Button className={`hover:bg-transparent bg-transparent cursor-pointer text-darkgray`} onClick={(e) => {
                                    e.stopPropagation();
                                    removeCategoryByName(category.name);  // Pass name instead of ID
                                }}>
                                    <X  />
                                </Button>
                            </Badge>
                        ))}
                    </div>

                    {/* Brands Section */}
                    <div className="space-y-2">
                        <Label htmlFor="brands">Brands</Label>

                        {/* Input for adding new brand */}
                        <div className="flex gap-2">
                            <Input
                                id="new-brand"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                placeholder="Enter new brand name"
                                className="flex-1 border-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addNewBrand();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addNewBrand}
                                disabled={!newBrandName.trim()}
                            >
                                Add
                            </Button>
                        </div>

                        {/* Select from available brands */}
                        <Select
                            value={brandValue}
                            onValueChange={(value) => {
                                handleBrandSelect(value);
                                setBrandValue('');
                            }}
                        >
                            <SelectTrigger className="border-gray-400 mt-2">
                                <SelectValue placeholder="Or select from existing brands" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredBrands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.name}>
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        {/* Display selected brands */}

                        {selectedBrands.map((brand) => (
                            <Badge
                                key={brand.id}
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1"
                            >
                                {brand.name}
                                <Button className={`hover:bg-transparent bg-transparent cursor-pointer text-darkgray`} onClick={(e) => {
                                    e.stopPropagation();
                                    removeBrandByName(brand.name);  // Pass name instead of ID
                                }}>
                                    <X  />
                                </Button>
                            </Badge>
                        ))}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className={`bg-primaryHover text-font hover:bg-primaryHover/80 hover:text-font`}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}