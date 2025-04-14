<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class PelangganController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'email' => 'required|email|unique:pelanggan,email',
            'username' => 'required|unique:pelanggan,username',
            'password' => 'required',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'alamat' => 'required',
            'no_telp' => 'required|numeric',
            'kode_wilayah' => 'required',
        ]);

        try {
            Pelanggan::create([
                'nama' => $validated['nama'],
                'email' => $validated['email'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password'], ['rounds' => 12]),
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'alamat' => $validated['alamat'],
                'no_telp' => $validated['no_telp'],
                'kode_wilayah' => $validated['kode_wilayah'],
            ]);

            return response()->json([
                'message' => 'Pelanggan berhasil ditambahkan',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:pelanggan,id',
            'nama' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('pelanggan', 'email')->ignore($request->id)
            ],
            'username' => [
                'required',
                Rule::unique('pelanggan', 'username')->ignore($request->id)
            ],
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'alamat' => 'required',
            'no_telp' => 'required|numeric',
            'kode_wilayah' => 'required',
        ]);

        try {
            Pelanggan::where('id', $validated['id'])->update([
                'nama' => $validated['nama'],
                'email' => $validated['email'],
                'username' => $validated['username'],
                'tanggal_lahir' => $validated['tanggal_lahir'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'alamat' => $validated['alamat'],
                'no_telp' => $validated['no_telp'],
                'kode_wilayah' => $validated['kode_wilayah'],
            ]);

            return response()->json([
                'message' => 'Pelanggan berhasil diperbarui',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:pelanggan,id',
        ]);

        try {
            Pelanggan::where('id', $validated['id'])->delete();
            return response()->json([
                'message' => 'Pelanggan berhasil dihapus',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
}
