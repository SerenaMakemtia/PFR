<?php
namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = Prescription::query();

        if ($request->filled('médicament')) {
            $query->where('médicament', 'like', '%' . $request->médicament . '%');
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'médecinID' => 'required|integer',
            'patientID' => 'required|integer',
            'médicament' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'durée' => 'required|string|max:255',
            'datePrescription' => 'required|date',
        ]);

        return Prescription::create($validated);
    }

    public function show($id)
    {
        return Prescription::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $prescription = Prescription::findOrFail($id);

        $validated = $request->validate([
            'médecinID' => 'sometimes|integer',
            'patientID' => 'sometimes|integer',
            'médicament' => 'sometimes|string|max:255',
            'dosage' => 'sometimes|string|max:255',
            'durée' => 'sometimes|string|max:255',
            'datePrescription' => 'sometimes|date',
        ]);

        $prescription->update($validated);

        return $prescription;
    }

    public function destroy($id)
    {
        Prescription::destroy($id);
        return response()->json(['message' => 'Prescription supprimée']);
    }
}
?>