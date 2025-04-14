"use client"

import {
    Search,
    ShoppingCart,
    Filter,
    ChevronDown,
    Heart,
    Grid,
    List,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    Menu,
    User, ShoppingBag, ScanSearch,
} from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { FormEvent, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MyShorekeeper } from "@/lib/StaticImagesLib"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PageProps } from "@/types";
import { Button } from "@/components/ui/button";

export default function StorePage({ kategoriProduks, produks }: PageProps<{
    kategoriProduks: {
        id: number;
        nama: string;
    }[];
    produks: {
        id: number;
        nama: string;
        slug: string;
        deskripsi: string;
        harga: number;
        stok: number;
        gambar: string | null;
        kategori_produk: {
            id: number;
            nama: string;
        } | null;
    }[];
}>) {
    const searchParams = new URLSearchParams(window.location.search);
    const [filterOpen, setFilterOpen] = useState(false)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000])
    const [sortOption, setSortOption] = useState<string>("newest")
    const [searchQuery, setSearchQuery] = useState<string>("")

    // Toggle category selection
    const toggleCategory = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
        } else {
            setSelectedCategories([...selectedCategories, categoryId])
        }
    }

    // Handle price range change
    const handlePriceRangeChange = (index: number, value: number) => {
        const newRange = [...priceRange] as [number, number]
        newRange[index] = value
        setPriceRange(newRange)
    }

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchQuery) {
            searchParams.set('search', searchQuery);
            router.visit(window.location.pathname + '?' + searchParams.toString(), {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            searchParams.delete('search');
            router.visit(window.location.pathname + '?' + searchParams.toString(), {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setSearchQuery("");
                }
            });
        }
    }

    const appyFilter = () => {
        selectedCategories.length > 1 && searchParams.set('categories', selectedCategories.join(","));
        searchParams.set('sort', sortOption);
        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    // Reset all filters
    const resetFilters = () => {
        setSelectedCategories([])
        setPriceRange([0, 1000000])
        setSearchQuery("")
        setSortOption("newest")
        router.visit(route('store'));
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
                        <Link href="#" className="text-blue-900 hover:text-blue-600 font-medium border-b-2 border-blue-600">
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
                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <form className="relative w-full md:w-96" onSubmit={handleSearchSubmit}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="hidden">
                            <Search />
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${
                                    viewMode === "grid"
                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white text-gray-700"
                                }`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${
                                    viewMode === "list"
                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                        : "border-gray-300 bg-white text-gray-700"
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="inline-flex w-72 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                    Urutkan :
                                    <span className="ml-1 font-medium">
                                        {sortOption === "newest"
                                            ? "Terbaru"
                                            : sortOption === "price-asc"
                                                ? "Harga: Terendah"
                                                : "Harga: Tertinggi"
                                        }
                                    </span>
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={() => setSortOption("newest")}
                                    className={sortOption === "newest" ? "bg-blue-50 text-blue-700" : ""}
                                >
                                    Terbaru
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSortOption("price-asc")}
                                    className={sortOption === "price-asc" ? "bg-blue-50 text-blue-700" : ""}
                                >
                                    Harga: Terendah
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setSortOption("price-desc")}
                                    className={sortOption === "price-desc" ? "bg-blue-50 text-blue-700" : ""}
                                >
                                    Harga: Tertinggi
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse">
                    {/* Filter Sidebar */}
                    <aside
                        className={`${
                            filterOpen ? "block" : "hidden"
                        } md:block w-full md:w-64 shrink-0 border-b border-gray-200 pb-6 md:border-b-0 md:border-l md:border-gray-200 md:pl-6`}
                    >
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between pb-4 md:pb-6">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <div className="flex md:hidden">
                                    <button
                                        onClick={() => setFilterOpen(false)}
                                        className="inline-flex items-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
                                >
                                    Reset All
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="border-t border-gray-200 py-4">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Kategori</h3>
                                <div className="space-y-2">
                                    {kategoriProduks.map((kategori) => (
                                        <div key={kategori.id} className="flex items-center">
                                            <input
                                                id={`category-${kategori.id}`}
                                                name={`category-${kategori.id}`}
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedCategories.includes(String(kategori.id))}
                                                onChange={() => toggleCategory(String(kategori.id))}
                                            />
                                            <label htmlFor={`category-${kategori.id}`} className="ml-3 text-sm text-gray-600">
                                                {kategori.nama}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="border-t border-gray-200 py-4">
                                <h3 className="mb-3 text-sm font-medium text-gray-900">Rentang Harga</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="rounded-md border border-gray-300 px-3 py-1.5">
                                            <span className="text-sm text-gray-900">{priceRange[0].toLocaleString('id-ID')}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">to</span>
                                        <div className="rounded-md border border-gray-300 px-3 py-1.5">
                                            <span className="text-sm text-gray-900">{priceRange[1].toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="min-price" className="mb-1 block text-xs text-gray-500">
                                            Minimum
                                        </label>
                                        <input
                                            type="range"
                                            id="min-price"
                                            min="0"
                                            max="1000000"
                                            step="1000"
                                            value={priceRange[0]}
                                            onChange={(e) => handlePriceRangeChange(0, Number.parseInt(e.target.value))}
                                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="max-price" className="mb-1 block text-xs text-gray-500">
                                            Maksimal
                                        </label>
                                        <input
                                            type="range"
                                            id="max-price"
                                            min="0"
                                            max="1000000000"
                                            step="1000"
                                            value={priceRange[1]}
                                            onChange={(e) => handlePriceRangeChange(1, Number.parseInt(e.target.value))}
                                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex">
                                <button
                                    onClick={appyFilter}
                                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Results Info */}
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">{produks.length}</span> results
                            </p>
                            <button
                                onClick={resetFilters}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 md:hidden"
                            >
                                Reset All
                            </button>
                        </div>

                        {/* Active Filters */}
                        {searchParams.get('search') && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                                        Search: {searchParams.get('search')}
                                        <button
                                            onClick={() => {
                                                searchParams.delete('search');
                                                router.visit(window.location.pathname + '?' + searchParams.toString(), {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    onFinish: () => {
                                                        setSearchQuery("");
                                                    }
                                                });
                                            }}
                                            className="ml-1.5 inline-flex items-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {produks.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
                                <SlidersHorizontal className="h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Try adjusting your search or filter to find what you're looking for.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {produks.length > 0 && viewMode === "grid" && (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {produks.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={product.gambar ? `/storage/produk/${product.gambar}` : undefined}
                                                width={300}
                                                height={300}
                                                alt={product.slug}
                                                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-blue-600 opacity-0 shadow-sm transition-opacity hover:bg-blue-50 group-hover:opacity-100">
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-1 text-xs text-blue-600">{product.kategori_produk?.nama ?? ''}</div>
                                            <h3 className="font-semibold text-gray-900">{product.nama}</h3>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.deskripsi}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="font-bold text-blue-600">Rp{product.harga.toLocaleString("id-ID")}</span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center justify-end gap-2 *:flex *:items-center *:gap-0.5">
                                                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                                                    <ScanSearch size={16} strokeWidth={2} /> Detail
                                                </button>
                                                <button className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                                                    <ShoppingBag size={16} strokeWidth={2} /> Checkout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Product List */}
                        {produks.length > 0 && viewMode === "list" && (
                            <div className="space-y-4">
                                {produks.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md sm:flex-row"
                                    >
                                        <div className="relative h-48 w-full sm:h-auto sm:w-48 md:w-56 lg:w-64">
                                            <img
                                                src={product.gambar ? `/storage/produk/${product.gambar}` : undefined}
                                                width={300}
                                                height={300}
                                                alt={product.slug}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="mb-1 text-xs text-blue-600">{product.kategori_produk?.nama ?? ''}</div>
                                            <h3 className="font-semibold text-gray-900">{product.nama}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{product.deskripsi}</p>
                                            <div className="mt-auto flex items-center justify-between pt-4">
                                                <span className="font-bold text-blue-600">Rp{product.harga.toLocaleString("id-ID")}</span>
                                                <div className="flex items-center space-x-2">
                                                    <button className="rounded-full bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100">
                                                        <Heart className="h-4 w-4" />
                                                    </button>
                                                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                                        Keranjang
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-blue-900 text-white">
                <div className="container mx-auto px-4 py-6 md:px-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-blue-200">&copy; {new Date().getFullYear()} S3Medic.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
