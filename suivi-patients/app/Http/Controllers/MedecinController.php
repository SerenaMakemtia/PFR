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

        if ($request->filled('specialite')) {
            $query->where('specialite', 'like', '%' . $request->specialite . '%');
        }

        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'specialite' => 'nullable|string',
            'etablissement_sante_id' => 'required|exists:etablissement_santes,id',
        ]);

        return Medecin::create($validated);
    }

    public function show($id)
    {
        return Medecin::with(['etablissementSante'])
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $medecin = Medecin::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'specialite' => 'nullable|string',
            'etablissement_sante_id' => 'sometimes|exists:etablissement_santes,id',
        ]);

        $medecin->update($validated);

        return $medecin;
    }

    public function destroy($id)
    {
        $medecin = Medecin::findOrFail($id);
        $medecin->delete();
        
        return response()->json(['message' => 'Médecin supprimé avec succès']);
    }
    
    public function getAvailability(Request $request, $id)
    {
        $date = $request->date ?? date('Y-m-d');
        $medecin = Medecin::findOrFail($id);
        
        $rendezVous = $medecin->rendezVous()
            ->whereDate('date_heure', $date)
            ->orderBy('date_heure')
            ->get();
            
        // Heures de travail du médecin (8h à 18h par exemple)
        $heureDebut = 8;
        $heureFin = 18;
        
        $creneauxOccupes = [];
        foreach ($rendezVous as $rdv) {
            $heureRdv = date('H', strtotime($rdv->date_heure));
            $creneauxOccupes[] = (int)$heureRdv;
        }
        
        $disponibilites = [];
        for ($heure = $heureDebut; $heure < $heureFin; $heure++) {
            $disponibilites[] = [
                'heure' => sprintf('%02d:00', $heure),
                'disponible' => !in_array($heure, $creneauxOccupes)
            ];
        }
        
        return response()->json($disponibilites);
    }
}
?>