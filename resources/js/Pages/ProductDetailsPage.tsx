"use client"

import { useState } from "react"
import { Link } from "@inertiajs/react"
import {
    ShoppingCart,
    Heart,
    ChevronRight,
    Check,
    Info,
    Plus,
    Minus,
    ChevronLeft,
} from "lucide-react"
import { AppLayout } from "@/layouts/AppLayout";
import { PageProps } from "@/types";

type Product = {
    id: number;
    nama: string;
    sku: string;
    slug: string;
    deskripsi: string;
    gambar: string | null;
    harga: number;
    stok: number;
    stok_tersedia: number;
    kategori_produk: {
        id: number;
        nama: string;
    } | null;
};


export default function ProductDetailPage({ auth, product, relatedProducts }: PageProps<{
    product: Product;
    relatedProducts: {
        id: number;
        nama: string;
        harga: number;
        gambar: string | null;
    }[];
}>) {
    const [quantity, setQuantity] = useState(1)
    console.log(product)
    // Update quantity
    const updateQuantity = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > product.stok) return
        setQuantity(newQuantity)
    }

    return (
        <>
            <AppLayout auth={auth}>
                <main className="container mx-auto px-4 py-8">

                    {/* Back to products */}
                    <div className="mb-6">
                        <Link
                            href={route('store')}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Kembali ke Toko
                        </Link>
                    </div>

                    {/* Product Overview */}
                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <div className="relative content-center w-full h-80">
                                    <img
                                        src={product.gambar ? `/storage/produk/${product.gambar}` : undefined}
                                        alt={product.nama}
                                        className="object-cover mx-auto object-center p-4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-2 text-sm font-medium text-blue-600">{product.kategori_produk?.nama ?? ''}</div>
                            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{product.nama}</h1>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">Rp{product.harga.toLocaleString('id-ID')}</span>
                                <p className="mt-1 text-sm text-gray-500">Belum termasuk PPN dan biaya pengiriman</p>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stok > 0 ? (
                                    <div className="flex items-center text-green-600">
                                        <Check className="mr-2 h-5 w-5" />
                                        <span>Stok tersedia ({product.stok} unit)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <Info className="mr-2 h-5 w-5" />
                                        <span>Stok Habis</span>
                                    </div>
                                )}
                                <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
                            </div>

                            {/* Short Description */}
                            <div className="mb-6">
                                <p className="text-gray-700">{product.deskripsi}</p>
                            </div>

                            {/* Add to Cart */}
                            <div className="mb-6 space-y-4">
                                <div className="flex items-center">
                                    <div className="mr-4 flex items-center border border-gray-300 rounded-md">
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 hover:text-blue-600"
                                            onClick={() => updateQuantity(quantity - 1)}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-10 text-center text-sm">{quantity}</span>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 hover:text-blue-600"
                                            onClick={() => updateQuantity(quantity + 1)}
                                            disabled={quantity >= product.stok_tersedia}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product.stok_tersedia} unit tersedia{product.stok !== product.stok_tersedia ? `, ${product.stok - product.stok_tersedia} ada di keranjang` : ''}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Keranjang
                                    </button>
                                    <Link
                                        href="/cart-page"
                                        className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-white px-5 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Beli langsung
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    { relatedProducts.length > 0 && (
                        <div className="mb-12">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Produk terkait</h2>
                                <Link href={route('store')} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Lihat semua <ChevronRight className="ml-1 inline-block h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct.id}
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={relatedProduct.gambar || "/placeholder.svg"}
                                                width={300}
                                                height={300}
                                                alt={relatedProduct.nama}
                                                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-blue-600 opacity-0 shadow-sm transition-opacity hover:bg-blue-50 group-hover:opacity-100">
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900">{relatedProduct.nama}</h3>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="font-bold text-blue-600">${relatedProduct.harga.toLocaleString('id-ID')}</span>
                                                <button className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) }
                </main>
            </AppLayout>
        </>
    )
}
