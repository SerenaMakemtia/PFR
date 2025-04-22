<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class CompteUtilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'compte_utilisateurs';

    protected $fillable = [
        'email', 
        'mot_de_passe', 
        'role'
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    // Relation polymorphique
    public function personne()
    {
        return $this->morphTo('personne', 'role', 'id');
    }
    
    // Accesseurs
    public function getMorphClass()
    {
        return $this->role;
    }
    
    // Surcharge du setter pour hacher le mot de passe
    public function setMotDePasseAttribute($value)
    {
        $this->attributes['mot_de_passe'] = bcrypt($value);
    }
}
?>