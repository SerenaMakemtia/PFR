import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById, createPatient, updatePatient } from '../../services/patients.Service';

// Composants communs à importer
// Ces composants seraient à créer dans le dossier components/common
const Button = ({ children, type = 'button', variant = 'primary', onClick, disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
  };
  
  return (
    <button 
      type={type} 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const FormField = ({ label, id, error, children }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const PatientForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      pastSurgeries: []
    },
    insuranceInfo: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      expirationDate: ''
    }
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (mode === 'edit' && id) {
        setIsLoading(true);
        try {
          const data = await getPatientById(id);
          setPatient(data);
        } catch (error) {
          console.error('Failed to fetch patient data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPatient();
  }, [id, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPatient(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPatient(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    const [parent, child] = field.split('.');
    
    setPatient(prev => {
      const updatedArray = [...prev[parent][child]];
      updatedArray[index] = value;
      
      return {
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: updatedArray
        }
      };
    });
  };

  const addArrayItem = (field) => {
    const [parent, child] = field.split('.');
    
    setPatient(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: [...prev[parent][child], '']
      }
    }));
  };

  const removeArrayItem = (field, index) => {
    const [parent, child] = field.split('.');
    
    setPatient(prev => {
      const updatedArray = [...prev[parent][child]];
      updatedArray.splice(index, 1);
      
      return {
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: updatedArray
        }
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!patient.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!patient.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!patient.dateOfBirth) newErrors.dateOfBirth = "La date de naissance est requise";
    if (!patient.gender) newErrors.gender = "Le genre est requis";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (patient.email && !emailRegex.test(patient.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    // Phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (patient.phone && !phoneRegex.test(patient.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Format de téléphone invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await createPatient(patient);
      } else {
        await updatePatient(id, patient);
      }
      navigate('/patients');
    } catch (error) {
      console.error('Failed to save patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === 'edit') {
    return <div className="flex justify-center items-center h-64">Chargement des données du patient...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === 'create' ? 'Créer un nouveau patient' : 'Modifier les informations du patient'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Informations personnelles</h3>
            
            <FormField label="Prénom" id="firstName" error={errors.firstName}>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={patient.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Nom" id="lastName" error={errors.lastName}>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={patient.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Date de naissance" id="dateOfBirth" error={errors.dateOfBirth}>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={patient.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Genre" id="gender" error={errors.gender}>
              <select
                id="gender"
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </FormField>
            
            <FormField label="Email" id="email" error={errors.email}>
              <input
                type="email"
                id="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Téléphone" id="phone" error={errors.phone}>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={patient.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
          </div>
          
          {/* Adresse */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Adresse</h3>
            
            <FormField label="Rue" id="address.street">
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={patient.address.street}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Ville" id="address.city">
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={patient.address.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="État/Province" id="address.state">
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={patient.address.state}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </FormField>
              
              <FormField label="Code postal" id="address.zipCode">
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={patient.address.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </FormField>
            </div>
            
            <FormField label="Pays" id="address.country">
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={patient.address.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
          </div>
        </div>
        
        {/* Contact d'urgence */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Contact d'urgence</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Nom" id="emergencyContact.name">
              <input
                type="text"
                id="emergencyContact.name"
                name="emergencyContact.name"
                value={patient.emergencyContact.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Relation" id="emergencyContact.relationship">
              <input
                type="text"
                id="emergencyContact.relationship"
                name="emergencyContact.relationship"
                value={patient.emergencyContact.relationship}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Téléphone" id="emergencyContact.phone">
              <input
                type="tel"
                id="emergencyContact.phone"
                name="emergencyContact.phone"
                value={patient.emergencyContact.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
          </div>
        </div>
        
        {/* Antécédents médicaux */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Antécédents médicaux</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            {patient.medicalHistory.allergies.map((allergy, index) => (
              <div key={`allergy-${index}`} className="flex items-center mb-2">
                <input
                  type="text"
                  value={allergy}
                  onChange={(e) => handleArrayChange(e, 'medicalHistory.allergies', index)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('medicalHistory.allergies', index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('medicalHistory.allergies')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Ajouter une allergie
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Conditions chroniques</label>
            {patient.medicalHistory.chronicConditions.map((condition, index) => (
              <div key={`condition-${index}`} className="flex items-center mb-2">
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => handleArrayChange(e, 'medicalHistory.chronicConditions', index)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('medicalHistory.chronicConditions', index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('medicalHistory.chronicConditions')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Ajouter une condition
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Médicaments actuels</label>
            {patient.medicalHistory.currentMedications.map((medication, index) => (
              <div key={`medication-${index}`} className="flex items-center mb-2">
                <input
                  type="text"
                  value={medication}
                  onChange={(e) => handleArrayChange(e, 'medicalHistory.currentMedications', index)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('medicalHistory.currentMedications', index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('medicalHistory.currentMedications')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Ajouter un médicament
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chirurgies passées</label>
            {patient.medicalHistory.pastSurgeries.map((surgery, index) => (
              <div key={`surgery-${index}`} className="flex items-center mb-2">
                <input
                  type="text"
                  value={surgery}
                  onChange={(e) => handleArrayChange(e, 'medicalHistory.pastSurgeries', index)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('medicalHistory.pastSurgeries', index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('medicalHistory.pastSurgeries')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Ajouter une chirurgie
            </button>
          </div>
        </div>
        
        {/* Informations d'assurance */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Informations d'assurance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Assureur" id="insuranceInfo.provider">
              <input
                type="text"
                id="insuranceInfo.provider"
                name="insuranceInfo.provider"
                value={patient.insuranceInfo.provider}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Numéro de police" id="insuranceInfo.policyNumber">
              <input
                type="text"
                id="insuranceInfo.policyNumber"
                name="insuranceInfo.policyNumber"
                value={patient.insuranceInfo.policyNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Numéro de groupe" id="insuranceInfo.groupNumber">
              <input
                type="text"
                id="insuranceInfo.groupNumber"
                name="insuranceInfo.groupNumber"
                value={patient.insuranceInfo.groupNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Date d'expiration" id="insuranceInfo.expirationDate">
              <input
                type="date"
                id="insuranceInfo.expirationDate"
                name="insuranceInfo.expirationDate"
                value={patient.insuranceInfo.expirationDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </FormField>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="mt-8 flex justify-end space-x-4">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/patients')}
          >
            Annuler
          </Button>
          
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading 
              ? 'Enregistrement...' 
              : mode === 'create' 
                ? 'Créer le patient' 
                : 'Mettre à jour'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;