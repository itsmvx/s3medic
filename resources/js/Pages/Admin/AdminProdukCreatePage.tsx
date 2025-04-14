import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn, slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PageProps } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminProdukCreatePage({ auth, kategoriProduks }: PageProps<{
    kategoriProduks: {
        id: number;
        nama: string;
    }[];
}>) {
    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        slug: string;
        sku: string;
        deskripsi: string;
        stok: string;
        harga: string;
        gambar: File | null;
        kategori_produk_id: string;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        slug: '',
        sku: '',
        deskripsi: '',
        stok: '',
        harga: '',
        gambar: null,
        kategori_produk_id: '',
        onSubmit: false
    };

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);

    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, slug, sku, deskripsi, stok, harga, gambar, kategori_produk_id } = createForm;

        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('slug', slug);
        formData.append('sku', sku);
        formData.append('deskripsi', deskripsi);
        formData.append('stok', String(stok));
        formData.append('harga', String(harga));
        formData.append('kategori_produk_id', String(kategori_produk_id));
        gambar && formData.append('gambar', gambar);

        axios.post<{
            message: string;
        }>(route('produk.create'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                setCreateForm(createFormInit);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.produk.index'));
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

    return (
        <>
            <AdminLayout>
                <Head title="Admin - Menambahkan Produk" />
                <CardTitle>
                    Menambahkan Produk
                </CardTitle>
                <CardDescription>
                    Menambahkan data Produk baru
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap md:items-center *:min-w-64 *:flex-1">
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                type="text"
                                name="sku"
                                id="sku"
                                value={ createForm.sku }
                                placeholder="KEE123"
                                onChange={ (event) =>
                                    setCreateForm((prevState) => ({
                                        ...prevState,
                                        sku: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sku">Kategori Produk</Label>
                            <Select value={createForm.kategori_produk_id} onValueChange={(val) => setCreateForm((prevState) => ({ ...prevState, kategori_produk_id: val }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih kategori produk" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriProduks.map((kategori) => ((
                                        <SelectItem key={kategori.id} value={String(kategori.id)}>{kategori.nama}</SelectItem>
                                    )))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Produk</Label>
                        <Input
                            type="text"
                            name="nama"
                            id="nama"
                            value={ createForm.nama }
                            onChange={ (event) =>
                                setCreateForm((prevState) => ({
                                    ...prevState,
                                    nama: event.target.value,
                                    slug: slugify(event.target.value)
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap md:items-center *:min-w-64 *:flex-1">
                        <div className="grid gap-2">
                            <Label htmlFor="sku">Stok</Label>
                            <Input
                                type="number"
                                name="stok"
                                id="stok"
                                value={ createForm.stok }
                                onChange={ (event) =>
                                    setCreateForm((prevState) => ({
                                        ...prevState,
                                        stok: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sku">Harga</Label>
                            <Input
                                type="number"
                                name="harga"
                                id="harga"
                                value={ createForm.harga }
                                onChange={ (event) =>
                                    setCreateForm((prevState) => ({
                                        ...prevState,
                                        harga: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="deskripsi">Deskripsi Produk</Label>
                        <Textarea
                            id="deskripsi"
                            placeholder="..."
                            className="min-h-28"
                            value={createForm.deskripsi}
                            onChange={(event) =>
                                setCreateForm((prevState) => ({
                                    ...prevState,
                                    deskripsi: event.target.value
                                }))
                            }
                        />
                    </div>

                    <div className="grid w-full gap-2">
                        <Label>
                            Gambar Produk
                        </Label>
                        <ImageUpload
                            className="mx-0 mt-2 "
                            onFileUpload={(file) => setCreateForm((prevState) => ({
                                ...prevState,
                                gambar: file
                            }))}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={ createForm.onSubmit || !createForm.nama || !createForm.sku || !createForm.deskripsi || !createForm.kategori_produk_id }
                        className="min-w-28 ml-auto"
                    >
                        { createForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <>
                                    Simpan <Save />
                                </>
                            )
                        }
                    </Button>
                </form>
            </AdminLayout>
        </>
    );
}
