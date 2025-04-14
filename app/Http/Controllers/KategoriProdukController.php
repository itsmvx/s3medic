<?php

namespace App\Http\Controllers;

use App\Models\KategoriProduk;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KategoriProdukController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|unique:kategori_produk,nama',
        ]);

        try {
            KategoriProduk::create([
                'nama' => $validated['nama'],
            ]);
            return response()->json([
                'message' => 'Kategori Produk berhasil ditambahkan',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function update(Request $request)
    {
        //https://laravel.com/docs/11.x/validation ( #Forcing a Unique Rule to Ignore a Given ID )
        $validated = $request->validate([
            'id' => 'required|exists:kategori_produk,id',
            'nama' => [
                'required',
                Rule::unique('kategori_produk', 'nama')->ignore($request->id),
            ],
        ]);

        try {
            KategoriProduk::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
            ]);
            return response()->json([
                'message' => 'Kategori Produk berhasil diperbarui',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:kategori_produk,id',
        ]);

        try {
            KategoriProduk::where('id', $validated['id'])->delete();
            return response()->json([
                'message' => 'Kategori Produk berhasil dihapus',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
}
