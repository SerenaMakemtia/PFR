<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Infirmier extends Model
{
    use HasFactory;

    protected $table = 'infirmiers';

    protected $fillable = [
        'nom', 
        'prenom', 
        'etablissement_sante_id'
    ];

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