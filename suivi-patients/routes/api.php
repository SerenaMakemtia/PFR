<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Importation des contrôleurs
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\EtablissementSanteController;
use App\Http\Controllers\InfirmierController;

// Petite route de test
Route::get('/test', function () {
    return response()->json(['message' => 'API fonctionnelle 😎']);
});

// Routes API pour chaque ressource
Route::apiResource('patients', PatientController::class);
Route::apiResource('medecins', MedecinController::class);
Route::apiResource('rendez-vous', RendezVousController::class);
Route::apiResource('prescriptions', PrescriptionController::class);
Route::apiResource('etablissements', EtablissementSanteController::class);
Route::apiResource('infirmiers', InfirmierController::class);
