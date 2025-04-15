<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;

class RendezVousController extends Controller
{
    public function index(Request $request)
    {
        $query = RendezVous::query();

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patientID' => 'required|integer',
            'médecinID' => 'required|integer',
            'date' => 'required|date',
            'heure' => 'required',
            'motif' => 'nullable|string',
        ]);

        return RendezVous::create($validated);
    }

    public function show($id)
    {
        return RendezVous::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $rdv = RendezVous::findOrFail($id);

        $validated = $request->validate([
            'patientID' => 'sometimes|integer',
            'médecinID' => 'sometimes|integer',
            'date' => 'sometimes|date',
            'heure' => 'sometimes',
            'motif' => 'nullable|string',
        ]);

        $rdv->update($validated);

        return $rdv;
    }

    public function destroy($id)
    {
        RendezVous::destroy($id);
        return response()->json(['message' => 'Rendez-vous supprimé']);
    }
}
?>