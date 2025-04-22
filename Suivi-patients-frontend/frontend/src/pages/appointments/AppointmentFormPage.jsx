import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppointmentById, createAppointment, updateAppointment } from '../../services/appointmentService';
import { getAllPatients } from '../../services/patientService';
import { getAllUsers } from '../../services/userService';

const AppointmentForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [appointment, setAppointment] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: '',
    status: 'scheduled',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Charger la liste des patients
        const patientsData = await getAllPatients();
        setPatients(patientsData || []);
        
        // Charger la liste des médecins (utilisateurs avec rôle médecin)
        const usersData = await getAllUsers();
        const doctorsData = usersData.filter(user => 
          user.roles && user.roles.includes('doctor')
        );
        setDoctors(doctorsData || []);
        
        // Si on est en mode édition, charger les données du rendez-vous
        if (mode === 'edit' && id) {
          const appointmentData = await getAppointmentById(id);
          
          // Formater les dates et heures depuis la réponse de l'API
          const appointmentDate = new Date(appointmentData.startDateTime);
          const endDate = new Date(appointmentData.endDateTime);
          
          setAppointment({
            patientId: appointmentData.patientId,
            doctorId: appointmentData.doctorId,
            date: appointmentDate.toISOString().split('T')[0],
            startTime: appointmentDate.toTimeString().slice(0, 5),
            endTime: endDate.toTimeString().slice(0, 5),
            type: appointmentData.type,
            status: appointmentData.status,
            notes: appointmentData.notes || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!appointment.patientId) newErrors.patientId = "Patient requis";
    if (!appointment.doctorId) newErrors.doctorId = "Médecin requis";
    if (!appointment.date) newErrors.date = "Date requise";
    if (!appointment.startTime) newErrors.startTime = "Heure de début requise";
    if (!appointment.endTime) newErrors.endTime = "Heure de fin requise";
    if (!appointment.type) newErrors.type = "Type de rendez-vous requis";
    
    // Vérification que l'heure de fin est après l'heure de début
    if (appointment.startTime && appointment.endTime && appointment.startTime >= appointment.endTime) {
      newErrors.endTime = "L'heure de fin doit être après l'heure de début";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Préparer les dates pour l'API
      const startDateTime = new Date(`${appointment.date}T${appointment.startTime}`);
      const endDateTime = new Date(`${appointment.date}T${appointment.endTime}`);
      
      const appointmentData = {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes,
      };
      
      if (mode === 'create') {
        await createAppointment(appointmentData);
      } else {
        await updateAppointment(id, appointmentData);
      }
      
      navigate('/appointments');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && mode === 'edit') {
    return <div className="flex justify-center items-center h-64">Chargement des données...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === 'create' ? 'Créer un nouveau rendez-vous' : 'Modifier le rendez-vous'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sélection du patient */}
          <div className="mb-4">
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              id="patientId"
              name="patientId"
              value={appointment.patientId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 ${errors.patientId ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner un patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.lastName} {patient.firstName}
                </option>
              ))}
            </select>
            {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>}
          </div>
          
          {/* Sélection du médecin */}
          <div className="mb-4">
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
              Médecin
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={appointment.doctorId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 ${errors.doctorId ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner un médecin</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.lastName} {doctor.firstName} - {doctor.specialty || 'Généraliste'}
                </option>
              ))}
            </select>
            {errors.doctorId && <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>}
          </div>
          
          {/* Date du rendez-vous */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          
          {/* Type de rendez-vous */}
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type de rendez-vous
            </label>
            <select
              id="type"
              name="type"
              value={appointment.type}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 ${errors.type ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner un type</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Suivi</option>
              <option value="emergency">Urgence</option>
              <option value="examination">Examen</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>
          
          {/* Heure de début */}
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de début
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={appointment.startTime}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 ${errors.startTime ? 'border-red-500' : ''}`}
            />
            {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
          </div>
          
          {/* Heure de fin */}
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de fin
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={appointment.endTime}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 ${errors.endTime ? 'border-red-500' : ''}`}
            />
            {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
          </div>
          
          {/* Statut (uniquement en mode édition) */}
          {mode === 'edit' && (
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={appointment.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              >
                <option value="scheduled">Programmé</option>
                <option value="confirmed">Confirmé</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
                <option value="no-show">Non présenté</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Notes */}
        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={appointment.notes}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            placeholder="Informations complémentaires sur le rendez-vous..."
          ></textarea>
        </div>
        
        {/* Boutons d'action */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isLoading 
              ? 'Enregistrement...' 
              : mode === 'create' 
                ? 'Créer le rendez-vous' 
                : 'Mettre à jour'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;