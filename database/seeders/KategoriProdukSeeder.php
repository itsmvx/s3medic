<?php

namespace Database\Seeders;

use App\Models\KategoriProduk;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KategoriProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoriProduks = [
            'Alat Diagnostik',
            'Terapi dan Perawatan',
            'Alat Bedah',
            'Alat Laboratorium',
            'Alat Gigi dan Mulut'
        ];

        foreach ($kategoriProduks as $kategoriProduk) {
            KategoriProduk::create([
                'nama' => $kategoriProduk
            ]);
        }
    }
}
