<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekap Transaksi</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f3f3f3; }

        .field-table { width: 100%; margin-bottom: 20px; }
        .field-table td { padding: 4px 8px; border: none; vertical-align: top; }
        .field-label { font-weight: bold; width: 120px; }

        .footer-table { width: 100% }
        .footer-table td { padding: 4px 8px; border: none; vertical-align: top; }
    </style>
</head>
<body>
<h2>Rekap Transaksi</h2>

<!-- Informasi User -->
<table class="field-table">
    <tr>
        <td class="field-label">User ID</td>
        <td>: {{ $user_id }}</td>

        <td class="field-label">Tanggal</td>
        <td>: {{ $tanggal }}</td>
    </tr>
    <tr>
        <td class="field-label">Nama</td>
        <td>: {{ $nama }}</td>

        <td class="field-label">ID Paypal</td>
        <td style="white-space: pre-line">: {{ $id_paypal }}</td>
    </tr>
    <tr>
        <td class="field-label">Alamat</td>
        <td>: {{ $alamat }}</td>

        <td class="field-label">Nama Bank</td>
        <td>: {{ $nama_bank }}</td>
    </tr>
    <tr>
        <td class="field-label">No. HP</td>
        <td>: {{ $no_hp }}</td>

        <td class="field-label">Cara Bayar</td>
        <td>: {{ $cara_bayar }}</td>
    </tr>
</table>

<!-- Tabel Transaksi -->
<table>
    <thead>
    <tr>
        <th>No</th>
        <th>Produk</th>
        <th>Jumlah</th>
        <th>Harga</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($transaksi as $index => $t)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $t['nama'] }}</td>
            <td>{{ $t['jumlah'] }}</td>
            <td>Rp{{ number_format($t['harga'], 0, ',', '.') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<!-- Footer Area -->
<table class="footer-table">
    <tr>
        <td style="width: 100%">
            Total Belanja (termasuk pajak) : Rp{{ number_format($total_belanja, 0, ',', '.') }}
        </td>
    </tr>
    <tr>
        <!-- Kiri: ID Transaksi -->
        <td style="width: 50%;">
            Kode Transaksi: <strong>{{ $id_transaksi }}</strong>
        </td>

        <!-- Kanan: Tempat Tanda Tangan -->
        <td style="width: 50%; text-align: right;">
            <div style="display: inline-block; text-align: center;">
                <div style="margin-bottom: 60px;">&nbsp;</div> <!-- Space untuk tanda tangan -->
                <div style="border-top: 1px solid #000; width: 200px; margin-left: auto;">
                    Tanda Tangan
                </div>
            </div>
        </td>
    </tr>
</table>

</body>
</html>
