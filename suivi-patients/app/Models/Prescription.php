<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $table = 'prescriptions';

    protected $fillable = [
        'medecinID', 'patientID', 'medicament', 'dosage', 'duree', 'datePrescription'
    ];

    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'medecinID');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patientID');
    }
}

?>