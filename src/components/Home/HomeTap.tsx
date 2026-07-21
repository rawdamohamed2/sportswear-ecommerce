"use client";
import React, { useEffect } from "react";
import NewArrivalProducts from "@/components/Home/NewArrivalProducts";
import { useProductStore } from "@/lib/store/Products";
import Loader from "@/components/Loader";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const HomeTap = () => {
  const {
    newArrivalProducts,
    isNewArrivalLoading,
    newArrivalError,
    fetchNewArrivalProducts,
  } = useProductStore();

  useEffect(() => {
    fetchNewArrivalProducts();
  }, []);

  if (isNewArrivalLoading) return <Loader />;

  if (newArrivalError) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Something went wrong while loading featured products.
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-15`}>
      <div className="md:px-0 px-3 text-darkgray flex items-center justify-between mb-5">
        <h2 className="text-4xl font-bold uppercase italic mb-2">
          New Arrivals
        </h2>
        <Link
          className="group flex items-center gap-2 font-bold uppercase text-sm"
          href="/products"
        >
          View Collection
          <FaArrowRightLong className="material-symbols-outlined group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <NewArrivalProducts products={newArrivalProducts} />
    </div>
  );
};
export default HomeTap;
