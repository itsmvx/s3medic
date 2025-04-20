<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusPesanan extends Model
{
    protected $table = 'status_pesanan';
    protected $guarded = ['id'];
    protected $casts = [
        'is_cancelable' => 'boolean',
    ];
    public function pesanan()
    {
        return $this->hasMany(Pesanan::class, 'status_pesanan_id');
    }
}
