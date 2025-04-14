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
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelanggan_id')->constrained('pelanggan')->cascadeOnDelete();

            $table->string('kode')->unique();
            $table->foreignId('status_pesanan_id')->nullable()->constrained('status_pesanan')->nullOnDelete();
            $table->integer('total')->default(0);
            $table->string('metode_pembayaran')->nullable();
            $table->timestamp('tanggal_pesanan')->useCurrent();
            $table->string(  'alamat_pengiriman');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
