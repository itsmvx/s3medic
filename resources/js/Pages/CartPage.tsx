"use client"

import { useState } from "react"
import { Link, router } from "@inertiajs/react"
import {
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    ChevronLeft, Loader2,
} from "lucide-react"
import { PageProps } from "@/types";
import { AppLayout } from "@/layouts/AppLayout";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type CartItem = {
    id: number;
    produk_id: number;
    jumlah: number;
    nama: string;
    deskripsi: string;
    harga: number;
    stok: number;
    gambar: string | null;
    kategori_produk: string;
}

const shippingOptions = [
    { id: 1, nama: "Ambil di tempat", available: true },
    { id: 2, nama: "Kirim ke Alamat", available: true },
]

export default function CartPage({ auth, currentDate, cartProducts, metodePembayarans, status_pesanan_id }: PageProps<{
    currentDate: string;
    cartProducts: CartItem[];
    metodePembayarans: {
        id: number;
        nama: string;
        is_available: boolean;
    }[];
    status_pesanan_id: number;
}>) {
    const { toast } = useToast();
    const [cartItems, setCartItems] = useState(cartProducts);
    const [paymentMethod, setpaymentMethod] = useState(0);
    const [shippingMethod, setShippingMethod] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    console.log(cartItems)
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => total + item.harga * item.jumlah, 0)

    // Calculate tax (assuming 11% tax rate)
    const taxRate = 0.11
    const tax = (subtotal) * taxRate

    // Calculate total
    const total = subtotal +  tax

    const incrementCart = (id: number) => {
        axios.post(route('keranjang.increment'), {
            id: id
        })
            .then(() => {
                router.reload({ only: ['cartProducts']});
                setCartItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            const stokTersedia = Math.max(0, item.stok - item.jumlah);
                            if (stokTersedia === 0) return item;
                            return { ...item, jumlah: item.jumlah + 1 };
                        }
                        return item;
                    });
                });
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message as string
                    : 'Periksa lagi koneksi anda'
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
    }
    const decrementCart = (id: number) => {
        axios.post(route('keranjang.decrement'), {
            id: id
        })
            .then(() => {
                router.reload({ only: ['cartProducts'] });
                setCartItems(prevState => {
                    return prevState.map(item => {
                        if (item.id === id) {
                            if (item.jumlah <= 1) return item;
                            return { ...item, jumlah: item.jumlah - 1 };
                        }
                        return item;
                    });
                });
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message as string
                    : 'Periksa lagi koneksi anda'
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
    }

    // Remove item from cart
    const removeItem = (id: number) => {
        axios.post(route('keranjang.delete'), {
            id: id
        })
            .then(() => {
                router.reload({ only: ['cartProducts'] });
                setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message as string
                    : 'Periksa lagi koneksi anda'
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    const cartSubmit = () => {
        const authUser = auth.user;

        if (!authUser) {
            toast({
                variant: "destructive",
                title: "Permintaan gagal diproses!",
                description: "Anda belum login!",
            });
            return;
        }
        if (auth.role !== 'pelanggan') {
            toast({
                variant: "destructive",
                title: "Hey !",
                description: 'Anda bukan Pelanggan',
            });
            return;
        }
        setIsLoading(true);
        axios.post<{
            message: string;
        }>(route('pesanan.create'), {
            pelanggan_id: authUser.id,
            status_pesanan_id: status_pesanan_id,
            total: total,
            metode_pembayaran_id: paymentMethod,
            tanggal_pesanan: new Date(currentDate),
            transaksi: cartItems.map((cartItem) => ({
                produk_id: cartItem.produk_id,
                jumlah: cartItem.jumlah,
                nama: cartItem.nama,
                harga: cartItem.harga,
            }))
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('store'));
            })
            .catch((err: unknown) => {
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal",
                    description: 'Server gagal memproses permintaan',
                });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <>
            <AppLayout auth={auth}>
                <main className="min-h-screen container mx-auto px-4 py-8">
                    {cartItems.length === 0 ? (
                        // Empty cart state
                        <div className="min-h-96 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
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
                                        {cartProducts.map((item) => (
                                            <li key={item.id} className="p-6">
                                                <div className="flex flex-col sm:flex-row">
                                                    <div className="flex-shrink-0 sm:mr-6">
                                                        <img
                                                            src={item.nama ? `/storage/produk/${item.gambar}` : undefined}
                                                            alt={item.nama}
                                                            width={100}
                                                            height={100}
                                                            className="h-24 w-24 rounded-md object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="mt-4 flex-1 sm:mt-0">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                                            <div>
                                                                <h3 className="text-base font-medium text-gray-900">{item.nama}</h3>
                                                                <p className="mt-1 text-sm text-gray-500">{item.deskripsi}</p>
                                                                <p className="mt-1 text-xs text-blue-600">{item.kategori_produk} Equipment</p>
                                                            </div>
                                                            <div className="mt-2 sm:mt-0 sm:text-right">
                                                                <p className="text-base font-medium text-gray-900">Rp{item.harga.toLocaleString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                                <button
                                                                    type="button"
                                                                    className="p-2 text-gray-500 hover:text-blue-600"
                                                                    onClick={() => decrementCart(item.id)}
                                                                    disabled={item.jumlah <= 1}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="w-10 text-center text-sm">{item.jumlah}</span>
                                                                <button
                                                                    type="button"
                                                                    className="p-2 text-gray-500 hover:text-blue-600"
                                                                    onClick={() => incrementCart(item.id)}
                                                                    disabled={item.jumlah === item.stok}
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
                                                                        Subtotal: Rp{(item.harga * item.jumlah).toLocaleString('id-ID')}
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

                                                {/* Payment Options */}
                                                <div className="py-4">
                                                    <dt className="text-gray-600 mb-2">Metode Pembayaran</dt>
                                                    <dd>
                                                        <div className="space-y-2">
                                                            {metodePembayarans.map((option) => (
                                                                <div key={option.id} className="flex items-center">
                                                                    <input
                                                                        id={`payment-${option.id}`}
                                                                        name="payment-method"
                                                                        type="radio"
                                                                        disabled={!option.is_available}
                                                                        checked={paymentMethod === option.id}
                                                                        onChange={() => setpaymentMethod(option.id)}
                                                                        className="peer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                                    />
                                                                    <label
                                                                        htmlFor={`payment-${option.id}`}
                                                                        className="peer-disabled:opacity-60 ml-3 flex flex-1 justify-between text-gray-700"
                                                                    >
                                                                        <span>{option.nama}</span>
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </dd>
                                                </div>

                                                {/* Payment Options */}
                                                <div className="py-4">
                                                    <dt className="text-gray-600 mb-2">Metode Pengiriman</dt>
                                                    <dd>
                                                        <div className="space-y-2">
                                                            {shippingOptions.map((option) => (
                                                                <div key={option.id} className="flex items-center">
                                                                    <input
                                                                        id={`shipping-${option.id}`}
                                                                        name="shipping-method"
                                                                        type="radio"
                                                                        disabled={!option.available}
                                                                        checked={shippingMethod === option.id}
                                                                        onChange={() => setShippingMethod(option.id)}
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
                                                    <dt className="text-gray-600">PPN (11%)</dt>
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
                                        <Button disabled={!paymentMethod || isLoading} onClick={cartSubmit} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            {isLoading ? (
                                                <>Memproses <Loader2 className="animate-spin" /></>
                                            ) : (
                                                <><p>Buat Pesanan</p> <ArrowRight className="ml-2 h-5 w-5" /></>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </AppLayout>
        </>
    )
}
