<?php

use App\Http\Controllers\Pages\AdminPagesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminPagesController::class, 'dashboard'])->name('dashboard');

    Route::prefix('kategori-produk')->name('kategori-produk.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'kategoriProdukIndex'])->name('index');
    });
    Route::prefix('produk')->name('produk.')->group(function () {
        Route::get('/', [AdminPagesController::class, 'produkIndex'])->name('index');
        Route::get('/create', [AdminPagesController::class, 'produkCreate'])->name('create');
        Route::get('/details/{id}', [AdminPagesController::class, 'produkDetails'])->name('details');
    });
    Route::prefix('status-pesanan')->name('status-pesanan.')->group(function () {

    });
    Route::prefix('pesanan')->name('pesanan.')->group(function () {

    });
    Route::prefix('pelanggan')->name('pelanggan.')->group(function () {

    });
});
