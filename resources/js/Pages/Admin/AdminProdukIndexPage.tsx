import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Loader2, Trash2, Plus } from "lucide-react"
import { FormEvent, useState } from "react";
import { TableSearchForm } from "@/components/table-search-form";
import { cn } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/data-table";

type Produk = {
    id: number;
    sku: string;
    nama: string;
    harga: number;
    stok: number;
    gambar: string | null;
    kategori_produk: {
        id: number;
        nama: string;
    } | null;
};

export default function AdminProdukIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Produk[]>;
}>) {
    console.log(pagination.data);
    const { toast } = useToast();
    type DeleteForm = {
        id: number;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const deleteFormInit: DeleteForm = {
        id: 0,
        nama: '',
        validation: '',
        onSubmit: false
    };

    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<Produk>[] = [
        {
            accessorKey: "nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Nama
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-60 truncate ml-4">
                    {row.getValue("nama")}
                </div>
            ),
        },
        {
            accessorKey: "sku",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        SKU
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-44 truncate ml-4">
                    {row.getValue("sku")}
                </div>
            ),
        },
        {
            accessorKey: "harga",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Harga
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-44 truncate indent-4">
                    Rp{row.original.harga.toLocaleString('id-ID')}
                </div>
            ),
        },
        {
            accessorKey: "kategori_produk",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Kategori Produk
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-40 truncate px-2">
                    {row.original.kategori_produk?.nama ?? '-'}
                </div>
            ),
        },
        {
            accessorKey: "stok",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Stok
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-20 indent-4">
                    {row.getValue("stok")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const originalRow = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={ () => router.visit(route('admin.produk.details', { id: originalRow.id })) }>
                                <Pencil /> Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => {
                                setOpenDeleteForm(true);
                                setDeleteForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama
                                }));
                            } }>
                                <Trash2 /> Hapus data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleDeleteFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteForm;
        axios.post<{
            message: string;
        }>(route('produk.delete'), {
            id: id,
        })
            .then((res) => {
                setDeleteForm(deleteFormInit);
                setOpenDeleteForm(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setDeleteForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };


    return (
        <AdminLayout>
            <Head title="Admin - Manajemen Produk" />
            <CardTitle>
                Manajemen Produk
            </CardTitle>
            <CardDescription>
                Data Produk yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <Button className="mt-4" onClick={ () => router.visit(route('admin.produk.create')) }>
                    Buat <Plus />
                </Button>
                <TableSearchForm />
            </div>
            <DataTable<Produk>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*--DELETE-FORM--*/ }
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Periode Produk
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Produk!
                            </p>
                            <br/>
                            <p className="text-red-600">
                                Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleDeleteFormSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="validation">Validasi aksi anda</Label>
                            <Input
                                type="text"
                                name="validation"
                                id="validation"
                                value={ deleteForm.validation }
                                placeholder="S3MEDIC"
                                onChange={ (event) =>
                                    setDeleteForm((prevState) => ({
                                        ...prevState,
                                        validation: event.target.value,
                                    }))
                                }
                                autoComplete="off"
                            />
                            <p>Ketik <strong>S3MEDIC</strong> untuk melanjutkan</p>
                        </div>
                        <Button type="submit"
                                disabled={ deleteForm.onSubmit || deleteForm.validation !== 'S3MEDIC' }>
                            { deleteForm.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin"/></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            {/*---DELETE-FORM---*/ }
        </AdminLayout>
    );
}
