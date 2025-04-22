<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $table = 'prescriptions';

    protected $fillable = [
        'medecin_id', 
        'patient_id', 
        'medicaments', 
        'date'
    ];

    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'medecin_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
    
    // Accesseur pour rétrocompatibilité
    public function getMedicamentAttribute()
    {
        return $this->medicaments;
    }
    
    public function setMedicamentAttribute($value)
    {
        $this->attributes['medicaments'] = $value;
    }
}

?>