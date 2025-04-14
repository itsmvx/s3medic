<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\KategoriProduk;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminPagesController extends Controller
{
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
}
