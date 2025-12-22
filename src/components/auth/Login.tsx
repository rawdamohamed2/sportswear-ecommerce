'use client';

import { useState} from 'react';
import {redirect} from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store/store';


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
    const {signIn, isLoading, error: loginError } = useStore();
    const [erro, setError] = useState<string | null>(null);
    const error = useStore((state) => state.error);
    const token = useStore((s) => s.token);

    if(token){
        redirect('/');
    }
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });


    const onSubmit = async (data: LoginFormData) => {
        try {
            await signIn(data.email, data.password);
            console.log(loginError);
            if(error !== null ||'' ){
                setError(error);
                return;
            }
            else{
                redirect('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        }
    };



    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="margin-up w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Sign in to your account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {erro && <div className="bg-red-200 p-2 my-4 rounded-lg">{erro}</div>}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>


                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                'Signing in...'
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4"/>
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}