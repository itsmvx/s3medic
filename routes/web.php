<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KategoriProdukController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\MetodePembayaranController;
use App\Http\Controllers\Pages\AdminPagesController;
use App\Http\Controllers\Pages\PelangganPagesController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatusPesananController;
use App\Mail\SendMail;
use App\Models\Keranjang;
use App\Models\Produk;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'newestProducts' => fn() => Produk::select(['id', 'slug', 'nama', 'deskripsi', 'harga', 'stok', 'gambar'])->orderBy('created_at', 'desc')->take(4)->get(),
    ]);
});
Route::get('/login', [PelangganPagesController::class, 'login'])->name('pelanggan.login');
Route::get('/login-admin', [AdminPagesController::class, 'login'])->name('admin.login');
Route::get('/register', function () {
    $response = Http::get('https://api-wilayah.elusiveness.my.id/api/provinces.json');
    return Inertia::render('RegisterPage', [
        'provinces' => $response->json()
    ]);
})->name('pelanggan.register');

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
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
Route::get('/product/{slug}', function (\Illuminate\Http\Request $request, $slug) {
    $authPelanggan = \Illuminate\Support\Facades\Auth::guard('pelanggan')->user();

    $product = Produk::where('slug', $slug)
        ->select([
            'id', 'slug', 'sku', 'nama', 'deskripsi', 'harga', 'stok', 'gambar', 'kategori_produk_id'
        ])
        ->with('kategori_produk:id,nama')
        ->first();

    if (!$product) {
        abort(404);
    }

    $jumlah_di_keranjang = 0;
    if ($authPelanggan) {
        $jumlah_di_keranjang = \App\Models\Keranjang::where('pelanggan_id', $authPelanggan->id)
            ->where('produk_id', $product->id)
            ->sum('jumlah');
    }

    $product->stok_tersedia = max(0, $product->stok - $jumlah_di_keranjang);

    $relatedProducts = Produk::whereNot('slug', $slug)
        ->where('kategori_produk_id', $product->kategori_produk_id)
        ->select(['id', 'slug', 'nama', 'harga', 'gambar'])
        ->limit(4)
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('ProductDetailsPage', [
        'product' => $product,
        'relatedProducts' => $relatedProducts
    ]);

})->name('product.details');
Route::get('/cart', [PelangganPagesController::class, 'cart'])->name('cart')->middleware('guard:pelanggan');

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
Route::prefix('metode-pembayaran')->name('metode-pembayaran.')->group(function () {
    Route::post('/create', [MetodePembayaranController::class, 'store'])->name('create');
    Route::post('/update', [MetodePembayaranController::class, 'update'])->name('update');
    Route::post('/update-status', [MetodePembayaranController::class, 'updateStatus'])->name('update-status');
    Route::post('/delete', [MetodePembayaranController::class, 'destroy'])->name('delete');
});
Route::prefix('status-pesanan')->name('status-pesanan.')->group(function () {
    Route::post('/create', [StatusPesananController::class, 'store'])->name('create');
    Route::post('/update', [StatusPesananController::class, 'update'])->name('update');
    Route::post('/update-status', [StatusPesananController::class, 'updateStatus'])->name('update-status');
    Route::post('/delete', [StatusPesananController::class, 'destroy'])->name('delete');
});
Route::prefix('pesanan')->name('pesanan.')->group(function () {
    Route::post('/create', [PesananController::class, 'store'])->name('create');
    Route::post('/update', [PesananController::class, 'update'])->name('update');
    Route::post('/update-status', [PesananController::class, 'updateStatus'])->name('update-status');
    Route::post('/delete', [PesananController::class, 'destroy'])->name('delete');
});


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

Route::get('/pdf', function () {
    $dataPDF = [
        'user_id' => '123456',
        'nama' => 'Vain',
        'alamat' => 'Jl. Kebangkitan No. 42',
        'no_hp' => '081234567890',
        'tanggal' => '2025-04-19',
        'id_paypal' => 'vain.paypal@gmail.com',
        'nama_bank' => 'Bank Mandiri',
        'cara_bayar' => 'Transfer Bank',
        'transaksi' => [
            ['nama' => 'First Aid Kit', 'jumlah' => 1, 'harga' => 219000],
            ['nama' => 'Bandage', 'jumlah' => 3, 'harga' => 90000],
        ],
        'id_transaksi' => '2401-556-762'
    ];

    $pdf = Pdf::loadView('pdf.rekap-transaksi', $dataPDF);

    $data = [
        'subject' => "📢 Notifikasi Pesanan : 2401-556-762",
        'nama' => 'Elaina Annisa Zahra',
    ];
    Mail::to('xenovhru@gmail.com')->send(new SendMail($data, $dataPDF));
    return $pdf->download('rekap-transaksi.pdf');

});

require __DIR__.'/admin.php';
require __DIR__.'/pelanggan.php';
