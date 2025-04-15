<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients'; // nom de la table

    protected $fillable = [
        'nom', 'prenom', 'date_naissance', 'adresse', 'numero_telephone',
        'email', 'sexe', 'groupe_sanguin'
    ];

    public function dossiersMedicaux()
    {
        return $this->hasMany(DossierMedical::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}

?>
