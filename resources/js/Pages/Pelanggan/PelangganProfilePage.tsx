import { PelangganLayout } from "@/layouts/PelangganLayout";
import { PageProps } from "@/types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { Head, router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CustomSeparator } from "@/components/custom-separator";

export default function PelangganProfilePage({ auth, pelanggan }: PageProps<{
    pelanggan: {
        id: string;
        nama: string;
        username: string;
        jenis_kelamin: string | null;
    };
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        jenis_kelamin: string | null;
        onSubmit: boolean;
    };
    type UpdatePasswordForm = {
        password: string;
        repeatPassword: string;
        onSubmit: boolean;
        onSuccess: boolean;
        onError: boolean;
        errMsg: string;
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        jenis_kelamin: pelanggan.jenis_kelamin,
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);
    const updatePasswordFormInit: UpdatePasswordForm = {
        password: '',
        repeatPassword: '',
        onSubmit: false,
        onSuccess: false,
        onError: false,
        errMsg: ''
    };
    const [ updatePasswordForm, setUpdatePasswordForm ] = useState<UpdatePasswordForm>(updatePasswordFormInit);
    const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false);

    const handleUpdateFormInput = (key: keyof UpdateForm, value: string | boolean | null) => {
        if (key === 'jenis_kelamin' && value === 'anomali') {
            setOpenAnomaliGender(true);
            handleAnomaliGender('onChallenge', true);
        }

        setUpdateForm((prevState) => {
            if (key === 'jenis_kelamin' && value !== pelanggan.jenis_kelamin) {
                setIsOnChange(true);
            } else {
                setIsOnChange(false);
            }

            return {
                ...prevState,
                [key]: value
            };
        });
    };
    const handleUpdatePasswordFormInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdatePasswordForm((prevState) => ({
            ...prevState,
            [name]: value,
            onError: false,
            errMsg: ''
        }));
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };
    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { jenis_kelamin } = updateForm;

        axios.post<{
            message: string;
        }>(route('praktikan.update'), {
            jenis_kelamin: jenis_kelamin ?? null
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
                setUpdateForm((prevState) => ({
                    ...prevState,
                    onSubmit: false
                }))
                setIsOnChange(false);
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
    const handleUpdatePasswordFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdatePasswordForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { password, repeatPassword } = updatePasswordForm;

        axios.post<{
            message: string;
        }>(route('praktikan.update-password'), {
            password: password,
            repeat_password: repeatPassword
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
                setUpdatePasswordForm({
                    ...updatePasswordFormInit
                })
                setIsOnChange(false);
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setUpdatePasswordForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleUploadAvatar = (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('id', pelanggan.id);
        axios.post<{
            message: string;
            avatar_url: string;
        }>(route('praktikan.upload-avatar'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan', 'auth'] });
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
            });
    };

    type AnomaliGender = {
        value: string;
        onChallenge: boolean;
        onSkadoosh: boolean;
    };
    const anomaliGenderInit: AnomaliGender = {
        value: '',
        onChallenge: false,
        onSkadoosh: false
    };
    const [ anomaliGender, setAnomaliGender ] = useState<AnomaliGender>(anomaliGenderInit);
    const [ openAnomaliGender, setOpenAnomaliGender ] = useState<boolean>(false);
    const handleAnomaliGender = (key: keyof AnomaliGender, value: string | boolean) => {
        setAnomaliGender((prevState) => ({ ...prevState, [key]: value }));
    };
    const handleCancelAnomaliGender = () => {
        setAnomaliGender(anomaliGenderInit);
        handleUpdateFormInput('jenis_kelamin', pelanggan.jenis_kelamin);
    };
    const handleAcceptAnomaliGender = () => {
        axios.post(route('praktikan.add-ban-list'), {
            id: pelanggan.id,
            alasan: `Menyebut dirinya bukan Laki-Laki atau Perempuan tetapi ${anomaliGender.value} Awkwokwokwo KoCak`
        })
            .then(() => {
                router.visit(route('ban-list'), { replace: true });
            })
            .catch(() => {
                setOpenAnomaliGender(false);
                handleCancelAnomaliGender();
                toast({
                    variant: "destructive",
                    title: "Internal Server error!",
                    description: 'Terjadi error ketika memproses permintaanmu King!',
                });
            })
    };
    const disabledUpdatePasswordSubmit = updatePasswordForm.onSubmit
        || !updatePasswordForm.password
        || !updatePasswordForm.repeatPassword
        || updatePasswordForm.password !== updatePasswordForm.repeatPassword
        || updatePasswordForm.password.length < 6

    return (
        <>
            <PelangganLayout auth={ auth }>
                <Head title="Pelanggan - Profil" />
                <CardTitle>
                    Profil Saya
                </CardTitle>
                <CardDescription>
                    Menampilkan data profil Pelanggan
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Pelanggan</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ pelanggan.nama }
                                className="text-sm cursor-not-allowed"
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="username">NPM Pelanggan</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="06.20xx.1.xxxx"
                                value={ pelanggan.username }
                                className="text-sm cursor-not-allowed"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">Jenis kelamin</Label>
                            <Select value={updateForm.jenis_kelamin ?? ''} onValueChange={(val) => handleUpdateFormInput('jenis_kelamin', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih salah satu.." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    <SelectItem value="anomali">Saya bukan keduanya...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" disabled={ updateForm.onSubmit || !isOnChange } className="w-full ml-0 sm:w-min sm:ml-auto">
                        { updateForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>

                <CustomSeparator
                    text="Ganti Password"
                    className="!my-8 !mb-0"
                    lineClassName="bg-primary/50 h-0.5 w-auto"
                    textClassName="bg-primary/10 rounded-md px-4 py-1 text-primary font-bold"
                />
                <form className="grid gap-2.5" onSubmit={handleUpdatePasswordFormSubmit}>
                    <CardDescription>
                        <span className="text-red-600 font-semibold">*</span>
                        Panjang Password minimum 6 karakter
                    </CardDescription>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password Baru</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={ passwordVisible ? "text" : "password" }
                                placeholder="******"
                                value={ updatePasswordForm.password }
                                onChange={ handleUpdatePasswordFormInput }
                                required
                            />
                            <button
                                type="button"
                                onClick={ togglePasswordVisibility }
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                { passwordVisible ? (
                                    <EyeOff className="w-5 h-5"/>
                                ) : (
                                    <Eye className="w-5 h-5"/>
                                ) }
                            </button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="repeatPassword">Konfirmasi Password Baru</Label>
                        <div className="relative">
                            <Input
                                id="repeatPassword"
                                name="repeatPassword"
                                type={ passwordVisible ? "text" : "password" }
                                placeholder="******"
                                value={ updatePasswordForm.repeatPassword }
                                onChange={ handleUpdatePasswordFormInput }
                                required
                            />
                            <button
                                type="button"
                                onClick={ togglePasswordVisibility }
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                { passwordVisible ? (
                                    <EyeOff className="w-5 h-5"/>
                                ) : (
                                    <Eye className="w-5 h-5"/>
                                ) }
                            </button>
                        </div>
                    </div>
                    <Button type="submit" disabled={ disabledUpdatePasswordSubmit } className="w-full mt-3 ml-0 sm:w-min sm:ml-auto">
                        { updatePasswordForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>

                <AlertDialog open={openAnomaliGender} onOpenChange={ (open) => !open && handleCancelAnomaliGender() }>
                    <AlertDialogContent className="my-alert-dialog-content">
                        <AlertDialogHeader>
                            <AlertDialogTitle>{anomaliGender.onChallenge ? 'Apakah Tru brodi?' : 'Baik Tuan, Anda dapat dikenali sebagai apa?'}</AlertDialogTitle>
                            <AlertDialogDescription className="min-h-16 text-gray-800 antialiased flex items-center justify-center">
                                { anomaliGender.onChallenge ? (
                                    <span>Jika iya, mohon maafkan ketidaktahuan kroco ini 😓 Silahkan melanjutkan.. tapi jangan lupa membawa mahkota mu yang terjatuh King👑</span>
                                ) : (
                                    <Input
                                        type="text"
                                        name="anomali"
                                        id="anomali"
                                        value={ anomaliGender.value }
                                        onChange={ (event) => handleAnomaliGender('value', event.target.value) }
                                        className="text-sm"
                                        placeholder="Saya dikenali sebagai..."
                                    />
                                ) }
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={ () => setOpenAnomaliGender(false) }>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                className="min-w-28"
                                disabled={ !anomaliGender.onChallenge && !anomaliGender.value }
                                onClick={ () => {
                                    if (anomaliGender.onChallenge) {
                                        handleAnomaliGender('onChallenge', false);
                                        return;
                                    }
                                    handleAcceptAnomaliGender();
                                }}
                            >
                                { anomaliGender.onChallenge ? 'Lanjutkan' : 'Submit' }
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PelangganLayout>
        </>
    );
}
