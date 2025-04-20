<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodePembayaran extends Model
{
    protected $table = 'metode_pembayaran';
    protected $guarded = ['id'];
    protected $casts = [
        'is_available' => 'boolean',
    ];
    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'metode_pembayaran_id');
    }
}
