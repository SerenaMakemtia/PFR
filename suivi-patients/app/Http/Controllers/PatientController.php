<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::query();

        if ($request->filled('nom')) {
            $query->where('nom', 'like', '%' . $request->nom . '%');
        }

        if ($request->filled('prenom')) {
            $query->where('prenom', 'like', '%' . $request->prenom . '%');
        }

        if ($request->filled('date_naissance')) {
            $query->whereDate('date_naissance', $request->date_naissance);
        }

        // Pagination pour de meilleures performances
        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'sexe' => 'required|string|in:M,F',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:20',
        ]);

        return Patient::create($validated);
    }

    public function show($id)
    {
        return Patient::with(['dossierMedical', 'rendezVous.medecin', 'prescriptions.medecin'])
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'date_naissance' => 'sometimes|date',
            'sexe' => 'sometimes|string|in:M,F',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:20',
        ]);

        $patient->update($validated);

        return $patient;
    }

    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();
        
        return response()->json(['message' => 'Patient supprimé avec succès']);
    }
    
    public function search(Request $request)
    {
        $query = Patient::query();

        if ($request->has('term')) {
            $term = $request->term;
            $query->where(function($q) use ($term) {
                $q->where('nom', 'like', "%{$term}%")
                  ->orWhere('prenom', 'like', "%{$term}%");
            });
        }

        return $query->limit(10)->get(['id', 'nom', 'prenom', 'date_naissance']);
    }
}
?>
