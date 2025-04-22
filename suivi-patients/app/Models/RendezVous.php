<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'patient_id', 
        'medecin_id', 
        'date_heure', 
        'motif'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class, 'medecin_id');
    }
    
    // Accesseur pour rétrocompatibilité
    public function getDateAttribute()
    {
        return $this->date_heure ? date('Y-m-d', strtotime($this->date_heure)) : null;
    }
    
    public function getHeureAttribute()
    {
        return $this->date_heure ? date('H:i', strtotime($this->date_heure)) : null;
    }
    
    // Mutateur pour combiner date et heure
    public function setDateAttribute($value)
    {
        $heure = $this->getHeureAttribute() ?? '00:00';
        $this->attributes['date_heure'] = date('Y-m-d H:i:s', strtotime("$value $heure"));
    }
    
    public function setHeureAttribute($value)
    {
        $date = $this->getDateAttribute() ?? date('Y-m-d');
        $this->attributes['date_heure'] = date('Y-m-d H:i:s', strtotime("$date $value"));
    }
}

?>