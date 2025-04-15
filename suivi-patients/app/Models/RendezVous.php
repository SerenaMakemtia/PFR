<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'patientID', 'medecinID', 'date', 'heure', 'motif'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patientID');
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'medecinID');
    }
}
?>