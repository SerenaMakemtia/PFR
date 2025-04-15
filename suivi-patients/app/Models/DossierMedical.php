<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DossierMedical extends Model
{
    use HasFactory;

    protected $table = 'dossier_medicaux';

    protected $fillable = [
        'patientID', 'antecedents', 'allergies', 'traitements', 'notes'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patientID');
    }
}
?>