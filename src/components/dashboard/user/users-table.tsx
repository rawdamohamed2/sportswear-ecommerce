'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types/index';

interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatPhone = (phone?: string) => {
        if (!phone) return 'Not provided';
        return phone;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback className="bg-blue-100 text-blue-800">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-darkgray">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1  text-darkgray">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    {user.email}
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-3 w-3 text-gray-400" />
                                        {formatPhone(user.phone)}
                                    </div>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={user.role === 'admin' ? 'default' : 'secondary'}
                                className={user.role === 'admin'
                                    ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                }
                            >
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                            {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                            {formatDate(user.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`bg-primary hover:bg-primary/80 hover:text-font`}
                                    onClick={() => onEdit(user)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm(`Delete ${user.name}?`)) {
                                            onDelete(user.id);
                                        }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 hover:text-font"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}