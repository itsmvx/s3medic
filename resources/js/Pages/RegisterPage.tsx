"use client"

import type React from "react"
import { useState } from "react"
import { Link, router, Head } from "@inertiajs/react"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowRight,
    Check,
    CalendarDays,
    Phone, MapPinHouse, SquareUserRound
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageProps } from "@/types";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function RegisterPage({ provinces }: PageProps<{
    provinces: {
        id: string;
        name: string;
    }[];
}>) {
    const { toast } = useToast();
    const regionsDataInit = {
        onLoad: false,
        data: []
    };
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [date, setDate] = useState<string>("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [regencies, setRegencies] = useState<{
        onLoad: boolean;
        data: {
            id: string;
            name: string;
            province_id: string;
        }[]
    }>(regionsDataInit);
    const [districts, setDistricts] = useState<{
        onLoad: boolean;
        data: {
            id: string;
            name: string;
            regency_id: string;
        }[]
    }>(regionsDataInit);
    const [villages, setVillages] = useState<{
        onLoad: boolean;
        data: {
            id: string;
            name: string;
            district_id: string;
        }[]
    }>(regionsDataInit);
    const [province, setProvince] = useState("")
    const [regency, setRegency] = useState("")
    const [district, setDistrict] = useState("")
    const [village, setVillage] = useState("")
    const [noTelp, setNoTelp] = useState("")
    const [jenisKelamin, setJenisKelamin] = useState("")
    const [alamat, setAlamat] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email || !username || !password || !confirmPassword) {
            setError("Mohon isi semua input formulir")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            setIsLoading(true)
            const response = await axios.post(route('pelanggan.create'), {
                nama: name,
                username: username,
                email: email,
                password: password,
                tanggal_lahir: date,
                jenis_kelamin: jenisKelamin,
                alamat: alamat,
                no_telp: noTelp,
                kode_wilayah: village
            });
            toast({
                variant: 'default',
                className: 'bg-green-500 text-white',
                title: "Berhasil!",
                description: response.data.message,
            });
            setTimeout(() => {
                router.visit(route('pelanggan.login'));
            }, 500);
        } catch (err: unknown) {
            const errMsg = err instanceof AxiosError && err.response?.data?.message
                ? err.response.data.message as string
                : 'Periksa lagi koneksi anda'
            setError(errMsg);
            toast({
                variant: "destructive",
                title: "Permintaan gagal diproses!",
                description: errMsg,
            });
        } finally {
            setIsLoading(false)
        }
    };

    const handleSelectProvince = (value: string) => {
        const prevProvince = province;
        setProvince(value);
        setRegency("");
        setDistrict("");
        setVillage("");
        setRegencies({
            ...regionsDataInit,
            onLoad: true,
        });
        setDistricts(regionsDataInit);
        setVillages(regionsDataInit);
        axios.get<{
            id: string;
            name: string;
            province_id: string;
        }[]>(route('wilayah.regencies', value))
            .then((res) => {
                setRegencies({
                    ...regionsDataInit,
                    data: res.data,
                })
            })
            .catch(() => {
                setProvince(prevProvince);
            })

    };
    const handleSelectRegency = (value: string) => {
        const prevRegency = regency;
        setRegency(value);
        setDistrict("");
        setDistricts({
            ...regionsDataInit,
            onLoad: true,
        });
        setVillage("");
        setVillages(regionsDataInit);
        axios.get<{
            id: string;
            name: string;
            regency_id: string;
        }[]>(route('wilayah.districts', value))
            .then((res) => {
                setDistricts({
                    ...regionsDataInit,
                    data: res.data,
                })
            })
            .catch(() => {
                setRegency(prevRegency);
            })

    };
    const handleSelectDistrict = (value: string) => {
        const prevDistrict = district;
        setDistrict(value);
        setVillage("");
        setVillages({
            ...regionsDataInit,
            onLoad: true,
        });
        axios.get<{
            id: string;
            name: string;
            district_id: string;
        }[]>(route('wilayah.villages', value))
            .then((res) => {
                setVillages({
                    ...regionsDataInit,
                    data: res.data,
                })
            })
            .catch(() => {
                setDistrict(prevDistrict);
            })

    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="flex justify-center">
                                <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
                                    S3Medic
                                </Link>
                            </div>
                            <h2 className="mt-1 text-center text-3xl font-extrabold text-gray-900">Buat Akun</h2>
                            <p className="mt-1 mb-6 text-center text-sm text-gray-600">
                                Atau{" "}
                                <Link href={route('pelanggan.login')} className="font-medium text-blue-600 hover:text-blue-500">
                                    masuk ke akun yang sudah ada
                                </Link>
                            </p>
                        </div>
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Nama
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SquareUserRound className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Nama"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Konfirmasi Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`block w-full pl-10 pr-10 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            confirmPassword && password !== confirmPassword
                                                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Lahir
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarDays className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Jenis Kelamin
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Select value={jenisKelamin} onValueChange={(val) => setJenisKelamin(val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Provinsi
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Select value={province} onValueChange={handleSelectProvince}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Provinsi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            { provinces.map((province, index) => ((
                                                <SelectItem key={index} value={province.id}>{province.name}</SelectItem>
                                            )))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Kota/Kabupaten
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Select value={regency} disabled={regencies.data.length < 1 || regencies.onLoad} onValueChange={handleSelectRegency}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={ `${regencies.onLoad ? 'Memuat data...' : !province ? 'Pilih Provinsi terlebih dahulu' : 'Pilih Kota/Kabupaten'}` } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            { regencies.data.map((regency, index) => ((
                                                <SelectItem key={index} value={regency.id}>{regency.name}</SelectItem>
                                            )))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Kecamatan
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Select value={district} disabled={districts.data.length < 1 || districts.onLoad} onValueChange={handleSelectDistrict}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={ `${districts.onLoad ? 'Memuat data...' : !regency ? 'Pilih Kota/Kabupaten terlebih dahulu' : 'Pilih Kecamatan'}` } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            { districts.data.map((district, index) => ((
                                                <SelectItem key={index} value={district.id}>{district.name}</SelectItem>
                                            )))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Desa/Kelurahan
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Select value={village} disabled={villages.data.length < 1 || villages.onLoad} onValueChange={(val) => setVillage(val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={ `${villages.onLoad ? 'Memuat data...' : !district ? 'Pilih Kecamatan terlebih dahulu' : 'Pilih Desa/Kelurahan'}` } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            { villages.data.map((village, index) => ((
                                                <SelectItem key={index} value={village.id}>{village.name}</SelectItem>
                                            )))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                                    Alamat Lengkap
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPinHouse className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="alamat"
                                        name="alamat"
                                        type="text"
                                        required
                                        value={alamat}
                                        onChange={(e) => setAlamat(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Jl.Maranelo no.1  "
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700">
                                    No.Telp
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="no_telp"
                                        name="no_telp"
                                        type="text"
                                        autoComplete="off"
                                        required
                                        value={noTelp}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setNoTelp(value);
                                            }
                                        }}

                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="08123456789"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Create account <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}
