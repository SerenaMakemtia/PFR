<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'nom', 
        'prenom', 
        'date_naissance', 
        'sexe', 
        'adresse', 
        'telephone'
    ];

    public function dossierMedical()
    {
        return $this->hasOne(DossierMedical::class, 'patient_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'patient_id');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'patient_id');
    }
    
    public function compteUtilisateur()
    {
        return $this->morphOne(CompteUtilisateur::class, 'personne');
    }
}

?>
