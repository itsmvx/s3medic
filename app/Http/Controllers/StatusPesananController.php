<?php

namespace App\Http\Controllers;

use App\Models\StatusPesanan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class StatusPesananController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'is_cancelable' => 'nullable|boolean',
        ]);

        $data = [
            'nama' => $validated['nama'],
        ];

        if (array_key_exists('is_cancelable', $validated)) {
            $data['is_cancelable'] = $validated['is_cancelable'];
        }

        try {
            StatusPesanan::create($data);

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
            'is_cancelable' => 'nullable|boolean',
        ]);

        $data = [
            'id' => $validated['id'],
            'nama' => $validated['nama'],
        ];

        if (array_key_exists('is_cancelable', $validated)) {
            $data['is_cancelable'] = $validated['is_cancelable'];
        }

        try {
            StatusPesanan::where('id', $validated['id'])
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
            'id' => 'required|exists:status_pesanan,id',
            'status' => 'required|boolean',
        ]);

        try {
            StatusPesanan::where('id', $validated['id'])->update([
                'is_cancelable' => $validated['status']
            ]);

            return response()->json([
                'message' => 'Pembatalan Status Pesanan berhasil diperbarui'
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
            StatusPesanan::where('id', $validated['id'])
                ->delete();
            return response()->json([
                'message' => 'Metode Pembayaran Berhasil dihapus',
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
}
