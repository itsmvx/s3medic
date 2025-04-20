<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $dataPDF;

    /**
     * Create a new message instance.
     */
    public function __construct($data, $dataPDF)
    {
        $this->data = $data;
        $this->dataPDF = $dataPDF;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->data['subject'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.send-mail',
            with: [
                'nama' => $this->data['nama'],
                'tanggal' => $this->dataPDF['tanggal'],
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.rekap-transaksi', $this->dataPDF);

        return [
            Attachment::fromData(fn () => $pdf->output(), 'rekap-transaksi.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
