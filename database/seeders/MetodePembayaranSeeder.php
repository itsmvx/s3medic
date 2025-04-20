<?php

namespace Database\Seeders;

use App\Models\MetodePembayaran;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MetodePembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $metodePembayarans = [
            [
                'nama' => 'Tunai',
                'is_available' => true,
            ],
            [
                'nama' => 'Paypal',
                'is_available' => false,
            ]
        ];

        foreach ($metodePembayarans as $metodePembayaran) {
            MetodePembayaran::create([
                'nama' => $metodePembayaran['nama'],
                'is_available' => $metodePembayaran['is_available'],
            ]);
        }
    }
}
