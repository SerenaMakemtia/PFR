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

        if ($request->filled('prénom')) {
            $query->where('prénom', 'like', '%' . $request->prénom . '%');
        }

        if ($request->filled('dateNaissance')) {
            $query->whereDate('dateNaissance', $request->dateNaissance);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prénom' => 'required|string|max:255',
            'dateNaissance' => 'required|date',
            'adresse' => 'nullable|string',
            'numéroTéléphone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'sexe' => 'nullable|in:M,F',
            'groupeSanguin' => 'nullable|string|max:3',
        ]);

        return Patient::create($validated);
    }

    public function show($id)
    {
        return Patient::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prénom' => 'sometimes|string|max:255',
            'dateNaissance' => 'sometimes|date',
            'adresse' => 'nullable|string',
            'numéroTéléphone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'sexe' => 'nullable|in:M,F',
            'groupeSanguin' => 'nullable|string|max:3',
        ]);

        $patient->update($validated);

        return $patient;
    }

    public function destroy($id)
    {
        Patient::destroy($id);
        return response()->json(['message' => 'Patient supprimé']);
    }
}
?>
