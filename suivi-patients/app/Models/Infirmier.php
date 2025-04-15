<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Infirmier extends Model
{
    use HasFactory;

    protected $table = 'infirmiers';

    protected $fillable = [
        'nom', 'prenom', 'specialite', 'numero_telephone', 'email', 'etablissementID'
    ];

    public function etablissement()
    {
        return $this->belongsTo(EtablissementSante::class, 'etablissementID');
    }
}
?>