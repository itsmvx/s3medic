<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\KategoriProduk;
use App\Models\MetodePembayaran;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\StatusPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminPagesController extends Controller
{
    public function login()
    {
        return Inertia::render('Admin/AdminLoginPage');
    }
    public function dashboard()
    {
        return Inertia::render('Admin/AdminDashboardPage');
    }
    public function kategoriProdukIndex(Request $request)
    {
        $viewPerPage = $this->getViewPerPage($request);

        $query = KategoriProduk::select(['id', 'nama']);

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('created_at', 'desc');

        $kategoriProduks = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminKategoriProdukIndexPage', [
            'pagination' => fn() => $kategoriProduks,
        ]);
    }
    public function produkIndex(Request $request)
    {
        $viewPerPage = $this->getViewPerPage($request);

        $query = Produk::select(['id', 'sku', 'nama', 'harga', 'stok', 'gambar', 'kategori_produk_id'])
            ->with('kategori_produk:id,nama');

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('created_at', 'desc');

        $produks = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/AdminProdukIndexPage', [
            'pagination' => fn() => $produks,
        ]);
    }
    public function produkCreate()
    {
        return Inertia::render('Admin/AdminProdukCreatePage', [
            'kategoriProduks' => fn() => KategoriProduk::select(['id', 'nama'])->orderBy('created_at', 'desc')->get(),
        ]);
    }
    public function produkDetails(Request $request, $id)
    {
        if (!$id) {
            abort(404);
        }

        $produk = Produk::find($id);

        if (!$produk) {
            abort(404);
        }

        return Inertia::render('Admin/AdminProdukDetailsPage', [
            'kategoriProduks' => fn() => KategoriProduk::select(['id', 'nama'])->orderBy('created_at', 'desc')->get(),
            'produk' => fn() => $produk->only(['id', 'sku', 'nama', 'deskripsi', 'harga', 'stok', 'gambar', 'kategori_produk_id']),
        ]);
    }

    public function statusPesananIndex(Request $request)
    {
        $viewPerPage = $this->getViewPerPage($request);

        $query = StatusPesanan::select(['id', 'nama', 'is_cancelable']);

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('created_at', 'desc');

        $statusPesanans = $query->paginate($viewPerPage)->withQueryString();
        return Inertia::render('Admin/AdminStatusPesananIndexPage', [
            'pagination' => fn() => $statusPesanans
        ]);
    }
    public function metodePembayaranIndex(Request $request)
    {
        $viewPerPage = $this->getViewPerPage($request);

        $query = MetodePembayaran::select(['id', 'nama', 'is_available']);

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $query->orderBy('created_at', 'desc');

        $metodePembayarans = $query->paginate($viewPerPage)->withQueryString();
        return Inertia::render('Admin/AdminMetodePembayaranIndexPage', [
            'pagination' => fn() => $metodePembayarans
        ]);
    }

    public function pesananIndex(Request $request)
    {
        $viewPerPage = $this->getViewPerPage($request);

        $query = Pesanan::select([
            'id',
            'pelanggan_id',
            'kode',
            'status_pesanan_id',
            'total',
            'metode_pembayaran_id',
            'tanggal_pesanan',
            'alamat_pengiriman',
        ])
            ->with([
                'pelanggan:id,nama',
                'metode_pembayaran:id,nama',
                'status_pesanan:id,nama',
            ]);

        $search = $request->query('search');
        if ($search) {
            $query->where('kode', 'like', '%' . $search . '%');
        }

        $query->orderBy('created_at', 'desc');

        $pesanans = $query->paginate($viewPerPage)->withQueryString();
        return Inertia::render('Admin/AdminPesananIndexPage', [
            'pagination' => fn() => $pesanans,
            'statusPesanans' => StatusPesanan::select(['id', 'nama'])->get()
        ]);
    }
}
