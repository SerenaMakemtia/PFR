import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// Layout components
import AppLayout from '../../components/layout/AppLayout';

// Patient components
import PatientDetails from '../../components/patients/PatientsDetails';
import PatientForm from '../../components/patients/PatientForm';

// Medical records components
import MedicalHistory from '../../components/medical-records/MedicalHistory';
import PrescriptionList from '../../components/medical-records/PrescriptionList';
import DocumentViewer from '../../components/medical-records/DocumentViewer';

// Appointment components
import AppointmentsList from '../../components/appointments/AppointmentsList';
import AppointmentForm from '../../components/appointments/AppointmentForm';

// Common components
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

// Services
import { getPatientById, updatePatient } from '../../services/patients.Service';

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const data = await getPatientById(patientId);
        setPatient(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Impossible de charger les données du patient');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const handleUpdatePatient = async (updatedPatientData) => {
    try {
      const updatedPatient = await updatePatient(patientId, updatedPatientData);
      setPatient(updatedPatient);
      setIsEditMode(false);
      showNotification('Informations du patient mises à jour avec succès', 'success');
    } catch (err) {
      console.error('Error updating patient:', err);
      showNotification('Erreur lors de la mise à jour des informations du patient', 'error');
    }
  };

  const handleDeletePatient = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier patient ?')) {
      // Implement delete functionality
      navigate('/patients');
      showNotification('Dossier patient supprimé avec succès', 'success');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </AppLayout>
  );

  if (!patient) return (
    <AppLayout>
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Patient non trouvé</h2>
        <Button onClick={() => navigate('/patients')}>Retour à la liste des patients</Button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {notification.show && (
          <Notification 
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ show: false, message: '', type: '' })}
          />
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600 mb-2">
              ID: {patient.id} | Né(e) le: {new Date(patient.birthDate).toLocaleDateString()}
            </p>
            <div className="flex items-center text-sm">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${patient.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{patient.isActive ? 'Actif' : 'Inactif'}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)}>
                Modifier le dossier
              </Button>
            )}
            <Button onClick={() => setShowAppointmentModal(true)} variant="secondary">
              Nouveau rendez-vous
            </Button>
            <Button onClick={handleDeletePatient} variant="danger">
              Supprimer
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isEditMode ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Modifier les informations du patient</h2>
                <Button onClick={() => setIsEditMode(false)} variant="secondary">
                  Annuler
                </Button>
              </div>
              <PatientForm 
                initialData={patient} 
                onSubmit={handleUpdatePatient}
                isEdit={true}
              />
            </div>
          ) : (
            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
              <TabList className="flex border-b bg-gray-50">
                <Tab className="py-3 px-4 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                  Informations personnelles
                </Tab>
                <Tab className="py-3 px-4 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                  Historique médical
                </Tab>
                <Tab className="py-3 px-4 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                  Rendez-vous
                </Tab>
                <Tab className="py-3 px-4 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                  Documents
                </Tab>
                <Tab className="py-3 px-4 font-medium cursor-pointer border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition-colors">
                  Prescriptions
                </Tab>
              </TabList>

              <TabPanel>
                <div className="p-6">
                  <PatientDetails patient={patient} />
                </div>
              </TabPanel>
              
              <TabPanel>
                <div className="p-6">
                  <MedicalHistory patientId={patientId} />
                </div>
              </TabPanel>
              
              <TabPanel>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Rendez-vous du patient</h2>
                    <Button onClick={() => setShowAppointmentModal(true)}>
                      Nouveau rendez-vous
                    </Button>
                  </div>
                  <AppointmentsList patientId={patientId} />
                </div>
              </TabPanel>
              
              <TabPanel>
                <div className="p-6">
                  <DocumentViewer patientId={patientId} />
                </div>
              </TabPanel>
              
              <TabPanel>
                <div className="p-6">
                  <PrescriptionList patientId={patientId} />
                </div>
              </TabPanel>
            </Tabs>
          )}
        </div>
      </div>

      {showAppointmentModal && (
        <Modal 
          title="Nouveau rendez-vous"
          onClose={() => setShowAppointmentModal(false)}
        >
          <AppointmentForm 
            patientId={patientId}
            patientName={`${patient.firstName} ${patient.lastName}`}
            onSubmitSuccess={() => {
              setShowAppointmentModal(false);
              showNotification('Rendez-vous créé avec succès', 'success');
              // Refresh appointments list if we're on that tab
              if (activeTab === 2) {
                // You might need to implement a refresh mechanism for your AppointmentsList component
              }
            }}
          />
        </Modal>
      )}
    </AppLayout>
  );
};

export default PatientDetailsPage;