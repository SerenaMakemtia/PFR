<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    use HasFactory;

    protected $table = 'medecins';

    protected $fillable = [
        'nom', 
        'prenom', 
        'specialite', 
        'etablissement_sante_id'
    ];

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'medecin_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'medecin_id');
    }

    public function etablissementSante()
    {
        return $this->belongsTo(EtablissementSante::class, 'etablissement_sante_id');
    }
    
    public function compteUtilisateur()
    {
        return $this->morphOne(CompteUtilisateur::class, 'personne');
    }
}
?>