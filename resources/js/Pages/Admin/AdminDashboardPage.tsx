import {
    ArrowBigRight,
    Box,
    DollarSign,
    ShoppingCart,
    Users
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MyShorekeeper } from "@/lib/StaticImagesLib";
import { PageProps } from "@/types";

export default function AdminDashboardPage({ auth }: PageProps) {

    return (
        <>
            <AdminLayout auth={auth}>
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white shadow border">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                                        <DollarSign className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Transaksi Hari ini</dt>
                                            <dd>
                                                <div className="truncate font-bold text-gray-900">Rp123.456.000</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow border">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                                        <ShoppingCart className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                            <dd>
                                                <div className="text-lg font-bold text-gray-900">156</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link href="#" className="group font-medium text-blue-600 hover:text-blue-500">
                                        <div className="flex gap-0.5 items-center">
                                            <p>Manajemen Pesanan</p>
                                            <ArrowBigRight className="translate-x-0 group-hover:translate-x-1.5 transition-all" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow border">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Pelanggan</dt>
                                            <dd>
                                                <div className="text-lg font-bold text-gray-900">762</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link href="#" className="group font-medium text-blue-600 hover:text-blue-500">
                                        <div className="flex gap-0.5 items-center">
                                            <p>Manajemen Pelanggan</p>
                                            <ArrowBigRight className="translate-x-0 group-hover:translate-x-1.5 transition-all" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow border">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
                                        <Box className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Produk tersedia</dt>
                                            <dd>
                                                <div className="text-lg font-bold text-gray-900">556</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link href="#" className="group font-medium text-blue-600 hover:text-blue-500">
                                        <div className="flex gap-0.5 items-center">
                                            <p>Manajemen Produk</p>
                                            <ArrowBigRight className="translate-x-0 group-hover:translate-x-1.5 transition-all" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders and Products */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Recent Orders */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                                <h2 className="text-lg font-medium text-gray-900">Pesanan terbaru</h2>
                                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="p-5">
                                <div className="flow-root">
                                    <ul className="-my-5 divide-y divide-gray-200">
                                        {[1, 2, 3, 4, 5].map((order, index) => (
                                            <li key={order} className="py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1 max-w-44">
                                                        <p className="truncate text-sm font-medium text-gray-900">Order #{10000 + order}</p>
                                                        <p className="truncate text-sm text-gray-500">My Shorekeeper {order}</p>
                                                    </div>
                                                    <div>
                                                    <p className="w-20 text-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                      Menunggu
                                                    </p>
                                                    </div>
                                                    <div className="text-sm text-gray-500">Rp{index + 1}99.000</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                                <h2 className="text-lg font-medium text-gray-900">Produk terbaru</h2>
                                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="p-5">
                                <div className="flow-root">
                                    <ul className="-my-5 divide-y divide-gray-200">
                                        {[1, 2, 3, 4, 5].map((product) => (
                                            <li key={product} className="py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={MyShorekeeper}
                                                            width={40}
                                                            height={40}
                                                            className="h-10 w-10 rounded-md object-cover object-center"
                                                            alt={`Product ${product}`}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-gray-900">My Shorekeeper {product}</p>
                                                        <p className="truncate text-sm text-gray-500">SKU: SK-{1000 + product}</p>
                                                    </div>
                                                    <div>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ product % 2 === 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" }`}>
                                                    {product % 2 === 0 ? "In Stock" : "Low Stock"}
                                                </span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">Rp{product}99.000</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </AdminLayout>
        </>
    );
}
