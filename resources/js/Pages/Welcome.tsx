import {
    Search,
    ShoppingCart,
    Menu,
    Heart,
    ArrowRight,
    Star,
    Phone,
    Mail,
    MapPin,
    User
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from "@inertiajs/react"
import { MyShorekeeper, MyShorekeeperHD } from "@/lib/StaticImagesLib";
import { PageProps } from "@/types";
import { AppLayout } from "@/layouts/AppLayout";

export default function Welcome({ auth, newestProducts }: PageProps<{
    newestProducts: {
        id: number;
        slug: string;
        nama: string;
        deskripsi: string;
        harga: number;
        stok: number;
        gambar: string | null;
    }[];
}>) {
    return (
        <>
            <AppLayout auth={auth} active="home">
                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                                <div className="space-y-4">
                                    <h1 className="text-3xl font-bold tracking-tighter text-blue-900 md:text-4xl lg:text-5xl">
                                        Peralatan Medis Canggih untuk Pelayanan Kesehatan Modern
                                    </h1>
                                    <p className="text-lg text-blue-700 md:text-xl">
                                        Menyediakan teknologi medis canggih untuk meningkatkan perawatan pasien dan perawatan kesehatan.
                                    </p>
                                    <div className="flex flex-col gap-2 lg:flex-row">
                                        <Link
                                            href="#"
                                            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                                        >
                                            Mulai Belanja
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex justify-center lg:justify-end">
                                    <img
                                        src={MyShorekeeperHD}
                                        alt="Modern medical equipment"
                                        className="w-[400px] md:w-[550px] h-[300px] md:h-[400px] rounded-lg object-cover object-center shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16 md:py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter text-blue-900 sm:text-4xl md:text-5xl">
                                        Kenapa memilih S3Medic?
                                    </h2>
                                    <p className="mx-auto max-w-[700px] text-blue-700 md:text-xl">
                                        Kami menyediakan peralatan medis berkualitas tinggi dengan layanan dan dukungan yang penuh.
                                    </p>
                                </div>
                            </div>
                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
                                <div className="flex flex-col items-center space-y-2 rounded-lg border border-blue-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-900">Kualitas Premium</h3>
                                    <p className="text-center text-blue-700">
                                        Semua peralatan kami memenuhi standar dan sertifikasi industri kesahatan tertinggi.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center space-y-2 rounded-lg border border-blue-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-900">Layanan Terbaik</h3>
                                    <p className="text-center text-blue-700">
                                        Tim spesialis kami siap memberikan bantuan teknis dan pelatihan.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center space-y-2 rounded-lg border border-blue-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                                        <ShoppingCart className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-900">Pengiriman Cepat</h3>
                                    <p className="text-center text-blue-700">
                                        Layanan pengiriman dan pemasangan cepat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Newest Section */}
                    <section className="bg-blue-50 py-16 md:py-24">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="mb-12 flex items-center justify-between">
                                <h2 className="text-3xl font-bold tracking-tighter text-blue-900">Baru Ditambahkan</h2>
                                <Link href={route('store')} className="flex items-center text-blue-600 hover:text-blue-700">
                                    Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {newestProducts.map((product) => ((
                                    <div
                                        key={product.id}
                                        className="group overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
                                        onClick={() => console.log(product.slug)}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={product.gambar ? `/storage/produk/${product.gambar}` : MyShorekeeper}
                                                width={300}
                                                height={200}
                                                alt={product.slug}
                                                className="h-48 w-full object-cover object-center transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-blue-600 opacity-0 shadow-sm transition-opacity hover:bg-blue-50 group-hover:opacity-100">
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-blue-900">{product.nama}</h3>
                                            <p className="mt-1 text-sm text-blue-700">{product.deskripsi}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="font-bold text-blue-600">Rp{product.harga.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="mt-2 flex items-center">
                                                <span className="ml-1 text-xs text-blue-700">Stok : {product.stok}</span>
                                            </div>
                                        </div>
                                    </div>
                                )))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-blue-600 py-16 md:py-24 text-white">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                        Siap untuk Meningkatkan Peralatan Medis Anda?
                                    </h2>
                                    <p className="text-blue-100 md:text-xl">
                                        Hubungi tim ahli kami untuk menemukan solusi tepat bagi fasilitas perawatan kesehatan Anda.
                                    </p>
                                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                        <Link
                                            href="#"
                                            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                                        >
                                            Hubungi Sales
                                        </Link>
                                        <Link
                                            href="#"
                                            className="inline-flex h-10 items-center justify-center rounded-md border border-blue-400 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
                                        >
                                            Lihat Katalog
                                        </Link>
                                    </div>
                                </div>
                                <div className="space-y-4 lg:space-y-6">
                                    <div className="rounded-lg bg-blue-500 p-4 shadow-sm">
                                        <div className="flex items-center">
                                            <div className="mr-4 rounded-full bg-blue-400 p-2 text-white">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Telepon</h3>
                                                <p className="text-blue-100">+62 (031) 123-4567</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-blue-500 p-4 shadow-sm">
                                        <div className="flex items-center">
                                            <div className="mr-4 rounded-full bg-blue-400 p-2 text-white">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Email</h3>
                                                <p className="text-blue-100">info@s3medic.com</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-blue-500 p-4 shadow-sm">
                                        <div className="flex items-center">
                                            <div className="mr-4 rounded-full bg-blue-400 p-2 text-white">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Kunjungi Kami</h3>
                                                <p className="text-blue-100">The Black Shores</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Invitation */}
                    <section className="py-12 md:py-16 border-t border-blue-100">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tighter text-blue-900 sm:text-3xl">
                                        Tertarik? Mulai mendaftar Akun
                                    </h2>
                                    <p className="mx-auto max-w-[600px] text-blue-700">
                                        Mendaftar Akun untuk mengakses fitur lengkap sebagai Pelanggan dan dapatkan penawaran ekslusif untuk pelanggan baru
                                    </p>
                                </div>
                                <div className="mx-auto grid gap-1 max-w-md space-y-2">
                                    <Link
                                        href={route('auth.register')}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    >
                                        Registrasi
                                    </Link>
                                    <span className="text-blue-600">atau</span>
                                    <Link
                                        href={route('auth.login')}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </AppLayout>
        </>
    )
}
