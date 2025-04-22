<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import de tous tes contrôleurs
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RendezvousController;
use App\Http\Controllers\InfirmierController;
use App\Http\Controllers\EtablissementSanteController;
use App\Http\Controllers\DossierMedicalController;
// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Médecins
    Route::apiResource('medecins', MedecinController::class);

    // Patients
    Route::apiResource('patients', PatientController::class);

    // Prescriptions
    Route::apiResource('prescriptions', PrescriptionController::class);

    // Profils
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Rendez-vous
    Route::apiResource('rendezvous', RendezvousController::class);

    // Infirmiers
    Route::apiResource('infirmiers', InfirmierController::class);

    // Établissements
    Route::apiResource('etablissements', EtablissementSanteController::class);

    // Dossiers médicaux
    Route::apiResource('dossiersmedicaux', DossierMedicalController::class);
});


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();

});
?>
