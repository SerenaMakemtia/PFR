<?php
namespace App\Http\Controllers;

use App\Models\EtablissementSante;
use Illuminate\Http\Request;

class EtablissementSanteController extends Controller
{
    public function index()
    {
        return EtablissementSante::all();
    }

    public function store(Request $request)
    {
        return EtablissementSante::create($request->all());
    }

    public function show($id)
    {
        return EtablissementSante::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $etablissement = EtablissementSante::findOrFail($id);
        $etablissement->update($request->all());
        return $etablissement;
    }

    public function destroy($id)
    {
        EtablissementSante::destroy($id);
        return response()->json(['message' => 'Établissement supprimé']);
    }
}
?>