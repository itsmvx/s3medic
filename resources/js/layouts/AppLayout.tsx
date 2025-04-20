import { Link, router } from "@inertiajs/react";
import {
    Menu,
    Search,
    ShoppingCart,
    User,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PageProps } from "@/types";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ProfileDropdown } from "@/components/profile-dropdown";

export const AppLayout = ({ auth, children, active }: PageProps<{
    children: ReactNode;
    active?: string;
}>) => {

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <div className="text-2xl font-bold text-blue-600">S3MedicStore</div>
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className={ `text-blue-900 hover:text-blue-600 font-medium ${active === 'home' ? 'border-b-2 border-blue-600' : ''}` }>
                                Home
                            </Link>
                            <Link href={route('store')} className={ `text-blue-900 hover:text-blue-600 font-medium ${active === 'store' ? 'border-b-2 border-blue-600' : ''}` }>
                                Store
                            </Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <>
                                    <ProfileDropdown auth={auth} />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={100}>
                                            <TooltipTrigger asChild>
                                                <button onClick={() => router.visit(route('cart'))} className="flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-blue-600">
                                                <p>Keranjang Belanja</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => {
                                                    if (!auth.user) {
                                                        router.visit(route('pelanggan.login'));
                                                    }
                                                }}
                                                className="hidden md:flex items-center justify-center rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                            >
                                                <User className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-blue-600">
                                            <p>Masuk</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </header>
                { children }
                {/* Footer */}
                <footer className="bg-blue-900 text-white">
                    <div className="container mx-auto px-4 py-6 md:px-6">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-sm text-blue-200">&copy; {new Date().getFullYear()} S3Medic.</p>
                        </div>
                    </div>
                </footer>
            </div>
            <Toaster />
        </>
    );
};
