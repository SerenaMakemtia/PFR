import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Input from '../common/Input';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import  useApi  from '../../hooks/useApi';

const AppointmentForm = ({ appointment = null, initialDate = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    duration: 30,
    reason: '',
    notes: '',
    status: 'pending'
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { get, post, put } = useApi();

  // Initialiser le formulaire avec les données du rendez-vous ou la date initiale
  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: format(appointmentDate, 'yyyy-MM-dd'),
        time: format(appointmentDate, 'HH:mm'),
        duration: appointment.duration || 30,
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        status: appointment.status || 'pending'
      });
      setSelectedPatient(appointment.patient);
      setSelectedDoctor(appointment.doctor);
    } else if (initialDate) {
      setFormData({
        ...formData,
        date: format(initialDate, 'yyyy-MM-dd'),
        time: format(initialDate, 'HH:mm')
      });
    }
  }, [appointment, initialDate]);

  // Récupérer la liste des patients et médecins
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, doctorsResponse] = await Promise.all([
          get('/patients'),
          get('/users', { role: 'doctor' })
        ]);
        setPatients(patientsResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données nécessaires.');
      }
    };

    fetchData();
  }, [get]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Rechercher un patient
  const handlePatientSearch = (query) => {
    if (!query.trim()) {
      setFilteredPatients([]);
      setShowPatientDropdown(false);
      return;
    }

    const filtered = patients.filter(patient => 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filtered);
    setShowPatientDropdown(true);
  };

  // Sélectionner un patient
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({ ...formData, patientId: patient.id });
    setShowPatientDropdown(false);
  };

  // Rechercher un médecin
  const handleDoctorSearch = (query) => {
    if (!query.trim()) {
      setFilteredDoctors([]);
      setShowDoctorDropdown(false);
      return;
    }

    const filtered = doctors.filter(doctor => 
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDoctors(filtered);
    setShowDoctorDropdown(true);
  };

  // Sélectionner un médecin
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...formData, doctorId: doctor.id });
    setShowDoctorDropdown(false);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Créer un objet Date avec la date et l'heure
      const [year, month, day] = formData.date.split('-').map(Number);
      const [hours, minutes] = formData.time.split(':').map(Number);
      const appointmentDate = new Date(year, month - 1, day, hours, minutes);

      const appointmentData = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: appointmentDate.toISOString(),
        duration: parseInt(formData.duration),
        reason: formData.reason,
        notes: formData.notes,
        status: formData.status
      };

      let response;
      if (appointment) {
        response = await put(`/appointments/${appointment.id}`, appointmentData);
      } else {
        response = await post('/appointments', appointmentData);
      }

      if (onSave) onSave(response.data);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', err);
      setError('Impossible d\'enregistrer le rendez-vous. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="patient">Patient*</label>
        <div className="search-dropdown-container">
          <SearchBar 
            id="patient"
            placeholder="Rechercher un patient..." 
            value={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ''} 
            onChange={e => handlePatientSearch(e.target.value)} 
            onFocus={() => setShowPatientDropdown(true)}
          />
          {showPatientDropdown && filteredPatients.length > 0 && (
            <div className="dropdown">
              {filteredPatients.map(patient => (
                <div 
                  key={patient.id} 
                  className="dropdown-item"
                  onClick={() => handleSelectPatient(patient)}
                >
                  {patient.firstName} {patient.lastName} ({format(new Date(patient.birthDate), 'dd/MM/yyyy')})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="doctor">Médecin*</label>
        <div className="search-dropdown-container">
          <SearchBar 
            id="doctor"
            placeholder="Rechercher un médecin..." 
            value={selectedDoctor ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName} - ${selectedDoctor.specialty}` : ''} 
            onChange={e => handleDoctorSearch(e.target.value)} 
            onFocus={() => setShowDoctorDropdown(true)}
          />
          {showDoctorDropdown && filteredDoctors.length > 0 && (
            <div className="dropdown">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id} 
                  className="dropdown-item"
                  onClick={() => handleSelectDoctor(doctor)}
                >
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date*</label>
          <Input 
            type="date" 
            id="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Heure*</label>
          <Input 
            type="time" 
            id="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="duration">Durée (minutes)</label>
          <Input 
            type="number" 
            id="duration" 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange}
            min="15"
            step="15"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select 
            id="status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="form-select"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reason">Motif de la consultation*</label>
        <Input 
          type="text" 
          id="reason" 
          name="reason" 
          value={formData.reason} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea 
          id="notes" 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange}
          rows="4"
          className="form-textarea"
        />
      </div>

      <div className="form-actions">
        <Button type="button" onClick={onCancel} variant="outline">Annuler</Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Enregistrement...' : (appointment ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;