<?php
namespace App\Http\Controllers;

use App\Models\Infirmier;
use Illuminate\Http\Request;

class InfirmierController extends Controller
{
    public function index()
    {
        return Infirmier::all();
    }

    public function store(Request $request)
    {
        return Infirmier::create($request->all());
    }

    public function show($id)
    {
        return Infirmier::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $infirmier = Infirmier::findOrFail($id);
        $infirmier->update($request->all());
        return $infirmier;
    }

    public function destroy($id)
    {
        Infirmier::destroy($id);
        return response()->json(['message' => 'Infirmier supprimé']);
    }
}
?>