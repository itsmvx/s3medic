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
import { ArrowUpDown, MoreHorizontal, Plus, Loader2, Pencil, Trash2 } from "lucide-react"
import { FormEvent, useState } from "react";
import { TableSearchForm } from "@/components/table-search-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Head, router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PageProps, PaginationData } from "@/types";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import DataTable from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

type KategoriProduk = {
    id: number;
    nama: string;
};
export default function AdminJenisPraktikumIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<KategoriProduk[]>;
}>) {
    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        onSubmit: boolean;
    };
    type UpdateForm = {
        id: number;
        nama: string;
        onSubmit: boolean;
    };
    type DeleteForm = {
        id: number;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        onSubmit: false
    };
    const updateFormInit: UpdateForm = {
        id: 0,
        nama: '',
        onSubmit: false
    };
    const deleteFormInit: DeleteForm = {
        id: 0,
        nama: '',
        validation: '',
        onSubmit: false
    };
    const [ openCreateForm, setOpenCreateForm ] = useState(false);
    const [ openUpdateForm, setOpenUpdateForm ] = useState(false);
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<KategoriProduk>[] = [
        {
            accessorKey: "nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Nama Kategori Produk
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize w-full ml-4">
                    {row.getValue("nama")}
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
                            <DropdownMenuItem onClick={ () => {
                                setOpenUpdateForm(true);
                                setUpdateForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama,
                                }));
                            } }>
                                <Pencil /> Ubah data
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
    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama } = createForm;
        axios.post<{
            message: string;
        }>(route('kategori-produk.create'), {
            nama: nama,
        })
            .then((res) => {
                setCreateForm(createFormInit);
                setOpenCreateForm(false);
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
                setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id, nama } = updateForm;

        axios.post<{
            message: string;
        }>(route('kategori-produk.update'), {
            id: id,
            nama: nama,
        })
            .then((res) => {
                setUpdateForm(updateFormInit);
                setOpenUpdateForm(false);
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
                setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleDeleteFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteForm;

        axios.post<{
            message: string;
        }>(route('kategori-produk.delete'), {
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
    const handleOpenCreateFormChange = (open: boolean) => {
        setOpenCreateForm(open);
        setCreateForm(createFormInit);
    };
    const handleOpenUpdateFormChange = (open: boolean) => {
        setOpenUpdateForm(open);
        setCreateForm(updateFormInit);
    };

    return (
        <AdminLayout>
            <Head title="Admin - Manajemen Kategori Produk" />
            <CardTitle>
                Manajemen Kategori Produk
            </CardTitle>
            <CardDescription>
                Data Kategori Produk yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <AlertDialog open={ openCreateForm } onOpenChange={ handleOpenCreateFormChange }>
                    <AlertDialogTrigger asChild>
                        <Button className="mt-4">
                            Buat <Plus />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tambah Kategori Produk
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-foreground">
                                Menambahkan Kategori Produk baru, contoh: <strong>Alat Diagnostik</strong>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Kategori Produk</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createForm.nama }
                                    onChange={ (event) => setCreateForm((prevState) => ({ ...prevState, nama: event.target.value })) }
                                />
                            </div>
                            <Button type="submit" disabled={createForm.onSubmit || !createForm.nama }>
                                { createForm.onSubmit
                                    ? (
                                        <>Memproses <Loader2 className="animate-spin" /></>
                                    ) : (
                                        <span>Simpan</span>
                                    )
                                }
                            </Button>
                        </form>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                    </AlertDialogContent>
                </AlertDialog>
                <TableSearchForm />
            </div>
            <DataTable<KategoriProduk>
                columns={columns}
                data={pagination.data}
                pagination={pagination}
            />

            {/*--UPDATE-FORM--*/}
            <AlertDialog open={ openUpdateForm } onOpenChange={ handleOpenUpdateFormChange }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Update Kategori Produk
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengubah nama Kategori Produk
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Kategori Produk</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => setUpdateForm((prevState) => ({
                                    ...prevState,
                                    nama: event.target.value
                                })) }
                            />
                        </div>
                        <Button type="submit" disabled={updateForm.onSubmit}>
                            { updateForm.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin" /></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            {/*---UPDATE-FORM---*/}

            {/*--DELETE-FORM--*/}
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Kategori Produk
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Kategori Produk!
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
                        <Button type="submit" disabled={ deleteForm.onSubmit || deleteForm.validation !== 'S3MEDIC'}>
                            { deleteForm.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin" /></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                    </form>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            {/*---DELETE-FORM---*/}
        </AdminLayout>
    );
}
