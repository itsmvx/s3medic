"use client"

import { useState } from "react"
import { Link } from "@inertiajs/react"
import {
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    ChevronLeft,
    Search,
    User, ShoppingCart, Menu
} from "lucide-react"
import { MyShorekeeper } from "@/lib/StaticImagesLib";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Sample cart data
const initialCartItems = [
    {
        id: 1,
        name: "Advanced Diagnostic Monitor",
        description: "High-precision diagnostic equipment for professional use",
        price: 210000,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200&text=Monitor",
        category: "Diagnostic",
    },
    {
        id: 2,
        name: "Surgical Instrument Set",
        description: "Complete set of surgical instruments for medical procedures",
        price: 1560000,
        quantity: 2,
        image: "/placeholder.svg?height=200&width=200&text=Instruments",
        category: "Surgical",
    },
    {
        id: 3,
        name: "Patient Monitoring System",
        description: "Comprehensive patient monitoring system with wireless capabilities",
        price: 420000,
        quantity: 1,
        image: "/placeholder.svg?height=200&width=200&text=System",
        category: "Monitoring",
    },
]

// Shipping options
const paymentOptions = [
    { id: 1, nama: "Tunai (Ambil Di tempat)", available: true },
    { id: 2, nama: "Paypal", available: false },
]

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems)
    const [paymentMethod, setPaymentMethod] = useState(1)

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    // Calculate tax (assuming 12% tax rate)
    const taxRate = 0.12
    const tax = (subtotal) * taxRate

    // Calculate total
    const total = subtotal +  tax

    // Update item quantity
    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return

        setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }

    // Remove item from cart
    const removeItem = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center">
                        <Link href="#" className="flex items-center">
                            <div className="text-2xl font-bold text-blue-600">S3MedicStore</div>
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link href="#" className="text-blue-900 hover:text-blue-600 font-medium">
                            Home
                        </Link>
                        <Link href="#" className="text-blue-900 hover:text-blue-600 font-medium">
                            Produk
                        </Link>
                        <Link href="#" className="text-blue-900 hover:text-blue-600 font-medium">
                            Tentang
                        </Link>
                        <Link href="#" className="text-blue-900 hover:text-blue-600 font-medium">
                            Hubungi kami
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button className="hidden md:flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
                            <Search className="h-5 w-5" />
                        </button>
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <button className="hidden md:flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
                                        <User className="h-5 w-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-blue-600">
                                    <p>Akun</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <button className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                                        <ShoppingCart className="h-5 w-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-blue-600">
                                    <p>Keranjang Belanja</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <button className="md:hidden flex items-center justify-center rounded-md p-2 text-blue-900">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    // Empty cart state
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
                        <div className="rounded-full bg-blue-50 p-6">
                            <ShoppingBag className="h-12 w-12 text-blue-500" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Keranjang mu masih kosong</h3>
                        <p className="mt-1 text-sm text-gray-500">Sepertinya kamu belum menambahkan barang ke keranjang.</p>
                        <Link
                            href={route('store')}
                            className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Lanjut Belanja
                        </Link>
                    </div>
                ) : (
                    // Cart with items
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h2 className="text-lg font-medium text-gray-900">Total Produk ({cartItems.length})</h2>
                                </div>

                                <ul className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="p-6">
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="flex-shrink-0 sm:mr-6">
                                                    <img
                                                        src={MyShorekeeper}
                                                        alt={item.name}
                                                        width={100}
                                                        height={100}
                                                        className="h-24 w-24 rounded-md object-cover object-center"
                                                    />
                                                </div>
                                                <div className="mt-4 flex-1 sm:mt-0">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                                        <div>
                                                            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                                            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                                            <p className="mt-1 text-xs text-blue-600">{item.category} Equipment</p>
                                                        </div>
                                                        <div className="mt-2 sm:mt-0 sm:text-right">
                                                            <p className="text-base font-medium text-gray-900">Rp{item.price.toLocaleString('id-ID')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center border border-gray-300 rounded-md">
                                                            <button
                                                                type="button"
                                                                className="p-2 text-gray-500 hover:text-blue-600"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                                                            <button
                                                                type="button"
                                                                className="p-2 text-gray-500 hover:text-blue-600"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button
                                                                type="button"
                                                                className="text-sm font-medium text-red-600 hover:text-red-500"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Remove</span>
                                                            </button>
                                                            <div className="ml-4 text-right">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    Subtotal: Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-gray-200 px-6 py-4">
                                    <Link
                                        href={route('store')}
                                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h2 className="text-lg font-medium text-gray-900">Total Pesanan</h2>
                                </div>

                                <div className="px-6 py-4">
                                    <div className="flow-root">
                                        <dl className="-my-4 divide-y divide-gray-200 text-sm">
                                            <div className="flex items-center justify-between py-4">
                                                <dt className="text-gray-600">Subtotal</dt>
                                                <dd className="font-medium text-gray-900">Rp{subtotal.toLocaleString('id-ID')}</dd>
                                            </div>

                                            {/* Shipping Options */}
                                            <div className="py-4">
                                                <dt className="text-gray-600 mb-2">Metode Pembayaran</dt>
                                                <dd>
                                                    <div className="space-y-2">
                                                        {paymentOptions.map((option) => (
                                                            <div key={option.id} className="flex items-center">
                                                                <input
                                                                    id={`shipping-${option.id}`}
                                                                    name="shipping-method"
                                                                    type="radio"
                                                                    disabled={!option.available}
                                                                    checked={paymentMethod === option.id}
                                                                    onChange={() => setPaymentMethod(option.id)}
                                                                    className="peer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                                />
                                                                <label
                                                                    htmlFor={`shipping-${option.id}`}
                                                                    className="peer-disabled:opacity-60 ml-3 flex flex-1 justify-between text-gray-700"
                                                                >
                                                                    <span>{option.nama}</span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </dd>
                                            </div>
                                            {/* Tax */}
                                            <div className="flex items-center justify-between py-4">
                                                <dt className="text-gray-600">PPN (12%)</dt>
                                                <dd className="font-medium text-gray-900">Rp{tax.toLocaleString('id-ID')}</dd>
                                            </div>

                                            {/* Total */}
                                            <div className="flex items-center justify-between py-4">
                                                <dt className="text-base font-medium text-gray-900">Total Pembayaran</dt>
                                                <dd className="text-base font-bold text-blue-600">Rp{total.toLocaleString('id-ID')}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 px-6 py-4">
                                    <Link
                                        href="/checkout-page"
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Buat Pesanan <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-blue-900 text-white mt-16">
                <div className="container mx-auto px-4 py-8 md:px-6">
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">MediEquip</h3>
                            <p className="text-blue-200 mb-4">
                                Providing advanced medical equipment solutions for healthcare professionals worldwide.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Products</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Diagnostic Equipment
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Surgical Instruments
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Patient Monitoring
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Rehabilitation Equipment
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Shipping & Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Warranty Information
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-blue-200 hover:text-white">
                                        Contact Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-blue-800 pt-6 text-center text-sm text-blue-200">
                        &copy; {new Date().getFullYear()} MediEquip. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
