"use client"

import { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, ChevronDown, UserRound, LogIn, PanelsTopLeft } from 'lucide-react'
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

export function ProfileDropdown({ className, auth }: PageProps<{
    className?: string;
}>) {

    if (!auth.user) {
        return (
            <Button
                asChild
                className="flex items-center justify-center gap-1.5 font-semibold rounded-md"
            >
                <a href={route('pelanggan.login')}>
                    Masuk
                    <LogIn className="hidden sm:block" />
                </a>

            </Button>
        )
    }
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const handleProfile = () => {
        if (auth.role && route().current() !== `${auth.role}.profile` && isProfileAvailable) {
            router.visit(route(`${auth.role}.profile`));
        }
    };
    const isProfileAvailable = useMemo(() => {
        return auth.role === 'pelanggan';
    }, [auth])
    const handleLogout = () => {
        axios.post(route('auth.logout'))
            .then(() => {
                router.visit("/");
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`flex items-center justify-start space-x-1 text-blue-600 bg-blue-50 hover:text-blue-600 transition-colors duration-200
            ${open ? 'bg-blue-50' : 'hover:bg-blue-100'}
            focus:ring-0 focus:ring-offset-0 ${className ?? ''} w-44 sm:w-52 md:w-60 !px-2`}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} alt={auth.user.nama} />
                        <AvatarFallback><UserRound /></AvatarFallback>
                    </Avatar>
                    <span className="truncate flex-1 text-left">{auth.user.nama}</span>
                    <ChevronDown className={`ml-auto justify-self-end h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">{auth.user.nama}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {auth.user.username}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem disabled={ !isProfileAvailable } onClick={ handleProfile}>
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={ handleLogout } className="focus:bg-red-300/40">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

