<?php
namespace App\Http\Controllers;

use App\Models\DossierMedical;
use Illuminate\Http\Request;

class DossierMedicaleController extends Controller
{
    public function index(Request $request)
    {
        $query = DossierMedical::query();

        if ($request->filled('patientID')) {
            $query->where('patientID', $request->patientID);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patientID' => 'required|integer',
            'antécédents' => 'nullable|string',
            'allergies' => 'nullable|string',
            'traitements' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DossierMedical::create($validated);
    }

    public function show($id)
    {
        return DossierMedical::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $dossier = DossierMedical::findOrFail($id);

        $validated = $request->validate([
            'patientID' => 'sometimes|integer',
            'antécédents' => 'nullable|string',
            'allergies' => 'nullable|string',
            'traitements' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $dossier->update($validated);

        return $dossier;
    }

    public function destroy($id)
    {
        DossierMedical::destroy($id);
        return response()->json(['message' => 'Dossier médical supprimé']);
    }
}
?>