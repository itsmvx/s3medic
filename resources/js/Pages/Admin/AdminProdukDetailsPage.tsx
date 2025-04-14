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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminProdukCreatePage({ auth, kategoriProduks, produk }: PageProps<{
    kategoriProduks: {
        id: number;
        nama: string;
    }[];
    produk: {
        id: number;
        sku: string;
        nama: string;
        slug: string;
        deskripsi: string;
        harga: number;
        stok: number;
        gambar: string | null;
        kategori_produk_id: number;
    };
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        id: number;
        nama: string;
        slug: string;
        sku: string;
        deskripsi: string;
        stok: number;
        harga: number;
        gambar: string | null;
        kategori_produk_id: number;
        onSubmit: boolean;
    };
    const updateFormInit: UpdateForm = {
        id: produk.id,
        nama: produk.nama,
        slug: produk.slug,
        sku: produk.sku,
        deskripsi: produk.deskripsi,
        stok: produk.stok,
        harga: produk.harga,
        gambar: produk.gambar,
        kategori_produk_id: produk.kategori_produk_id,
        onSubmit: false
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);

    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id, nama, slug, sku, deskripsi, stok, harga, kategori_produk_id } = updateForm;

        const formData = new FormData();
        formData.append('id', String(id));
        formData.append('nama', nama);
        formData.append('slug', slug);
        formData.append('sku', sku);
        formData.append('deskripsi', deskripsi);
        formData.append('stok', String(stok));
        formData.append('harga', String(harga));
        formData.append('kategori_produk_id', String(kategori_produk_id));

        axios.post<{
            message: string;
        }>(route('produk.update'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                setUpdateForm(updateFormInit);
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
                setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
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
                <Head title={ `Admin - Detail Produk ${produk.nama}` } />
                <CardTitle>
                    Detail Produk
                </CardTitle>
                <CardDescription>
                    { produk.nama } - { produk.sku }
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap md:items-center *:min-w-64 *:flex-1">
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                type="text"
                                name="sku"
                                id="sku"
                                value={ updateForm.sku }
                                placeholder="KEE123"
                                onChange={ (event) =>
                                    setUpdateForm((prevState) => ({
                                        ...prevState,
                                        sku: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sku">Kategori Produk</Label>
                            <Select value={String(updateForm.kategori_produk_id)} onValueChange={(val) => setUpdateForm((prevState) => ({ ...prevState, kategori_produk_id: Number(val) }))}>
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
                            value={ updateForm.nama }
                            onChange={ (event) =>
                                setUpdateForm((prevState) => ({
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
                                value={ updateForm.stok }
                                onChange={ (event) =>
                                    setUpdateForm((prevState) => ({
                                        ...prevState,
                                        stok: Number(event.target.value),
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
                                value={ updateForm.harga }
                                onChange={ (event) =>
                                    setUpdateForm((prevState) => ({
                                        ...prevState,
                                        harga: Number(event.target.value),
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
                            value={updateForm.deskripsi}
                            onChange={(event) =>
                                setUpdateForm((prevState) => ({
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
                        <div className="w-96 aspect-video bg-blue-600">
                            <img src={produk.gambar ? `/storage/produk/${produk.gambar}` : undefined}/>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.sku || !updateForm.deskripsi || !updateForm.kategori_produk_id }
                        className="min-w-28 ml-auto"
                    >
                        { updateForm.onSubmit
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
