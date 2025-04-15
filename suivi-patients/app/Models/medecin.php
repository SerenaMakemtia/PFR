<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    use HasFactory;

    protected $table = 'medecins';

    protected $fillable = [
        'nom', 'prenom', 'specialite', 'numero_telephone', 'email', 'etablissementID'
    ];

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(EtablissementSante::class, 'etablissementID');
    }
}
?>