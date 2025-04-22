<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RendezVousController extends Controller
{
    public function index(Request $request)
    {
        $query = RendezVous::with(['patient', 'medecin']);

        if ($request->filled('date')) {
            $query->whereDate('date_heure', $request->date);
        }
        
        if ($request->filled('medecin_id')) {
            $query->where('medecin_id', $request->medecin_id);
        }
        
        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'medecin_id' => 'required|exists:medecins,id',
            'date' => 'required|date_format:Y-m-d',
            'heure' => 'required|date_format:H:i',
            'motif' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Vérification de disponibilité du médecin
        $dateHeure = $request->date . ' ' . $request->heure;
        $exists = RendezVous::where('medecin_id', $request->medecin_id)
            ->whereRaw("DATE_FORMAT(date_heure, '%Y-%m-%d %H:00') = ?", [date('Y-m-d H:00', strtotime($dateHeure))])
            ->exists();
            
        if ($exists) {
            return response()->json([
                'message' => 'Le médecin n\'est pas disponible à cette heure'
            ], 422);
        }
        
        // Créer le rendez-vous
        $rdv = new RendezVous();
        $rdv->patient_id = $request->patient_id;
        $rdv->medecin_id = $request->medecin_id;
        $rdv->date_heure = $dateHeure;
        $rdv->motif = $request->motif;
        $rdv->save();

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'rendez_vous' => $rdv
        ]);
    }

    public function show($id)
    {
        return RendezVous::with(['patient', 'medecin'])
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $rdv = RendezVous::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|exists:patients,id',
            'medecin_id' => 'sometimes|exists:medecins,id',
            'date' => 'sometimes|date_format:Y-m-d',
            'heure' => 'sometimes|date_format:H:i',
            'motif' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Mise à jour conditionnelle des champs
        if ($request->filled('patient_id')) {
            $rdv->patient_id = $request->patient_id;
        }
        
        if ($request->filled('medecin_id')) {
            $rdv->medecin_id = $request->medecin_id;
        }
        
        if ($request->filled('date')) {
            $rdv->date = $request->date;
        }
        
        if ($request->filled('heure')) {
            $rdv->heure = $request->heure;
        }
        
        if ($request->has('motif')) {
            $rdv->motif = $request->motif;
        }
        
        $rdv->save();

        return response()->json([
            'message' => 'Rendez-vous mis à jour avec succès',
            'rendez_vous' => $rdv
        ]);
    }

    public function destroy($id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->delete();
        
        return response()->json(['message' => 'Rendez-vous supprimé avec succès']);
    }
}
?>