<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DossierMedical extends Model
{
    use HasFactory;

    protected $table = 'dossier_medicals';

    protected $fillable = [
        'patient_id', 
        'historique',
        'antecedents',
        'allergies',
        'traitements'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
    
    // Nous ajoutons ces méthodes pour garantir la compatibilité avec le code existant
    public function getAntecedentsAttribute()
    {
        return $this->historique ?? '';
    }
    
    public function setAntecedentsAttribute($value)
    {
        $this->attributes['historique'] = $value;
    }
}
?>