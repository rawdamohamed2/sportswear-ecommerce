"use client";

import React, { useState } from "react";
import { User, Mail, MessageSquare, Send } from "lucide-react";

export default function ContactUse() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // simulate request
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    alert("Message sent! (Demo only)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="w-full px-4 py-12 sm:py-16">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Get in touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-darkgray">
            Contact Us
          </h1>
          <p className="text-Fsecondary text-sm sm:text-base mt-2">
            Got a question or feedback? Drop us a message and we&apos;ll get
            back to you soon.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-darkgray mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-Fsecondary" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-black/10 bg-background-custom/40 text-darkgray placeholder:text-Fsecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-darkgray mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-Fsecondary" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-black/10 bg-background-custom/40 text-darkgray placeholder:text-Fsecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-darkgray mb-1.5">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-Fsecondary" />
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us how we can help..."
                  rows={5}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-black/10 bg-background-custom/40 text-darkgray placeholder:text-Fsecondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
