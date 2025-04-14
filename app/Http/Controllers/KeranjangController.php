<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class KeranjangController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pelanggan_id' => 'required|exists:pelanggan,id',
            'produk_id' => 'required|exists:produk,id',
        ]);

        try {
            $keranjang = Keranjang::where('pelanggan_id', $validated['pelanggan_id'])
                ->where('produk_id', $validated['produk_id'])
                ->first();

            if ($keranjang) {
                // Tambahkan 1 klo udah ada
                $keranjang->increment('jumlah');
            } else {
                // Belum ada, buat baru dengan jumlah = 1
                Keranjang::create([
                    'pelanggan_id' => $validated['pelanggan_id'],
                    'produk_id' => $validated['produk_id'],
                    'jumlah' => 1,
                ]);
            }

            return response()->json([
                'message' => 'Keranjang berhasil ditambahkan',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:keranjang,id',
        ]);

        try {
            Keranjang::where('id', $validated['id'])->delete();
            return response()->json([
                'message' => 'Berhasil dihapus',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function increment(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:keranjang,id',
        ]);

        try {
            Keranjang::where('id', $validated['id'])->first()->increment('jumlah');
            return response()->json([
                'message' => 'Berhasil ditambahkan',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function decrement(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:keranjang,id',
        ]);

        try {
            Keranjang::where('id', $validated['id'])->first()->decrement('jumlah');
            return response()->json([
                'message' => 'Berhasil dikurangi',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }

}
