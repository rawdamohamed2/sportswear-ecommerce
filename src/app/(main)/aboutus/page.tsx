import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Dumbbell, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="mt-10 min-h-screen bg-background text-darkgray">

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary to-primary/70 text-white">
                <div className="container mx-auto px-6 py-20 text-center">
                    <Badge className="mb-4">About Us</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Elevate Your Performance
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg opacity-90">
                        We provide premium sportswear designed for athletes, fitness lovers,
                        and everyday champions.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4 ">Our Story</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Founded with a passion for sports and innovation, our sportswear
                            shop was created to empower people to move better, train harder,
                            and live healthier. We believe performance starts with comfort,
                            quality, and confidence.
                        </p>
                    </div>

                    <Card className="shadow-lg">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Dumbbell className="text-primary" />
                                <span className="font-medium">High Performance Materials</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-primary" />
                                <span className="font-medium">Durable & Trusted Quality</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="text-primary" />
                                <span className="font-medium">Community Driven</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="bg-muted py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-10">Our Mission & Values</h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 text-center space-y-3">
                                <Trophy className="mx-auto text-primary" />
                                <h3 className="font-semibold text-lg">Excellence</h3>
                                <p className="text-sm text-muted-foreground">
                                    We aim for excellence in every product we create.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center space-y-3">
                                <ShieldCheck className="mx-auto text-primary" />
                                <h3 className="font-semibold text-lg">Integrity</h3>
                                <p className="text-sm text-muted-foreground">
                                    Honest materials, transparent pricing, real performance.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center space-y-3">
                                <Users className="mx-auto text-primary" />
                                <h3 className="font-semibold text-lg">Community</h3>
                                <p className="text-sm text-muted-foreground">
                                    Built for athletes, inspired by people.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-primary">10K+</p>
                            <p className="text-sm text-muted-foreground">Happy Customers</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-primary">500+</p>
                            <p className="text-sm text-muted-foreground">Products</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-primary">5+</p>
                            <p className="text-sm text-muted-foreground">Years Experience</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-primary">24/7</p>
                            <p className="text-sm text-muted-foreground">Support</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary text-white py-16">
                <div className="container mx-auto px-6 text-center space-y-6">
                    <h2 className="text-3xl font-bold">
                        Ready to Upgrade Your Sportswear?
                    </h2>
                    <p className="opacity-90">
                        Discover high-quality apparel designed to move with you.
                    </p>
                    <Link href={'./products'} className={`mt-2 bg-font text-darkgray px-4 py-3 rounded-lg font-medium `}>
                        Shop Now
                    </Link>
                </div>
            </section>

        </div>
    );
}

