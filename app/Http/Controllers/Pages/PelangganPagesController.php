<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Keranjang;
use App\Models\MetodePembayaran;
use App\Models\Pelanggan;
use App\Models\StatusPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PelangganPagesController extends Controller
{
    public function login()
    {
        return Inertia::render('LoginPage');
    }
    public function profile()
    {
        $authPelanggan = Auth::guard('pelanggan')->user();
        if (!$authPelanggan) {
            abort(401);
        }

        return Inertia::render('Pelanggan/PelangganProfilePage', [
            'pelanggan' => fn() => Pelanggan::select('id','nama','username','jenis_kelamin')->where('id', $authPelanggan->id)->first(),
        ]);
    }
    public function cart(Request $request) {
        $authPelanggan = Auth::guard('pelanggan')->user();

        if (!$authPelanggan) {
            return redirect()->route('pelanggan.login');
        }

        return Inertia::render('CartPage', [
            'cartProducts' => Keranjang::where('pelanggan_id', $authPelanggan->id)
                ->select([
                    'keranjang.id as id',
                    'keranjang.jumlah',
                    'produk.nama',
                    'produk.deskripsi',
                    'produk.harga',
                    'produk.stok',
                    'produk.gambar',
                    'kategori_produk.nama as kategori_produk'
                ])
                ->join('produk', 'produk.id', '=', 'keranjang.produk_id')
                ->join('kategori_produk', 'kategori_produk.id', '=', 'produk.kategori_produk_id')
                ->get(),
            'metodePembayarans' => fn() => MetodePembayaran::select(['id', 'nama', 'is_available'])->orderBy('is_available', 'desc')->get(),
            'status_pesanan_id' => StatusPesanan::where('nama', 'Menunggu Persetujuan')->value('id'),
            'currentDate' => Carbon::now('Asia/Jakarta')->toDateTimeString()
        ]);
    }
}
