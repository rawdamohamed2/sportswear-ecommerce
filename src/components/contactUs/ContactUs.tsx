'use client';

import React, { useState } from 'react';

export default function ContactUse() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Message sent! (Demo only)');

        // Add API call here
    };

    return (
        <div className="w-full px-4 pb-8 pt-2">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-darkgray">
                <h1 className="text-3xl font-bold text-center text-darkgray col-span-2 py-2">Contact Us</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="mt-1 block w-full border  border-darkgray/50 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="mt-1 block w-full border  border-darkgray/50 rounded-md p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Message</label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="mt-1 block w-full border  border-darkgray/50 rounded-md p-2"
                            rows={4}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-1/2 mx-auto block bg-primary text-white py-2 rounded-xl hover:bg-primary/90"
                        >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}