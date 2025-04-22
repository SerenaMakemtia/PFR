<?php
namespace App\Http\Controllers;

use App\Models\DossierMedical;
use Illuminate\Http\Request;

class DossierMedicalController extends Controller
{
    public function index(Request $request)
    {
        $query = DossierMedical::with('patient');

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'historique' => 'nullable|string',
            'antecedents' => 'nullable|string',
            'allergies' => 'nullable|string',
            'traitements' => 'nullable|string',
        ]);

        // Vérifier si le patient a déjà un dossier médical
        $existingDossier = DossierMedical::where('patient_id', $validated['patient_id'])->first();
        if ($existingDossier) {
            return response()->json(['message' => 'Ce patient a déjà un dossier médical'], 422);
        }

        return DossierMedical::create($validated);
    }

    public function show($id)
    {
        return DossierMedical::with('patient')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $dossier = DossierMedical::findOrFail($id);

        $validated = $request->validate([
            'historique' => 'nullable|string',
            'antecedents' => 'nullable|string',
            'allergies' => 'nullable|string',
            'traitements' => 'nullable|string',
        ]);

        $dossier->update($validated);

        return $dossier;
    }

    public function destroy($id)
    {
        $dossier = DossierMedical::findOrFail($id);
        $dossier->delete();
        
        return response()->json(['message' => 'Dossier médical supprimé avec succès']);
    }
    
    public function getByPatient($patientId)
    {
        $dossier = DossierMedical::where('patient_id', $patientId)->first();
        
        if (!$dossier) {
            return response()->json(['message' => 'Aucun dossier médical trouvé pour ce patient'], 404);
        }
        
        return $dossier;
    }
}
?>