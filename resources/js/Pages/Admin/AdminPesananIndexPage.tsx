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
import { ArrowUpDown, MoreHorizontal, Pencil, Loader2, Trash2, Plus, CircleCheck, CircleX } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type IDNama = {
    id: number;
    nama: string;
};
type Pesanan = {
    id: number;
    pelanggan: IDNama | null;
    status_pesanan: IDNama | null;
    metode_pembayaran: IDNama | null;
    kode: string;
    total: number;
    tanggal_pesanan: string;
    alamat_pengiriman: string;
};

export default function AdminPesananIndexPage({ auth, pagination, statusPesanans }: PageProps<{
    pagination: PaginationData<Pesanan[]>;
    statusPesanans: IDNama[];
}>) {
    console.log(pagination.data);
    const { toast } = useToast();

    type UpdateForm = {
        id: number;
        status_pesanan_id: number;
        onSubmit: boolean;
    };
    type DeleteForm = {
        id: number;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const updateFormInit: UpdateForm = {
        id: 0,
        status_pesanan_id: 0,
        onSubmit: false
    };
    const deleteFormInit: DeleteForm = {
        id: 0,
        nama: '',
        validation: '',
        onSubmit: false
    };

    const [ openUpdateForm, setOpenUpdateForm ] = useState(false);
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const handleOpenUpdateFormChange = (open: boolean) => {
        setOpenUpdateForm(open);
        setUpdateForm(updateFormInit);
    };

    const columns: ColumnDef<Pesanan>[] = [
        {
            accessorKey: "pelanggan",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Pelanggan
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const pelanggan = row.original.pelanggan;
                return (
                    <div className="capitalize min-w-60 truncate ml-4">
                        {pelanggan?.nama ?? ''}
                    </div>
                );
            },
        },
        {
            accessorKey: "status_pesanan",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Status Pesanan
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status_pesanan = row.original.status_pesanan;
                return (
                    <div className="flex items-center justify-between gap-1 capitalize min-w-60 truncate ml-4">
                        <p>{status_pesanan?.nama ?? ''}</p>
                        <Button size="icon" variant="ghost" className="bg-blue-500 hover:bg-blue-500/90 text-white hover:text-white" onClick={() => {
                            setOpenUpdateForm(true);
                            setUpdateForm((prevState) => ({
                                ...prevState,
                                id: row.original.id,
                                status_pesanan_id: status_pesanan?.id ?? 0,
                            }))
                        }}>
                            <Pencil />
                        </Button>
                    </div>
                );
            },
        },
        {
            accessorKey: "metode_pembayaran",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Metode Pembayaran
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const metode_pembayaran = row.original.metode_pembayaran;
                return (
                    <div className="capitalize min-w-60 truncate ml-4">
                        {metode_pembayaran?.nama ?? ''}
                    </div>
                );
            },
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
                                    nama: originalRow.pelanggan?.nama ?? ''
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

    const handleUpdateStatusSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { id, status_pesanan_id } = updateForm;

        axios.post<{
            message: string;
        }>(route('pesanan.update-status'), {
            id: id,
            status_pesanan_id: status_pesanan_id
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
            })
            .catch((err) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
            .finally(() => {
                handleOpenUpdateFormChange(false);
            })

    };

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
        <AdminLayout auth={auth}>
            <Head title="Admin - Manajemen Pesanan" />
            <CardTitle>
                Manajemen Pesanan
            </CardTitle>
            <CardDescription>
                Data Pesanan yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <Button className="mt-4" onClick={ () => router.visit(route('admin.produk.create')) }>
                    Buat <Plus />
                </Button>
                <TableSearchForm />
            </div>
            <DataTable<Pesanan>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*UPDATE FORM*/}
            <AlertDialog open={ openUpdateForm } onOpenChange={ setOpenUpdateForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Update Status Pesanan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengubah Status Pesanan
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={handleUpdateStatusSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Update</Label>
                            <Select value={String(updateForm.status_pesanan_id)} onValueChange={(val) => setUpdateForm((prevState) => ({ ...prevState, status_pesanan_id: Number(val) }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Status Pesanan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusPesanans.map((status) => ((
                                        <SelectItem key={status.id} value={String(status.id)}>{status.nama}</SelectItem>
                                    )))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">
                            <span>Simpan</span>
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            {/*END-OF-UPDATE-FORM*/}

            {/*--DELETE-FORM--*/ }
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Periode Pesanan
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Pesanan!
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
