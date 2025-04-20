import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/app-footer";
import { Toaster } from "@/components/ui/toaster";
import { PageProps } from "@/types";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { PelangganSidebar } from "@/components/pelanggan-sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { router } from "@inertiajs/react";
import { ShoppingCart } from "lucide-react";

export const PelangganLayout = ({ auth, children }: PageProps<{
    children: ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <PelangganSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <h3 className="text-muted-foreground/80 font-medium italic select-none">
                        SK
                    </h3>
                    <div className="flex gap-2 ml-auto">
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
                    </div>
                </header>
                <div className="p-3 bg-muted">
                    <Card className="p-5 md:p-6 space-y-4 bg-white rounded-md border min-h-[calc(100vh-10rem)]">
                        { children }
                    </Card>
                </div>
                <Footer/>
                <Toaster/>
            </SidebarInset>
        </SidebarProvider>
    )
}
