'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/CartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Lock, Shield, Truck, CheckCircle, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useStore } from "@/lib/store/store";
import { toast } from "sonner";
import {OrderService} from '@/lib/services/orders';
// Form data interface
interface CheckoutFormData {
    contact: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shipping: {
        fullName: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    payment: {
        method: 'credit_card' | 'paypal' | 'cash_on_delivery' | 'bank_transfer';
        cardNumber?: string;
        cardHolder?: string;
        expiryDate?: string;
        cvv?: string;
        paypalEmail?: string;
    };
    sameAsContact: boolean;
}

interface OrderItem {
    product_id: string;
    quantity: number;
    unit_price: number;
}

export default function CheckoutPage() {
    const cart = useCartStore((s) => s.cart);
    const guestCart = useCartStore((s) => s.guestCart);
    const clearCart = useCartStore((s) => s.clearCart);
    const clearGuestCart = useCartStore((s) => s.clearGuestCart);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState<string>('');
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [mounted, setMounted] = useState(false);
    const currentUser = useStore((s) => s.CurrentUser);
    const User = useStore((s) => s.user);
    const userId = currentUser?.id;
    // Safely get cart items with fallback
    const cartItems = mounted ? (
        userId
            ? (cart?.items || [])
            : (guestCart || [])
    ) : [];

    // Form state - initialize only on client
    const [formData, setFormData] = useState<CheckoutFormData>(() => ({
        contact: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        },
        shipping: {
            fullName: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'US',
            phone: ''
        },
        payment: {
            method: 'credit_card'
        },
        sameAsContact: true
    }));

