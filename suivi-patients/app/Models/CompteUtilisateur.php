<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompteUtilisateur extends Model
{
    use HasFactory;

    protected $table = 'compte_utilisateurs';

    protected $fillable = [
        'identifiant', 'motDePasse', 'rôle', 'personneID', 'typePersonne'
    ];

    //  Les relations ici sont à gérer dynamiquement selon typePersonne
    // je vais faire une méthode personnalisée plus tard pour ça
}
?>