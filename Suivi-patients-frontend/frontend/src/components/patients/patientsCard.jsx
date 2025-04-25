import React from 'react';
import  Card  from '../common/Card';
import  Button  from '../common/Button';

const PatientCard = ({ patient, onClick, onEdit, onDelete }) => {
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

  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <div onClick={() => onClick(patient.id)} className="cursor-pointer">
        <h3 className="text-lg font-bold mb-2">{patient.lastName} {patient.firstName}</h3>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-sm">
          <div className="font-semibold">ID:</div>
          <div>{patient.id}</div>
          
          <div className="font-semibold">Date de naissance:</div>
          <div>{formatDate(patient.birthDate)}</div>
          
          <div className="font-semibold">Âge:</div>
          <div>{getAge(patient.birthDate)}</div>
          
          <div className="font-semibold">Sexe:</div>
          <div>{patient.gender}</div>
          
          <div className="font-semibold">Téléphone:</div>
          <div>{patient.phone || 'Non renseigné'}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="text-sm">
          <span className="font-semibold">Dernière visite:</span>{' '}
          {patient.lastVisit ? formatDate(patient.lastVisit) : 'Aucune'}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(patient.id);
            }}
            variant="secondary"
            size="sm"
          >
            Modifier
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(patient.id);
            }}
            variant="danger"
            size="sm"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PatientCard;