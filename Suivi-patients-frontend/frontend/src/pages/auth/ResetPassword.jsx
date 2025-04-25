import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '/src/hooks/useAuth.jsx';
//import { validatePassword } from '/src/utils/validators.js';
// Change this line in ResetPassword.jsx
import { isStrongPassword } from '/src/utils/validators.js';

// Then update your validateForm function to use isStrongPassword instead of validatePassword
const validateForm = () => {
  let isValid = true;
  
  // Validate password
  if (!isStrongPassword(password)) {
    setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
    isValid = false;
  } else {
    setPasswordError(null);
  }
  
  // Check password confirmation
  if (password !== passwordConfirmation) {
    setError('Les mots de passe ne correspondent pas.');
    isValid = false;
  }
  
  return isValid;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (!token || !email) {
      setError('Lien de réinitialisation invalide ou expiré.');
    }
  }, [token, email]);

  const validateForm = () => {
    let isValid = true;
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      isValid = false;
    } else {
      setPasswordError(null);
    }
    
    // Check password confirmation
    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation
      });
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' }
      });
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error && (!token || !email)) {
    return (
      <div className="text-center">
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
        <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-center text-gray-900 mb-6">
        Réinitialiser votre mot de passe
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={passwordError}
          />
          {passwordError && (
            <p className="mt-1 text-xs text-red-600">{passwordError}</p>
          )}
        </div>

        <div className="mb-6">
          <Input
            label="Confirmer le mot de passe"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Réinitialiser le mot de passe
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Retour à la connexion
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;