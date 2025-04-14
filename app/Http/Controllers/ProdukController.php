<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use function Symfony\Component\Translation\t;

class ProdukController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'slug' => 'required|unique:produk,slug',
            'sku' => 'required|unique:produk,sku',
            'deskripsi' => 'required',
            'stok' => 'required',
            'harga' => 'required',
            'kategori_produk_id' => 'required|exists:kategori_produk,id',
            'gambar' => 'nullable|file|mimes:jpeg,png,jpg|max:5120'
        ]);

        try {
            $extension = $request->file('gambar')->getClientOriginalExtension();
            $filename = Str::slug(Str::uuid()->toString()) . '.' . $extension;

            $gambarPath = $request->file('gambar')->storeAs('/', $filename, 'produk');

            Produk::create([
                'nama' => $validated['nama'],
                'slug' => $validated['slug'],
                'sku' => $validated['sku'],
                'deskripsi' => $validated['deskripsi'],
                'stok' => $validated['stok'],
                'harga' => $validated['harga'],
                'kategori_produk_id' => $validated['kategori_produk_id'],
                'gambar' => $gambarPath,
            ]);
            return response()->json([
                'message' => 'Produk berhasil ditambahkan'
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:produk,id',
            'nama' => 'required',
            'slug' => ['required', Rule::unique('produk', 'slug')->ignore($request->id)],
            'sku' => ['required', Rule::unique('produk', 'sku')->ignore($request->id)],
            'deskripsi' => 'required',
            'stok' => 'required',
            'harga' => 'required',
            'kategori_produk_id' => 'required|exists:kategori_produk,id',
        ]);

        try {
            Produk::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'slug' => $validated['slug'],
                'sku' => $validated['sku'],
                'deskripsi' => $validated['deskripsi'],
                'stok' => $validated['stok'],
                'harga' => $validated['harga'],
                'kategori_produk_id' => $validated['kategori_produk_id'],
            ]);
            return response()->json([
                'message' => 'Produk berhasil diperbarui'
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:produk,id',
        ]);

        try {
            Produk::where('id', $validated['id'])->delete();
            Storage::disk('produk')->delete($validated['id']);
            return response()->json([
                'message' => 'Produk berhasil dihapus'
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
}
