<?php
namespace App\Http\Controllers;

use App\Models\Medecin;
use Illuminate\Http\Request;

class MedecinController extends Controller
{
    public function index(Request $request)
    {
        $query = Medecin::query();

        if ($request->filled('nom')) {
            $query->where('nom', 'like', '%' . $request->nom . '%');
        }

        if ($request->filled('spécialité')) {
            $query->where('spécialité', 'like', '%' . $request->spécialité . '%');
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prénom' => 'required|string|max:255',
            'spécialité' => 'nullable|string',
            'numéroTéléphone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'établissementID' => 'nullable|integer',
        ]);

        return Medecin::create($validated);
    }

    public function show($id)
    {
        return Medecin::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $medecin = Medecin::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prénom' => 'sometimes|string|max:255',
            'spécialité' => 'nullable|string',
            'numéroTéléphone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'établissementID' => 'nullable|integer',
        ]);

        $medecin->update($validated);

        return $medecin;
    }

    public function destroy($id)
    {
        Medecin::destroy($id);
        return response()->json(['message' => 'Médecin supprimé']);
    }
}
?>