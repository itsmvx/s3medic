<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KategoriProdukController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProfileController;
use App\Models\Keranjang;
use App\Models\Produk;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'newestProducts' => fn() => Produk::select(['id', 'slug', 'nama', 'deskripsi', 'harga', 'stok', 'gambar'])->orderBy('created_at', 'desc')->take(4)->get(),
    ]);
});
Route::get('/login', function () { return Inertia::render('LoginPage'); })->name('auth.login');
Route::get('/login-admin', function () { return Inertia::render('LoginAdminPage'); })->name('auth.login-admin');
Route::get('/register', function () {
    $response = Http::get('https://api-wilayah.elusiveness.my.id/api/provinces.json');
    return Inertia::render('RegisterPage', [
        'provinces' => $response->json()
    ]);
})->name('auth.register');

Route::prefix('auth')->name('auth.')->group(function () {

    Route::post('/admin', [AuthController::class, 'authAdmin'])->name('admin');
    Route::post('/pelanggan', [AuthController::class, 'authPelanggan'])->name('pelanggan');
});

Route::get('/store', function (\Illuminate\Http\Request $request) {
    $queryProducts = Produk::select(['id', 'slug', 'nama', 'deskripsi', 'harga', 'stok', 'gambar', 'kategori_produk_id'])
        ->with('kategori_produk:id,nama');
    $search = $request->query('search');
    if ($search) {
        $queryProducts->where('nama', 'like', '%' . $search . '%');
    }

    $kategoriProdukIds = explode(',', $request->query('categories'));
    if (!empty($kategoriProdukIds[0])) {
        $queryProducts->whereHas('kategori_produk', function ($query) use ($kategoriProdukIds) {
            $query->whereIn('id', $kategoriProdukIds);
        });
    }

    return Inertia::render('ShopPage', [
        'kategoriProduks' => fn() => \App\Models\KategoriProduk::select(['id', 'nama'])->get(),
        'produks' => fn() => $queryProducts->get()
    ]);
})->name('store');
Route::get('/cart', function () {
    return Inertia::render('CartPage', [
        'cartProducts' => Keranjang::select([
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
            ->get()
    ]);
})->name('cart');

Route::prefix('wilayah')->name('wilayah.')->group(function () {
    Route::get('/regencies/{province_id}', function ($province_id) {
        try {
            $response = Http::get('https://api-wilayah.elusiveness.my.id/api/regencies/' . $province_id . '.json');

            if ($response->successful()) {
                return response()->json($response->json(), 200);
            }

            return response()->json([
                'message' => 'Gagal mengambil data dari API.'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan.'
            ], 500);
        }
    })->name('regencies');
    Route::get('/districts/{regency_id}', function ($regency_id) {
        try {
            $response = Http::get('https://api-wilayah.elusiveness.my.id/api/districts/' . $regency_id . '.json');

            if ($response->successful()) {
                return response()->json($response->json(), 200);
            }

            return response()->json([
                'message' => 'Gagal mengambil data dari API.'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan.'
            ], 500);
        }
    })->name('districts');
    Route::get('/villages/{village_id}', function ($district_id) {
        try {
            $response = Http::get('https://api-wilayah.elusiveness.my.id/api/villages/' . $district_id . '.json');

            if ($response->successful()) {
                return response()->json($response->json(), 200);
            }

            return response()->json([
                'message' => 'Gagal mengambil data dari API.'
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Server gagal memproses permintaan.'
            ], 500);
        }
    })->name('villages');
});

Route::prefix('kategori-produk')->name('kategori-produk.')->group(function () {
    Route::post('/create', [KategoriProdukController::class, 'store'])->name('create');
    Route::post('/update', [KategoriProdukController::class, 'update'])->name('update');
    Route::post('/delete', [KategoriProdukController::class, 'destroy'])->name('delete');
});
Route::prefix('produk')->name('produk.')->group(function () {
    Route::post('/create', [ProdukController::class, 'store'])->name('create');
    Route::post('/update', [ProdukController::class, 'update'])->name('update');
    Route::post('/delete', [ProdukController::class, 'destroy'])->name('delete');
});
Route::prefix('pelanggan')->name('pelanggan.')->group(function () {
    Route::post('/create', [PelangganController::class, 'store'])->name('create');
    Route::post('/update', [PelangganController::class, 'update'])->name('update');
    Route::post('/delete', [PelangganController::class, 'destroy'])->name('delete');
});
Route::prefix('keranjang')->name('keranjang.')->group(function () {
    Route::post('/create', [KeranjangController::class, 'store'])->name('create');
    Route::post('/delete', [KeranjangController::class, 'destroy'])->name('delete');
    Route::post('/increment', [KeranjangController::class, 'increment'])->name('increment');
    Route::post('/decrement', [KeranjangController::class, 'decrement'])->name('decrement');
});

require __DIR__.'/admin.php';
