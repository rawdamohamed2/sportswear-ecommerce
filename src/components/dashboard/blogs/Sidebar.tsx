import React from 'react';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
    Users,
    BarChart3,
    LogOut,
    Bell,
    Search,
    Menu,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    isOpen,
                                                    onToggle,
                                                    activeSection,
                                                    onSectionChange
                                                }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'blogs', label: 'All Blogs', icon: FileText },
        { id: 'new', label: 'New Blog', icon: PlusCircle },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={onToggle}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-800">
                        <h1 className="text-2xl font-bold flex items-center">
                            <FileText className="w-8 h-8 mr-2" />
                            Blog Admin
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Content Management System</p>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            onSectionChange(item.id);
                                            if (window.innerWidth < 1024) onToggle();
                                        }}
                                        className={`
                      w-full flex items-center px-4 py-3 rounded-lg transition-colors
                      ${activeSection === item.id
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-800 text-gray-300'
                                        }
                    `}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                        {item.id === 'blogs' && (
                                            <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        24
                      </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                                alt="Admin"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-3">
                                <p className="font-medium">Admin User</p>
                                <p className="text-sm text-gray-400">admin@example.com</p>
                            </div>
                            <button className="ml-auto relative">
                                <Bell className="w-5 h-5 text-gray-400" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                        <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};