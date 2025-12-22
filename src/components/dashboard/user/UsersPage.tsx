'use client';

import { useState, useEffect } from 'react';
import { UsersTable } from '@/components/dashboard/user/users-table';
import { UserDialog } from '@/components/dashboard/user/user-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, User } from 'lucide-react';
import { User as UserType, UserFormData } from '@/types/index';
import {UserService} from "@/lib/services/user";

import Loader from "@/components/Loader";
import {toast} from "sonner";


export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [relod, setrelod]=useState(false);
    const [error, setError]=useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        admins: 0,
        customers:0,
        newThisMonth:0,
        total:0
    });
    useEffect(() => {
        loadStats();
        getUsers();
    }, [relod]);

    const getUsers = async () => {
        try {
            setLoading(true);

            const [users] = await Promise.all([
                UserService.getUsers()
            ]);

            setUsers(users.users);

        } catch (error) {
            console.error('Failed to load dashboard users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (id: string | null, userData: UserFormData) => {
        try {
            setLoading(true);

            const [error] = await Promise.all([
                UserService.addUser(userData)
            ]);
            if(error){
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError( "Something went wrong");
                }
            }
            setrelod(!relod);

        } catch (error) {
            console.error('Failed to load dashboard users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async (id: string , userData: UserFormData) => {
        if (!editingUser) return;
        try {
            setLoading(true);

            const [error] = await Promise.all([
                UserService.updateUser(id,userData)
            ]);
            if(error){
                setError(error);
                return;
            }
            toast('user updated successfully.');
            setrelod(!relod);

        } catch (error) {
            console.error('Failed to load dashboard users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            setLoading(true);

            const [error] = await Promise.all([
                UserService.deleteUser(id)
            ]);
            console.log(error);
            if(error){
                setError(error);
                return;
            }
            setrelod(!relod);
        } catch (error) {
            console.error('Failed to load dashboard users:', error);
        } finally {
            setError('');
            setLoading(false);
        }
    };

    const handleEditClick = (user: UserType) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const loadStats = async () => {
        try {
            setLoading(true);

            const [userStats] = await Promise.all([
                UserService.getUserStats(),
            ]);
            setStats({
                admins: userStats.admins,
                customers:userStats.customers,
                newThisMonth:userStats.newThisMonth,
                total:userStats.total
            });
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if(loading) return <Loader />;
    return (
        <div className="margin-up container mx-auto p-6">
            {error.length>0?<div className={`my-3 p-2 bg-red-200 text-darkgray`}>{error}</div>:''}
            {/* Header */}
            <div className="flex sm:flex-row flex-col gap-4 justify-between items-center mb-8 text-darkgray">
                <div>
                    <h1 className="text-3xl font-bold ">Users Management</h1>
                    <p className="text-gray-500 mt-2 ">Manage all users in the system</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingUser(null);
                        setIsDialogOpen(true);
                    }}
                    size="lg"
                    className={`justify-self-end`}
                >
                    <Plus className="me-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-font rounded-lg border p-6">
                    <div className="flex items-center justify-between text-darkgray">
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between text-darkgray">
                        <div>
                            <p className="text-sm text-gray-500">Admins</p>
                            <p className="text-3xl font-bold mt-2">{stats.admins}</p>
                        </div>
                        <Shield className="h-8 w-8 text-red-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between text-darkgray">
                        <div>
                            <p className="text-sm text-gray-500">Customers</p>
                            <p className="text-3xl font-bold mt-2">{stats.customers}</p>
                        </div>
                        <User className="h-8 w-8 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border">
                <UsersTable
                    users={users}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteUser}
                />
            </div>

            {/* Dialog */}
            <UserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                editingUser={editingUser}
            />
        </div>
    );
}