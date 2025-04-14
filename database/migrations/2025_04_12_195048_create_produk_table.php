<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi');
            $table->integer('stok')->default(0);
            $table->integer('harga')->default(0);
            $table->string('gambar')->nullable();
            $table->foreignId('kategori_produk_id')->constrained('kategori_produk');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
