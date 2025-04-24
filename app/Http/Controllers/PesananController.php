<?php

namespace App\Http\Controllers;

use App\Mail\SendMail;
use App\Models\Keranjang;
use App\Models\Pesanan;
use App\Models\Produk;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PesananController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pelanggan_id' => 'required|exists:pelanggan,id',
            'kode' => 'nullable|string',
            'total' => 'required|numeric',
            'metode_pembayaran_id' => 'required|exists:metode_pembayaran,id',
            'status_pesanan_id' => 'required|exists:status_pesanan,id',
            'tanggal_pesanan' => 'required|date',
            'alamat_pengiriman' => 'nullable|string',
            'transaksi' => 'array'
        ]);

        $kode = $validated['kode'] ?? strtoupper(Str::random(8));
        $alamat_pengiriman = $validated['alamat_pengiriman'] ?? Str::random(8);

        try {
            DB::beginTransaction();
            $pesanan = Pesanan::create([
                'pelanggan_id' => $validated['pelanggan_id'],
                'kode' => $kode,
                'total' => $validated['total'],
                'metode_pembayaran_id' => $validated['metode_pembayaran_id'],
                'status_pesanan_id' => $validated['status_pesanan_id'],
                'tanggal_pesanan' => Carbon::parse($validated['tanggal_pesanan']),
                'alamat_pengiriman' => $alamat_pengiriman
            ]);
            Keranjang::where('pelanggan_id', $validated['pelanggan_id'])->delete();
            foreach ($validated['transaksi'] as $item) {
                Produk::where('id', $item['produk_id'])->decrement('stok', $item['jumlah']);
            }

            DB::commit();

            $dataPDF = [
                'user_id' => $validated['pelanggan_id'],
                'nama' => $pesanan->pelanggan->nama,
                'alamat' => $pesanan->pelanggan->alamat,
                'no_hp' => $pesanan->pelanggan->no_telp,
                'tanggal' => Carbon::parse($pesanan->tanggal_pesanan)->toDateString(),
                'id_paypal' => $pesanan->pelanggan->email,
                'nama_bank' => '-',
                'cara_bayar' => $pesanan->metode_pembayaran->nama,
                'transaksi' => $validated['transaksi'],
                'id_transaksi' => $pesanan->kode,
                'total_belanja' => $pesanan->total,
            ];

            $pdf = Pdf::loadView('pdf.rekap-transaksi', $dataPDF);

            $data = [
                'subject' => "📢 Notifikasi Pesanan : ". $pesanan->kode,
                'nama' => $pesanan->pelanggan->nama,
            ];
            Mail::to($pesanan->pelanggan->email)->send(new SendMail($data, $dataPDF));
            $pdf->download('rekap-transaksi.pdf');
            return response()->json([
                'message' => 'Pesanan berhasil ditambahkan'
            ]);
        } catch (QueryException $queryException) {
            DB::rollBack();
            return $this->queryExceptionResponse($queryException);
        }

    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:pesanan,id',
            'pelanggan_id' => 'required|exists:pelanggan,id',
            'kode' => 'required|string',
            'total' => 'required|numeric',
            'metode_pembayaran_id' => 'required|exists:metode_pembayaran,id',
            'tanggal_pesanan' => 'required|date',
            'alamat_pengiriman' => 'required|string'
        ]);

        try {
            Pesanan::where('id', $validated['id'])->update([
                'pelanggan_id' => $validated['pelanggan_id'],
                'kode' => $validated['kode'],
                'total' => $validated['total'],
                'metode_pembayaran_id' => $validated['metode_pembayaran_id'],
                'tanggal_pesanan' => $validated['tanggal_pesanan'],
                'alamat_pengiriman' => $validated['alamat_pengiriman']
            ]);

            return response()->json([
                'message' => 'Pesanan berhasil diperbarui'
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:pesanan,id',
            'status_pesanan_id' => 'required|exists:status_pesanan,id',
        ]);

        try {
            Pesanan::where('id', $validated['id'])->update([
                'status_pesanan_id' => $validated['status_pesanan_id'],
            ]);
            return response()->json([
                'message' => 'Status Pesanan berhasil diperbarui'
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:pesanan,id',
        ]);

        try {
            Pesanan::where('id', $validated['id'])->delete();
            return response()->json([
                'message' => 'Pesanan berhasil dihapus'
            ]);
        } catch (QueryException $queryException) {
            return $this->queryExceptionResponse($queryException);
        }
    }
}
