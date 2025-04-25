import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  AppointmentCalendar  from '../../components/appointments/AppointmentCalendar';
import  SearchBar  from '../../components/common/SearchBar';
import  Button  from '../../components/common/Button';
import  Notification  from '../../components/common/Notification';


const AppointmentsCalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [filter, setFilter] = useState({
    doctor: '',
    specialty: '',
    status: ''
  });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [filter, view]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getAppointments(filter);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des rendez-vous');
      setNotification({
        type: 'error',
        message: 'Impossible de charger les rendez-vous. Veuillez réessayer plus tard.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    setFilter(prev => ({ ...prev, ...searchParams }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleCreateAppointment = () => {
    navigate('/appointments/new');
  };

  const handleAppointmentClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <Notification 
          type={notification.type} 
          message={notification.message} 
          onClose={handleCloseNotification} 
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendrier des Rendez-vous</h1>
        <Button onClick={handleCreateAppointment}>Nouveau Rendez-vous</Button>
      </div>

      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Rechercher un rendez-vous..."
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2">Vue:</label>
          <select 
            value={view} 
            onChange={(e) => handleViewChange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="day">Jour</option>
            <option value="week">Semaine</option>
            <option value="month">Mois</option>
          </select>
        </div>

        <div>
          <label className="mr-2">Médecin:</label>
          <select 
            name="doctor" 
            value={filter.doctor} 
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Tous les médecins</option>
            {/* Add doctor options dynamically */}
          </select>
        </div>

        <div>
          <label className="mr-2">Spécialité:</label>
          <select 
            name="specialty" 
            value={filter.specialty} 
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Toutes les spécialités</option>
            {/* Add specialty options dynamically */}
          </select>
        </div>

        <div>
          <label className="mr-2">Statut:</label>
          <select 
            name="status" 
            value={filter.status} 
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulé</option>
            <option value="rescheduled">Reporté</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement des rendez-vous...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      ) : (
        <AppointmentCalendar 
          appointments={appointments} 
          view={view}
          onAppointmentClick={handleAppointmentClick}
        />
      )}
    </div>
  );
};

export default AppointmentsCalendarPage;