import React, { useState, useEffect } from 'react';
import  Button  from '../common/Button';
import  Input  from '../common/Input';
import  Card  from '../common/Card';

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  const defaultFormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    allergies: [''],
    chronicDiseases: [''],
    surgeries: [{ name: '', date: '' }],
    socialSecurityNumber: '',
    insurance: {
      name: '',
      memberNumber: '',
      expiryDate: ''
    }
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      // Format allergies and chronicDiseases if they are strings
      const formattedPatient = { ...patient };
      
      if (typeof formattedPatient.allergies === 'string') {
        formattedPatient.allergies = formattedPatient.allergies.split(',').map(item => item.trim());
      } else if (!formattedPatient.allergies) {
        formattedPatient.allergies = [''];
      }
      
      if (typeof formattedPatient.chronicDiseases === 'string') {
        formattedPatient.chronicDiseases = formattedPatient.chronicDiseases.split(',').map(item => item.trim());
      } else if (!formattedPatient.chronicDiseases) {
        formattedPatient.chronicDiseases = [''];
      }
      
      if (!formattedPatient.emergencyContact) {
        formattedPatient.emergencyContact = { name: '', relationship: '', phone: '' };
      }
      
      if (!formattedPatient.insurance) {
        formattedPatient.insurance = { name: '', memberNumber: '', expiryDate: '' };
      }
      
      if (!formattedPatient.surgeries || !formattedPatient.surgeries.length) {
        formattedPatient.surgeries = [{ name: '', date: '' }];
      }
      
      setFormData(formattedPatient);
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const updatedArray = [...formData[arrayName]];
    
    if (typeof updatedArray[index] === 'string') {
      updatedArray[index] = value;
    } else {
      updatedArray[index] = { ...updatedArray[index], [field]: value };
    }
    
    setFormData(prev => ({
      ...prev,
      [arrayName]: updatedArray
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => {
      const updatedArray = [...prev[arrayName]];
      
      if (arrayName === 'surgeries') {
        updatedArray.push({ name: '', date: '' });
      } else {
        updatedArray.push('');
      }
      
      return {
        ...prev,
        [arrayName]: updatedArray
      };
    });
  };

  const removeArrayItem = (index, arrayName) => {
    setFormData(prev => {
      const updatedArray = [...prev[arrayName]];
      updatedArray.splice(index, 1);
      
      // Always keep at least one empty item
      if (updatedArray.length === 0) {
        if (arrayName === 'surgeries') {
          updatedArray.push({ name: '', date: '' });
        } else {
          updatedArray.push('');
        }
      }
      
      return {
        ...prev,
        [arrayName]: updatedArray
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'La date de naissance est requise';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Le sexe est requis';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }
    
    if (formData.socialSecurityNumber && !/^\d{15}$/.test(formData.socialSecurityNumber.replace(/\D/g, ''))) {
      newErrors.socialSecurityNumber = 'Numéro de sécurité sociale invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up empty fields in arrays
      const cleanedFormData = { ...formData };
      
      cleanedFormData.allergies = cleanedFormData.allergies.filter(item => item.trim() !== '');
      cleanedFormData.chronicDiseases = cleanedFormData.chronicDiseases.filter(item => item.trim() !== '');
      cleanedFormData.surgeries = cleanedFormData.surgeries.filter(item => item.name.trim() !== '');
      
      onSubmit(cleanedFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card title="Informations Personnelles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Prénom <span className="text-red-500">*</span></label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Nom <span className="text-red-500">*</span></label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Date de naissance <span className="text-red-500">*</span></label>
            <Input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Sexe <span className="text-red-500">*</span></label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionnez</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
              <option value="other">Autre</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Adresse</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Téléphone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="w-full"
            />
          </div>
        </div>
      </Card>
      
      <Card title="Contact d'urgence">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nom du contact</label>
            <Input
              type="text"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Relation</label>
            <Input
              type="text"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Téléphone</label>
            <Input
              type="tel"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </Card>
      
      <Card title="Informations Médicales">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Allergies</label>
          {formData.allergies.map((allergy, index) => (
            <div key={`allergy-${index}`} className="flex items-center mb-2">
              <Input
                type="text"
                value={allergy}
                onChange={(e) => handleArrayChange(index, null, e.target.value, 'allergies')}
                className="flex-grow mr-2"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem(index, 'allergies')}
                variant="danger"
                size="sm"
              >
                -
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            onClick={() => addArrayItem('allergies')} 
            variant="secondary"
            size="sm"
          >
            Ajouter une allergie
          </Button>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Maladies chroniques</label>
          {formData.chronicDiseases.map((disease, index) => (
            <div key={`disease-${index}`} className="flex items-center mb-2">
              <Input
                type="text"
                value={disease}
                onChange={(e) => handleArrayChange(index, null, e.target.value, 'chronicDiseases')}
                className="flex-grow mr-2"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem(index, 'chronicDiseases')}
                variant="danger"
                size="sm"
              >
                -
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            onClick={() => addArrayItem('chronicDiseases')} 
            variant="secondary"
            size="sm"
          >
            Ajouter une maladie chronique
          </Button>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Interventions chirurgicales</label>
          {formData.surgeries.map((surgery, index) => (
            <div key={`surgery-${index}`} className="flex flex-wrap items-center mb-2">
              <div className="flex-grow mr-2 mb-2 sm:mb-0">
                <Input
                  type="text"
                  placeholder="Nom de l'intervention"
                  value={surgery.name}
                  onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'surgeries')}
                  className="w-full"
                />
              </div>
              <div className="flex-grow mr-2 mb-2 sm:mb-0">
                <Input
                  type="date"
                  value={surgery.date}
                  onChange={(e) => handleArrayChange(index, 'date', e.target.value, 'surgeries')}
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                onClick={() => removeArrayItem(index, 'surgeries')}
                variant="danger"
                size="sm"
              >
                -
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            onClick={() => addArrayItem('surgeries')} 
            variant="secondary"
            size="sm"
          >
            Ajouter une intervention
          </Button>
        </div>
      </Card>
      
      <Card title="Informations d'assurance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">N° Sécurité Sociale</label>
            <Input
              type="text"
              name="socialSecurityNumber"
              value={formData.socialSecurityNumber}
              onChange={handleChange}
              error={errors.socialSecurityNumber}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Nom de l'assurance</label>
            <Input
              type="text"
              name="insurance.name"
              value={formData.insurance.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">N° d'adhérent</label>
            <Input
              type="text"
              name="insurance.memberNumber"
              value={formData.insurance.memberNumber}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Date d'expiration</label>
            <Input
              type="date"
              name="insurance.expiryDate"
              value={formData.insurance.expiryDate}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" onClick={onCancel} variant="secondary">
          Annuler
        </Button>
        <Button type="submit">
          {patient ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;