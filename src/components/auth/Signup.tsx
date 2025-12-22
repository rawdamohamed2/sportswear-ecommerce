'use client';

import { useState } from 'react';
import {redirect, useRouter} from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store/store';


const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .refine((phone) => {
            if (!phone || phone.trim() === '') return true;
            const phoneRegex = /^(?:\+?20|0)?1[0-9]{9}$/;
            return phoneRegex.test(phone.replace(/\s+/g, ''));
        }, {
            message: 'Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)'
        }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Signup() {
    const { signUp, isLoading:loading} = useStore();
    const router = useRouter();
    const error = useStore((state) => state.error);
    const token = useStore((s) => s.token);
    const [erro, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });
    console.log(error);
    const onSubmit = async (signupdata: RegisterFormData) => {
        try {
            await signUp(signupdata);
            console.log(error,loading);
            if(error !== null || ''){
                setError(error);
                return;
            }
            else{
                router.push('/auth/login');
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        }
    };

    if(token){
        redirect('/');
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="margin-up w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">Enter your information to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {erro?<div className="bg-red-200 p-2 my-4">{erro}</div>:''}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" {...register('name')} disabled={loading} />
                            {errors.name?<div className="bg-red-200 py-1 px-2 my-2 rounded-lg my-2">{errors.name.message}</div>:''}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} disabled={loading} />
                            {errors.email?<div className="bg-red-200 py-1 px-2 my-2 rounded-lg my-2">{errors.email.message}</div>:''}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone </Label>
                            <Input id="phone" type="tel" placeholder="+1234567890" {...register('phone')} disabled={loading} />
                            {errors.phone?<div className="bg-red-200 py-1 px-2 my-2 rounded-lg my-2">{errors.phone.message}</div>:''}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" {...register('password')} disabled={loading} />
                            {errors.password?.message?<div className="bg-red-200 py-1 px-2 my-2 rounded-lg my-2">{errors.password.message}</div>:''}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} disabled={loading} />
                            {errors.confirmPassword?.message?<div className="bg-red-200 py-1 px-2 my-2 rounded-lg">{errors.confirmPassword.message}</div>:''}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <select id="role" {...register('role')} disabled={loading} className="border p-2 w-full rounded">
                                <option value="customer">customer</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating account...' : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" /> Create Account
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
