<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use App\Models\CompteUtilisateur;
use App\Models\Medecin;
use App\Models\Infirmier;
use App\Models\Patient;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:compte_utilisateurs,email',
            'password' => 'required|confirmed|min:6',
            'role'     => 'required|in:admin,medecin,infirmier,patient',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Création du compte utilisateur
        $compte = CompteUtilisateur::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => $request->role,
        ]);

        // Création du profil associé selon le rôle
        switch ($request->role) {
            case 'medecin':
                Medecin::create(['compte_utilisateur_id' => $compte->id]);
                break;
            case 'infirmier':
                Infirmier::create(['compte_utilisateur_id' => $compte->id]);
                break;
            case 'patient':
                Patient::create(['compte_utilisateur_id' => $compte->id]);
                break;
        }

        return response()->json([
            'message' => 'Compte utilisateur créé',
            'compte'  => $compte
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $compte = CompteUtilisateur::where('email', $request->email)->first();

        if (! $compte || ! Hash::check($request->password, $compte->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        $token = $compte->createToken('medicare-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token'   => $token,
            'compte'  => $compte,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
?>