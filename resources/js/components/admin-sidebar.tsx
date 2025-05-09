import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Logo, ShorekeeperPP } from "@/lib/StaticImagesLib";
import { Link } from "@inertiajs/react";
import { Separator } from "@/components/ui/separator";

const data: {
    navMain: {
        title: string;
        url: string;
        items: {
            title: string;
            url: string;
            route: string;
        }[];
    }[];
} = {
    navMain: [
        {
            title: "Produk",
            url: "#",
            items: [
                {
                    title: "Kategori Produk",
                    url: route('admin.kategori-produk.index'),
                    route: 'admin.kategori-produk.index'
                },
                {
                    title: "Manajemen Produk",
                    url: route('admin.produk.index'),
                    route: 'admin.produk.index'
                },
            ],
        },
        {
            title: "Transaksi",
            url: "#",
            items: [
                {
                    title: "Status Pesanan",
                    url: route('admin.status-pesanan.index'),
                    route: 'admin.status-pesanan.index'
                },
                {
                    title: "Metode Pembayaran",
                    url: route('admin.metode-pembayaran.index'),
                    route: 'admin.metode-pembayaran.index'
                },
                {
                    title: "Manajemen Pesanan",
                    url: route('admin.pesanan.index'),
                    route: 'admin.pesanan.index'
                },
            ],
        },
    ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="bg-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="px-3 flex gap-1 items-center">
                            <div className="flex aspect-square size-16 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                <img src={ Logo } width={ 80 } alt="jarkom-jaya"/>
                            </div>
                            <p className="font-semibold text-lg select-none">
                                S3 Medstore
                            </p>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="w-11/12 mx-auto h-0.5 bg-blue-400 rounded-sm" />
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/">
                                    Halaman Utama
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={ route().current() === 'admin.dashboard' }>
                                <Link href={route('admin.dashboard')}>
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        { data.navMain.map((item) => (
                            <Collapsible
                                key={item.title}
                                defaultOpen={item.items.some((itm) => route().current() === itm.route)}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {item.title}{" "}
                                            <ChevronDown className="ml-auto rotate-0 group-data-[state=open]/collapsible:-rotate-180 transition-rotate ease-in-out duration-300" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    {item.items?.length ? (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((item) => (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={route().current() === item.route}
                                                        >
                                                            <Link href={item.url}>{item.title}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    ) : null}
                                </SidebarMenuItem>
                            </Collapsible>
                        )) }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
