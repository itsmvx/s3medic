import { AdminSidebar } from "@/components/admin-sidebar"
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
import { ProfileDropdown } from "@/components/profile-dropdown";
import { PageProps } from "@/types";

export const AdminLayout = ({ auth, children }: PageProps<{
    children: ReactNode;
}>) => {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                    <div className="flex items-center gap-1">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <h3 className="text-muted-foreground/80 font-medium italic select-none">
                            SK
                        </h3>
                    </div>
                    <ProfileDropdown auth={auth} className="!ml-auto" />
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
