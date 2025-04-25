import React, { useState } from 'react';
import Card from '../common/Card';
import  Modal  from '../common/Modal';
import Button from '/src/components/common/Button.jsx';

const PatientDetails = ({ patient, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getAge = (birthDate) => {
    if (!birthDate) return 'Non renseigné';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return `${age} ans`;
  };

  const confirmDelete = () => {
    onDelete(patient.id);
    setShowDeleteModal(false);
  };

  if (!patient) {
    return <div className="p-4 text-center">Aucun patient sélectionné</div>;
  }

  return (
    <div className="patient-details">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{patient.lastName} {patient.firstName}</h2>
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="secondary">Modifier</Button>
          <Button onClick={() => setShowDeleteModal(true)} variant="danger">Supprimer</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Informations Personnelles">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">ID:</div>
            <div>{patient.id}</div>
            
            <div className="font-semibold">Date de naissance:</div>
            <div>{formatDate(patient.birthDate)}</div>
            
            <div className="font-semibold">Âge:</div>
            <div>{getAge(patient.birthDate)}</div>
            
            <div className="font-semibold">Sexe:</div>
            <div>{patient.gender}</div>
            
            <div className="font-semibold">Adresse:</div>
            <div>{patient.address || 'Non renseignée'}</div>
            
            <div className="font-semibold">Téléphone:</div>
            <div>{patient.phone || 'Non renseigné'}</div>
            
            <div className="font-semibold">Email:</div>
            <div>{patient.email || 'Non renseigné'}</div>
          </div>
        </Card>
        
        <Card title="Contact d'urgence">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Nom:</div>
            <div>{patient.emergencyContact?.name || 'Non renseigné'}</div>
            
            <div className="font-semibold">Relation:</div>
            <div>{patient.emergencyContact?.relationship || 'Non renseignée'}</div>
            
            <div className="font-semibold">Téléphone:</div>
            <div>{patient.emergencyContact?.phone || 'Non renseigné'}</div>
          </div>
        </Card>
        
        <Card title="Informations Médicales">
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Allergies:</h4>
            {patient.allergies && patient.allergies.length > 0 ? (
              <ul className="list-disc pl-5">
                {patient.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            ) : (
              <p>Aucune allergie connue</p>
            )}
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Maladies chroniques:</h4>
            {patient.chronicDiseases && patient.chronicDiseases.length > 0 ? (
              <ul className="list-disc pl-5">
                {patient.chronicDiseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            ) : (
              <p>Aucune maladie chronique</p>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Interventions chirurgicales:</h4>
            {patient.surgeries && patient.surgeries.length > 0 ? (
              <ul className="list-disc pl-5">
                {patient.surgeries.map((surgery, index) => (
                  <li key={index}>{surgery.name} ({formatDate(surgery.date)})</li>
                ))}
              </ul>
            ) : (
              <p>Aucune intervention chirurgicale</p>
            )}
          </div>
        </Card>
        
        <Card title="Informations d'assurance">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">N° Sécurité Sociale:</div>
            <div>{patient.socialSecurityNumber || 'Non renseigné'}</div>
            
            <div className="font-semibold">Assurance:</div>
            <div>{patient.insurance?.name || 'Non renseignée'}</div>
            
            <div className="font-semibold">N° d'adhérent:</div>
            <div>{patient.insurance?.memberNumber || 'Non renseigné'}</div>
            
            <div className="font-semibold">Validité:</div>
            <div>{patient.insurance?.expiryDate ? formatDate(patient.insurance.expiryDate) : 'Non renseignée'}</div>
          </div>
        </Card>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer le dossier de {patient.firstName} {patient.lastName} ?</p>
        <p className="mb-4 text-red-600 font-semibold">Cette action est irréversible.</p>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setShowDeleteModal(false)} variant="secondary">Annuler</Button>
          <Button onClick={confirmDelete} variant="danger">Confirmer la suppression</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDetails;