import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from '../common/Modal';
import AppointmentForm from './AppointmentForm';
import  useApi  from '../../hooks/useApi';

const AppointmentCalendar = ({ doctorId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { get } = useApi();

  // Charger les rendez-vous depuis l'API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let params = {};
        if (doctorId) params.doctorId = doctorId;
        
        const start = view === 'month' 
          ? startOfMonth(currentDate)
          : view === 'week'
          ? startOfWeek(currentDate, { weekStartsOn: 1 })
          : currentDate;
        
        const end = view === 'month'
          ? endOfMonth(currentDate)
          : view === 'week'
          ? addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6)
          : currentDate;
        
        params.startDate = format(start, 'yyyy-MM-dd');
        params.endDate = format(end, 'yyyy-MM-dd');
        
        const response = await get('/appointments', params);
        setAppointments(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
      }
    };

    fetchAppointments();
  }, [currentDate, view, doctorId, get]);

  // Générer les heures de la journée (8h-18h)
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  
  // Générer les jours selon la vue
  const getDays = () => {
    if (view === 'day') return [currentDate];
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    if (view === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
    return [];
  };

  // Filtrer les rendez-vous pour une date et heure spécifiques
  const getAppointmentsForTimeSlot = (date, hour) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getHours() === hour
      );
    });
  };

  // Changer la date courante
  const changeDate = (amount) => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + amount);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + amount * 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + amount);
    }
    setCurrentDate(newDate);
  };

  // Gérer le clic sur un créneau horaire
  const handleTimeSlotClick = (date, hour) => {
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hour);
    setSelectedDate(appointmentDateTime);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  // Gérer le clic sur un rendez-vous existant
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setSelectedDate(null);
  };

  // Après la création ou mise à jour d'un rendez-vous
  const handleAppointmentSaved = () => {
    // Recharger les rendez-vous
    handleCloseModal();
    // Rafraîchir les données...
  };

  const days = getDays();

  return (
    <div className="appointment-calendar">
      <div className="calendar-header">
        <div className="calendar-controls">
          <button onClick={() => changeDate(-1)}>Précédent</button>
          <h2>
            {view === 'day' && format(currentDate, 'dd MMMM yyyy', { locale: fr })}
            {view === 'week' && `Semaine du ${format(days[0], 'dd MMMM', { locale: fr })} au ${format(days[6], 'dd MMMM yyyy', { locale: fr })}`}
            {view === 'month' && format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button onClick={() => changeDate(1)}>Suivant</button>
        </div>
        <div className="view-controls">
          <button 
            className={view === 'day' ? 'active' : ''} 
            onClick={() => setView('day')}
          >
            Jour
          </button>
          <button 
            className={view === 'week' ? 'active' : ''} 
            onClick={() => setView('week')}
          >
            Semaine
          </button>
          <button 
            className={view === 'month' ? 'active' : ''} 
            onClick={() => setView('month')}
          >
            Mois
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="month-view">
          <div className="weekdays">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="days-grid">
            {/* Ajouter des cellules vides pour aligner avec le jour de la semaine */}
            {Array.from({ length: getDay(days[0]) || 7 }, (_, i) => (
              <div key={`empty-${i}`} className="day empty"></div>
            ))}
            
            {days.map(day => (
              <div 
                key={day.toString()} 
                className={`day ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}`}
                onClick={() => {
                  setCurrentDate(day);
                  setView('day');
                }}
              >
                <div className="day-header">{format(day, 'd')}</div>
                <div className="day-appointments">
                  {appointments
                    .filter(appointment => format(new Date(appointment.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                    .slice(0, 3)
                    .map(appointment => (
                      <div 
                        key={appointment.id} 
                        className={`appointment-indicator ${appointment.status}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppointmentClick(appointment);
                        }}
                      >
                        {format(new Date(appointment.date), 'HH:mm')} - {appointment.patientName}
                      </div>
                    ))}
                  {appointments.filter(appointment => 
                    format(new Date(appointment.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length > 3 && (
                    <div className="more-appointments">
                      +{appointments.filter(appointment => 
                        format(new Date(appointment.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length - 3} plus
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`calendar-grid ${view}-view`}>
          <div className="time-column">
            {hours.map(hour => (
              <div key={hour} className="time-slot">
                {hour}:00
              </div>
            ))}
          </div>
          
          {days.map(day => (
            <div key={day.toString()} className="day-column">
              <div className="day-header">
                {format(day, view === 'day' ? 'EEEE dd/MM' : 'EEE dd/MM', { locale: fr })}
              </div>
              <div className="day-body">
                {hours.map(hour => {
                  const dayAppointments = getAppointmentsForTimeSlot(day, hour);
                  return (
                    <div 
                      key={hour} 
                      className="time-slot"
                      onClick={() => handleTimeSlotClick(day, hour)}
                    >
                      {dayAppointments.map(appointment => (
                        <div 
                          key={appointment.id}
                          className={`appointment ${appointment.status}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAppointmentClick(appointment);
                          }}
                        >
                          <div className="appointment-time">
                            {format(new Date(appointment.date), 'HH:mm')}
                          </div>
                          <div className="appointment-info">
                            <div className="patient-name">{appointment.patientName}</div>
                            <div className="appointment-reason">{appointment.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}>
        <AppointmentForm 
          initialDate={selectedDate} 
          appointment={selectedAppointment}
          onSave={handleAppointmentSaved}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default AppointmentCalendar;