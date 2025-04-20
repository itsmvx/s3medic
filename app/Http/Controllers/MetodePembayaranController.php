<?php

namespace App\Http\Controllers;

use App\Models\MetodePembayaran;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class MetodePembayaranController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'is_available' => 'nullable|boolean',
        ]);

        $data = [
            'nama' => $validated['nama'],
        ];

        if (array_key_exists('is_available', $validated)) {
            $data['is_available'] = $validated['is_available'];
        }

        try {
            MetodePembayaran::create($data);

            return response()->json([
                'message' => 'Metode Pembayaran Berhasil Ditambahkan',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:metode_pembayaran,id',
            'nama' => 'required|string',
            'is_available' => 'nullable|boolean',
        ]);

        $data = [
            'id' => $validated['id'],
            'nama' => $validated['nama'],
        ];

        if (array_key_exists('is_available', $validated)) {
            $data['is_available'] = $validated['is_available'];
        }

        try {
            MetodePembayaran::where('id', $validated['id'])
                ->update($data);

            return response()->json([
                'message' => 'Metode Pembayaran Berhasil diperbarui',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:metode_pembayaran,id',
            'status' => 'required|boolean',
        ]);

        try {
            MetodePembayaran::where('id', $validated['id'])->update([
                'is_available' => $validated['status']
            ]);

            return response()->json([
                'message' => 'Status Metode Pembayaran berhasil diperbarui'
            ]);
        } catch (QueryException $exception) {
            return $this->queryExceptionResponse($exception);
        }
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:metode_pembayaran,id',
        ]);

        try {
            MetodePembayaran::where('id', $validated['id'])
                ->delete();
            return response()->json([
                'message' => 'Metode Pembayaran Berhasil dihapus',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
}
