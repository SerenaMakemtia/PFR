// pages/medical-records/MedicalRecordsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Tabs, Tab } from '../../components/common/Tabs';
import MedicalHistory from '../../components/medical-records/MedicalHistory';
import PrescriptionList from '../../components/medical-records/PrescriptionList';
import DocumentViewer from '../../components/medical-records/DocumentViewer';
import { useApi } from '../../hooks/useApi';

const MedicalRecordsPage = () => {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('history');
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientResponse = await get(`/patients/${patientId}`);
        setPatient(patientResponse.data);
        
        const documentsResponse = await get(`/patients/${patientId}/documents`);
        setDocuments(documentsResponse.data);
        if (documentsResponse.data.length > 0) {
          setSelectedDocument(documentsResponse.data[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, get]);

  if (isLoading) {
    return <div>Chargement des données du patient...</div>;
  }

  if (!patient) {
    return <div>Patient non trouvé</div>;
  }

  return (
    <div className="medical-records-page">
      <div className="page-header">
        <h1>Dossier Médical - {patient.firstName} {patient.lastName}</h1>
        <div className="patient-info">
          <p><strong>Date de naissance:</strong> {patient.birthDate}</p>
          <p><strong>Numéro de dossier:</strong> {patient.fileNumber}</p>
        </div>
      </div>

      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <Tab id="history" label="Historique Médical">
          <MedicalHistory patientId={patientId} />
        </Tab>
        <Tab id="prescriptions" label="Ordonnances">
          <PrescriptionList patientId={patientId} />
        </Tab>
        <Tab id="documents" label="Documents">
          <div className="documents-container">
            <div className="documents-list">
              <h3>Documents</h3>
              <ul>
                {documents.length === 0 ? (
                  <li>Aucun document trouvé</li>
                ) : (
                  documents.map((doc) => (
                    <li 
                      key={doc.id} 
                      className={selectedDocument?.id === doc.id ? 'active' : ''}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <span>{doc.title}</span>
                      <span className="document-date">{doc.date}</span>
                    </li>
                  ))
                )}
              </ul>
              <Button>Ajouter un document</Button>
            </div>
            <div className="document-viewer-container">
              <DocumentViewer document={selectedDocument} />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default MedicalRecordsPage;