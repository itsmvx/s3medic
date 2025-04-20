<?php

use App\Http\Controllers\Pages\PelangganPagesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('pelanggan')->name('pelanggan.')->group(function () {
    Route::get('/profile', [PelangganPagesController::class, 'profile'])->name('profile');
    Route::prefix('status-pesanan')->name('status-pesanan.')->group(function () {

    });
    Route::prefix('pesanan')->name('pesanan.')->group(function () {

    });
    Route::prefix('pelanggan')->name('pelanggan.')->group(function () {

    });
});
