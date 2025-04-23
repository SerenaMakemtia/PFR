// components/medical-records/PrescriptionList.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/dateUtils';

const PrescriptionList = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await get(`/patients/${patientId}/prescriptions`);
        setPrescriptions(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId, get]);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const columns = [
    { 
      header: 'Date', 
      accessor: 'date', 
      render: (row) => formatDate(row.date) 
    },
    { header: 'Médecin', accessor: 'doctor' },
    { header: 'Diagnostic', accessor: 'diagnosis' },
    { 
      header: 'Actions', 
      accessor: 'id', 
      render: (row) => (
        <Button size="small" onClick={() => handleViewPrescription(row)}>
          Voir
        </Button>
      ) 
    },
  ];

  return (
    <Card title="Ordonnances">
      {isLoading ? (
        <p>Chargement des ordonnances...</p>
      ) : (
        <Table 
          columns={columns}
          data={prescriptions}
          emptyMessage="Aucune ordonnance trouvée"
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Détails de l'ordonnance"
      >
        {selectedPrescription && (
          <div className="prescription-details">
            <div className="prescription-header">
              <h3>Ordonnance du {formatDate(selectedPrescription.date)}</h3>
              <p><strong>Médecin:</strong> {selectedPrescription.doctor}</p>
              <p><strong>Diagnostic:</strong> {selectedPrescription.diagnosis}</p>
            </div>
            
            <div className="prescription-medications">
              <h4>Médicaments prescrits</h4>
              <ul>
                {selectedPrescription.medications.map((med, index) => (
                  <li key={index}>
                    <strong>{med.name}</strong> - {med.dosage} - {med.frequency} - {med.duration}
                    {med.instructions && <p><em>Instructions: {med.instructions}</em></p>}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="prescription-notes">
              {selectedPrescription.notes && (
                <>
                  <h4>Notes</h4>
                  <p>{selectedPrescription.notes}</p>
                </>
              )}
            </div>
            
            <div className="prescription-actions">
              <Button onClick={() => window.print()}>Imprimer</Button>
              <Button variant="secondary">Télécharger PDF</Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default PrescriptionList;