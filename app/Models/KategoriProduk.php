<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriProduk extends Model
{
    protected $table = 'kategori_produk';
    protected $guarded = ['id'];

    public function produk(): HasMany
    {
        return $this->hasMany(Produk::class, 'kategori_produk_id');
    }
}
