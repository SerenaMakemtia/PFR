<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EtablissementSante extends Model
{
    use HasFactory;

    protected $table = 'etablissement_santes';

    protected $fillable = [
        'nom', 
        'adresse', 
        'telephone'
    ];

    public function medecins()
    {
        return $this->hasMany(Medecin::class, 'etablissement_sante_id');
    }

    public function infirmiers()
    {
        return $this->hasMany(Infirmier::class, 'etablissement_sante_id');
    }
}
?>