    // Set mounted to true only on client
    useEffect(() => {
        setMounted(true);

        // Initialize form with user data after mount
        if (User?.email) {
            setFormData(prev => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    email: User.email || ''
                }
            }));
        }
    }, [User]);

    // Calculate cart total - only on client
    const calculateCartTotal = () => {
        if (!mounted || !cartItems.length) return 0;

        let total = 0;

        cartItems.forEach(item => {
            if (item.product) {
                const discount = item.product.discount || 0;
                const price = discount > 0
                    ? item.product.price * (1 - discount / 100)
                    : item.product.price;
                total += price * item.quantity;
            }
        });

        return Math.round(total * 100) / 100;
    };

    const subtotal = calculateCartTotal();
    const shipping = 9.99; // Fixed shipping for now
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    // Update shipping address when contact info changes
    useEffect(() => {
        if (mounted && formData.sameAsContact) {
            setFormData(prev => ({
                ...prev,
                shipping: {
                    ...prev.shipping,
                    fullName: `${prev.contact.firstName} ${prev.contact.lastName}`.trim(),
                    phone: prev.contact.phone
                }
            }));
        }
    }, [formData.contact, formData.sameAsContact, mounted]);

    // Validation functions
    const validateStep1 = () => {
        if (!mounted) return false;

        const { firstName, lastName, email, phone } = formData.contact;
        return firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            email.trim() !== '' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
            phone.trim() !== '';
    };

    const validateStep2 = () => {
        if (!mounted) return false;

        const { fullName, street, city, state, postalCode, country } = formData.shipping;
        return fullName.trim() !== '' &&
            street.trim() !== '' &&
            city.trim() !== '' &&
            state.trim() !== '' &&
            postalCode.trim() !== '' &&
            country.trim() !== '';
    };

    const validateStep3 = () => {
        if (!mounted) return false;

        const { method } = formData.payment;

        if (method === 'credit_card') {
            const { cardNumber, cardHolder, expiryDate, cvv } = formData.payment;
            return cardNumber?.trim() !== '' &&
                cardHolder?.trim() !== '' &&
                expiryDate?.trim() !== '' &&
                cvv?.trim() !== '';
        }

        if (method === 'paypal') {
            return formData.payment.paypalEmail?.trim() !== '';
        }

        return true; // cash_on_delivery and bank_transfer don't need validation
    };

    // Handle form input changes
    const handleInputChange = (section: keyof CheckoutFormData, field: string, value: any) => {
        console.log(value);
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };


    // Handle place order
    const handlePlaceOrder = async () => {
        if (!mounted) return;

        if (!validateStep1() || !validateStep2() || !validateStep3()) {
            toast.error('Please fill all required fields');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);
        try {
            // Prepare shipping address
            const shippingAddress = {
                fullName: formData.shipping.fullName,
                street: formData.shipping.street,
                city: formData.shipping.city,
                state: formData.shipping.state,
                postalCode: formData.shipping.postalCode,
                country: formData.shipping.country,
                phone: formData.shipping.phone || formData.contact.phone
            };

            // Format address string for database
            let addressString = `${shippingAddress.fullName}\n${shippingAddress.street}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}\n${shippingAddress.country}\nPhone: ${shippingAddress.phone}`;

            if (!userId) {
                // Add email for guest checkout
                addressString += `\nEmail: ${formData.contact.email}`;
            }

            // Prepare order items
            const orderItems: OrderItem[] = cartItems.map(item => {
                const productPrice = item.product?.price || 0;
                const discount = item.product?.discount || 0;
                const unitPrice = discount > 0
                    ? productPrice * (1 - discount / 100)
                    : productPrice;

                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: Math.round(unitPrice * 100) / 100
                };
            });

            // Create order data
            const orderData = {
                user_id: userId || null,
                total_price: total,
                payment_method: formData.payment.method,
                address: addressString,
                items: orderItems
            };

            const result = await OrderService.createOrder(orderData);

            if (result?.success) {
                setOrderId(result.order.id);
                // Generate order number
                const orderNum = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
                setOrderNumber(orderNum);

                // Clear cart
                if (userId) {
                    await clearCart(userId);
                } else {
                    clearGuestCart();
                }

                setOrderComplete(true);
                toast.success('Order placed successfully!');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to place order');
            } else {
                console.error('Order error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    // Don't render anything until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Loading checkout...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="margin-up min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                            <p className="text-gray-600 mb-8">
                                Thank you for your purchase. Your order has been confirmed and will be shipped within 2-3 business days.
                            </p>
                            <div className="bg-white rounded-xl p-6 mb-8">
                                <div className="text-sm text-gray-500 mb-2">Order Number</div>
                                <div className="text-xl font-mono font-bold text-gray-900 mb-6">
                                    {orderNumber}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-darkgray/90">Order ID</span>
                                    <span className="font-mono text-sm truncate max-w-[300px] text-gray-600">{orderId}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-darkgray/90">Estimated Delivery</span>
                                    <span className="font-medium text-gray-600 ">3-5 business days</span>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="text-sm text-gray-600 text-left">
                                        A confirmation email has been sent to <strong>{formData.contact.email}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 flex md:flex-row flex-col gap-3 justify-center">
                                <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/80">
                                    <Link href="/products">Continue Shopping</Link>
                                </Button>
                                {userId && (
                                    <Button variant="outline" asChild className="w-full sm:w-auto bg-darkgray hover:bg-darkgray/80 ">
                                        <Link href={`/orders/${orderId}`}>View Order Details</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <Button variant="ghost" asChild className="flex items-center">
                                <Link href="/cart">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Cart
                                </Link>
                            </Button>
                            <div className="hidden md:flex items-center space-x-4">
                                {[1, 2, 3].map((stepNum) => (
                                    <div key={stepNum} className="flex items-center space-x-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {stepNum}
                                        </div>
                                        <span className={step >= stepNum ? 'text-blue-600' : 'text-gray-400'}>
                      {stepNum === 1 ? 'Information' : stepNum === 2 ? 'Shipping' : 'Payment'}
                    </span>
                                        {stepNum < 3 && <div className="h-px w-8 bg-gray-300"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            <Tabs value={step.toString()} onValueChange={(v) => setStep(parseInt(v))}>
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="1">Information</TabsTrigger>
                                    <TabsTrigger value="2" disabled={step < 2}>Shipping</TabsTrigger>
                                    <TabsTrigger value="3" disabled={step < 3}>Payment</TabsTrigger>
                                </TabsList>

                                {/* Step 1: Contact Information */}
                                <TabsContent value="1" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Mail className="h-5 w-5" />
                                                Contact Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName">First Name *</Label>
                                                    <Input
                                                        id="firstName"
                                                        placeholder="John"
                                                        value={formData.contact.firstName}
                                                        onChange={(e) => handleInputChange('contact', 'firstName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">Last Name *</Label>
                                                    <Input
                                                        id="lastName"
                                                        placeholder="Doe"
                                                        value={formData.contact.lastName}
                                                        onChange={(e) => handleInputChange('contact', 'lastName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={formData.contact.email}
                                                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="(123) 456-7890"
                                                    value={formData.contact.phone}
                                                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => setStep(2)}
                                            disabled={!validateStep1()}
                                        >
                                            Continue to Shipping
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Step 2: Shipping Information */}
                                <TabsContent value="2" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5" />
                                                Shipping Address
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <Checkbox
                                                    id="sameAsContact"
                                                    checked={formData.sameAsContact}
                                                    onCheckedChange={(checked) =>
                                                        setFormData(prev => ({ ...prev, sameAsContact: checked === true }))
                                                    }
                                                />
                                                <Label htmlFor="sameAsContact">Same as contact information</Label>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name *</Label>
                                                <Input
                                                    id="fullName"
                                                    placeholder="John Doe"
                                                    value={formData.shipping.fullName}
                                                    onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                                                    disabled={formData.sameAsContact}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="street">Street Address *</Label>
                                                <Input
                                                    id="street"
                                                    placeholder="123 Main St"
                                                    value={formData.shipping.street}
                                                    onChange={(e) => handleInputChange('shipping', 'street', e.target.value)}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">City *</Label>
                                                    <Input
                                                        id="city"
                                                        placeholder="New York"
                                                        value={formData.shipping.city}
                                                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="state">State *</Label>
                                                    <Input
                                                        id="state"
                                                        placeholder="NY"
                                                        value={formData.shipping.state}
                                                        onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="postalCode">ZIP/Postal Code *</Label>
                                                    <Input
                                                        id="postalCode"
                                                        placeholder="10001"
                                                        value={formData.shipping.postalCode}
                                                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="country">Country *</Label>
                                                    <Select
                                                        value={formData.shipping.country}
                                                        onValueChange={(value) => handleInputChange('shipping', 'country', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="EG">Egypt</SelectItem>
                                                            <SelectItem value="CA">Canada</SelectItem>
                                                            <SelectItem value="UK">United Kingdom</SelectItem>
                                                            <SelectItem value="AU">Australia</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="shippingPhone">Phone Number *</Label>
                                                <Input
                                                    id="shippingPhone"
                                                    type="tel"
                                                    placeholder="(123) 456-7890"
                                                    value={formData.shipping.phone}
                                                    onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                                                    disabled={formData.sameAsContact}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-between">
                                        <Button className={`bg-darkgray hover:bg-darkgray/80`} variant="outline" onClick={() => setStep(1)}>
                                            Back
                                        </Button>
                                        <Button
                                            onClick={() => setStep(3)}
                                            disabled={!validateStep2()}
                                        >
                                            Continue to Payment
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Step 3: Payment */}
                                <TabsContent value="3" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                Payment Method
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <RadioGroup
                                                value={formData.payment.method}
                                                onValueChange={(value) => handleInputChange('payment', 'method', value)}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="credit_card" id="credit_card" />
                                                    <Label htmlFor="credit_card" className="cursor-pointer">Credit Card</Label>
                                                </div>

                                                {formData.payment.method === 'credit_card' && (
                                                    <div className="ml-6 space-y-4 p-4 border rounded-lg">
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="cardNumber">Card Number *</Label>
                                                                <Input
                                                                    id="cardNumber"
                                                                    placeholder="1234 5678 9012 3456"
                                                                    value={formData.payment.cardNumber || ''}
                                                                    onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="cardHolder">Name on Card *</Label>
                                                                <Input
                                                                    id="cardHolder"
                                                                    placeholder="John Doe"
                                                                    value={formData.payment.cardHolder || ''}
                                                                    onChange={(e) => handleInputChange('payment', 'cardHolder', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="expiryDate">Expiry Date *</Label>
                                                                <Input
                                                                    id="expiryDate"
                                                                    placeholder="MM/YY"
                                                                    value={formData.payment.expiryDate || ''}
                                                                    onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="cvv">CVV *</Label>
                                                                <Input
                                                                    id="cvv"
                                                                    placeholder="123"
                                                                    type="password"
                                                                    value={formData.payment.cvv || ''}
                                                                    onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="paypal" id="paypal" />
                                                    <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                                                </div>

                                                {formData.payment.method === 'paypal' && (
                                                    <div className="ml-6 space-y-2 p-4 border rounded-lg">
                                                        <Label htmlFor="paypalEmail">PayPal Email *</Label>
                                                        <Input
                                                            id="paypalEmail"
                                                            type="email"
                                                            placeholder="paypal@example.com"
                                                            value={formData.payment.paypalEmail || ''}
                                                            onChange={(e) => handleInputChange('payment', 'paypalEmail', e.target.value)}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                                                    <Label htmlFor="cash_on_delivery" className="cursor-pointer">Cash on Delivery</Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                                    <Label htmlFor="bank_transfer" className="cursor-pointer">Bank Transfer</Label>
                                                </div>
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>

                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Lock className="h-4 w-4" />
                                        <span>Your payment is secured with 256-bit SSL encryption</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button className={`bg-darkgray hover:bg-darkgray/80`} variant="outline" onClick={() => setStep(2)}>
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handlePlaceOrder}
                                            className="flex items-center"
                                            disabled={loading || cartItems.length === 0}
                                        >
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Shield className="mr-2 h-4 w-4" />
                                            {loading ? 'Processing...' : 'Place Order'}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                            {cartItems.length === 0 ? (
                                                <div className="text-center py-4 text-gray-500">
                                                    Your cart is empty
                                                </div>
                                            ) : (
                                                cartItems.map((item, index) => {
                                                    const itemId = item.id || `item-${index}`;
                                                    const productName = item.product?.name || 'Product';
                                                    const productPrice = item.product?.price || 0;
                                                    const discount = item.product?.discount || 0;
                                                    const finalPrice = discount > 0
                                                        ? productPrice * (1 - discount / 100)
                                                        : productPrice;
                                                    const itemTotal = finalPrice * item.quantity;

                                                    return (
                                                        <div key={itemId} className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                    {item.product?.image_url ? (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img
                                                                            src={item.product?.image_url }
                                                                            alt={productName}
                                                                            className="h-full w-full object-cover rounded-lg"
                                                                        />
                                                                    ) : (
                                                                        <div className="text-xs text-gray-400">No image</div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium line-clamp-1">{productName}</p>
                                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <p className="font-medium">${itemTotal.toFixed(2)}</p>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span>${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Shipping</span>
                                                <span>${shipping.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tax</span>
                                                <span>${tax.toFixed(2)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total</span>
                                                <span>${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Secure Checkout</p>
                                                <p className="text-sm text-gray-500">
                                                    Your payment information is encrypted and secure.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Free Returns</p>
                                                <p className="text-sm text-gray-500">
                                                    30-day return policy on all items.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}