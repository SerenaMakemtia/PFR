<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EtablissementSante extends Model
{
    use HasFactory;

    protected $table = 'etablissement_santes';

    protected $fillable = [
        'nom', 'adresse', 'numero_telephone', 'email'
    ];

    public function medecins()
    {
        return $this->hasMany(Medecin::class, 'etablissementID');
    }

    public function infirmiers()
    {
        return $this->hasMany(Infirmier::class, 'etablissementID');
    }
}
?>