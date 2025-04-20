<?php

namespace Database\Seeders;

use App\Models\StatusPesanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusPesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statusPesanans = [
            [
                'nama' => 'Menunggu Persetujuan',
                'is_cancelable' => true,
            ],
            [
                'nama' => 'Diproses',
                'is_cancelable' => true,
            ],
            [
                'nama' => 'Dikirim',
                'is_cancelable' => false,
            ],
            [
                'nama' => 'Menunggu Pengambilan',
                'is_cancelable' => false,
            ]
        ];

        foreach ($statusPesanans as $statusPesanan) {
            StatusPesanan::create([
                'nama' => $statusPesanan['nama'],
                'is_cancelable' => $statusPesanan['is_cancelable'],
            ]);
        }
    }
}
