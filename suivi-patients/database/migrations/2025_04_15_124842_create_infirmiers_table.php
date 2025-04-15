use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('infirmiers', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->foreignId('etablissement_sante_id')->constrained()->onDelete('cascade');
            $table->foreignId('compte_utilisateur_id')->constrained('compte_utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('infirmiers');
    }
};
