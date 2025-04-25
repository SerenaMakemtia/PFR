import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AppointmentForm from './AppointmentForm';
import  useApi  from '../../hooks/useApi';

const AppointmentDetails = ({ appointmentId, onBack, onUpdate }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { get, put } = useApi();

  // Récupérer les détails du rendez-vous
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        const response = await get(`/appointments/${appointmentId}`);
        setAppointment(response.data);
        setError(null);
      } catch (err) {
        setError('Impossible de récupérer les détails du rendez-vous.');
        console.error('Erreur lors du chargement des détails du rendez-vous:', err);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId, get]);

  // Gérer la mise à jour du statut du rendez-vous
  const handleStatusChange = async (newStatus) => {
    try {
      await put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setAppointment({ ...appointment, status: newStatus });
      setIsCancelModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut du rendez-vous.');
    }
  };

  // Gérer la sauvegarde des modifications
  const handleSaveAppointment = (updatedAppointment) => {
    setAppointment(updatedAppointment);
    setIsEditModalOpen(false);
    if (onUpdate) onUpdate();
  };

  if (loading) return <div className="loading">Chargement des détails du rendez-vous...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!appointment) return <div className="not-found">Rendez-vous non trouvé</div>;

  const statusColors = {
    confirmed: 'green',
    pending: 'orange',
    cancelled: 'red',
    completed: 'blue'
  };

  return (
    <div className="appointment-details">
      <div className="header-actions">
        <Button onClick={onBack} variant="outline">Retour</Button>
        <div className="actions">
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <>
              <Button onClick={() => setIsEditModalOpen(true)} variant="primary">Modifier</Button>
              <Button onClick={() => setIsCancelModalOpen(true)} variant="danger">Annuler</Button>
            </>
          )}
          {appointment.status === 'pending' && (
            <Button onClick={() => handleStatusChange('confirmed')} variant="success">Confirmer</Button>
          )}
          {appointment.status === 'confirmed' && (
            <Button onClick={() => handleStatusChange('completed')} variant="info">Marquer comme effectué</Button>
          )}
        </div>
      </div>

      <Card>
        <div className="card-header">
          <h2>Détails du rendez-vous</h2>
          <span 
            className="status-badge" 
            style={{ backgroundColor: statusColors[appointment.status] }}
          >
            {appointment.status === 'confirmed' && 'Confirmé'}
            {appointment.status === 'pending' && 'En attente'}
            {appointment.status === 'cancelled' && 'Annulé'}
            {appointment.status === 'completed' && 'Terminé'}
          </span>
        </div>

        <div className="appointment-info-grid">
          <div className="info-group">
            <h3>Informations générales</h3>
            <div className="info-item">
              <span className="label">Date:</span>
              <span className="value">{format(new Date(appointment.date), 'EEEE dd MMMM yyyy', { locale: fr })}</span>
            </div>
            <div className="info-item">
              <span className="label">Heure:</span>
              <span className="value">{format(new Date(appointment.date), 'HH:mm', { locale: fr })}</span>
            </div>
            <div className="info-item">
              <span className="label">Durée:</span>
              <span className="value">{appointment.duration} minutes</span>
            </div>
            <div className="info-item">
              <span className="label">Motif:</span>
              <span className="value">{appointment.reason}</span>
            </div>
          </div>

          <div className="info-group">
            <h3>Patient</h3>
            <div className="info-item">
              <span className="label">Nom:</span>
              <span className="value">{appointment.patient.lastName}</span>
            </div>
            <div className="info-item">
              <span className="label">Prénom:</span>
              <span className="value">{appointment.patient.firstName}</span>
            </div>
            <div className="info-item">
              <span className="label">Téléphone:</span>
              <span className="value">{appointment.patient.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{appointment.patient.email}</span>
            </div>
          </div>

          <div className="info-group">
            <h3>Médecin</h3>
            <div className="info-item">
              <span className="label">Nom:</span>
              <span className="value">{appointment.doctor.lastName}</span>
            </div>
            <div className="info-item">
              <span className="label">Prénom:</span>
              <span className="value">{appointment.doctor.firstName}</span>
            </div>
            <div className="info-item">
              <span className="label">Spécialité:</span>
              <span className="value">{appointment.doctor.specialty}</span>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className="notes-section">
            <h3>Notes</h3>
            <p>{appointment.notes}</p>
          </div>
        )}
      </Card>

      {/* Modal de modification */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le rendez-vous"
      >
        <AppointmentForm 
          appointment={appointment}
          onSave={handleSaveAppointment}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Modal de confirmation d'annulation */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)}
        title="Annuler le rendez-vous"
      >
        <div className="cancel-confirmation">
          <p>Êtes-vous sûr de vouloir annuler ce rendez-vous ?</p>
          <div className="modal-actions">
            <Button onClick={() => setIsCancelModalOpen(false)} variant="outline">Non, conserver</Button>
            <Button onClick={() => handleStatusChange('cancelled')} variant="danger">Oui, annuler</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentDetails;