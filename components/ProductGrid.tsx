import React from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "@/lib/actions";

export const ProductGrid = async () => {
  const products = await getProducts();

  // Representative simulation items to showcase complete inventory spectrum
  const defaultProducts = [
    {
      id: "sim-1",
      name: "D-Cut Industrial Carrier",
      price: "$2800.00",
      category: "D-Cut Tote Bags",
      image_url: "/images/product-1.webp",
      description: "Optimized non-woven engineering with reinforced thermal seals.",
      type: "simulation"
    },
    {
      id: "sim-2",
      name: "Bottom Gusset System",
      price: "$3200.00",
      category: "Bottom Gusset Tote Bags",
      image_url: "/images/product-2.webp",
      description: "Engineered expansion gusset supporting high volumetric weight.",
      type: "simulation"
    },
    {
      id: "sim-3",
      name: "Squared Loop Series",
      price: "$3500.00",
      category: "Squared Tote Bags",
      image_url: "/images/product-3.webp",
      description: "Symmetrical structured side-seams for professional identity layout.",
      type: "simulation"
    },
    {
      id: "sim-4",
      name: "Handled Utility Unit",
      price: "$3900.00",
      category: "Handled Tote Bags",
      image_url: "/images/product-4.webp",
      description: "Heavy-duty cross-stitch handle loops for dynamic logistics payload.",
      type: "simulation"
    },
    {
      id: "sim-5",
      name: "Retail Grocery Protocol",
      price: "$4500.00",
      category: "Shopping Bags",
      image_url: "/images/product-5.webp",
      description: "Maximum payload container built for sustainable multi-lifecycle usage.",
      type: "simulation"
    },
    {
      id: "sim-6",
      name: "Bespoke Manifest Carrier",
      price: "$5200.00",
      category: "Custom Creations",
      image_url: "/images/product-6.webp",
      description: "Premium tailored non-woven custom specification for global enterprises.",
      type: "simulation"
    }
  ];

  const displayItems = products.length > 0 ? products : defaultProducts;

  return (
    <section className="py-12 bg-white border-t border-zinc-100">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[9px] font-black tracking-[0.3em] text-emerald-600 uppercase block mb-3">
              INTEGRATED PROCUREMENT LEDGER
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight uppercase">
              Core Inventory <br />
              <span className="text-zinc-300">Catalog Matrix</span>
            </h2>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 max-w-xs">
            {displayItems.length} Verified Silhouettes Available for Configuration
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {displayItems.map((item: any) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};