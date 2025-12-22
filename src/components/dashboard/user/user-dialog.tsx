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
import { User, UserFormData } from '@/types/index';
interface UserData {
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin';
    password?: string;
}
interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (id: string | null, userData: UserFormData) => void;
    editingUser: User | null;
}

export function UserDialog({
                               open,
                               onOpenChange,
                               onSubmit,
                               editingUser,
                           }: UserDialogProps) {
    const [formData, setFormData] = useState<UserData>({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        password: '',
    });


    useEffect(() => {
        if (editingUser) {
            const { id, created_at, updated_at, ...userData } = editingUser;
            setFormData(userData);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'customer',
            });
        }
    }, [editingUser]);

    const id = editingUser?.id ?? null;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.role) {
            alert('Name , email and role are required');
            return;
        }

        onSubmit(id ?? null, formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingUser ? 'Edit User' : 'Add New User'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingUser
                            ? 'Update user information.'
                            : 'Add a new user to the system.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                            required
                            className={`border border-mutedgray`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            required
                            className={`border border-mutedgray`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+1 (555) 123-4567"
                            className={`border border-mutedgray`}
                        />
                    </div>

                    {
                        editingUser
                            ?''
                            :<div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password || ''}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className={`border border-mutedgray`}
                                />
                            </div>
                    }

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: 'customer' | 'admin') =>
                                setFormData({...formData, role: value})
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingUser ? 'Update User' : 'Add User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}