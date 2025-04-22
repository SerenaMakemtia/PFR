// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const DashboardCard = ({ title, value, icon, color, linkTo }) => (
  <Link to={linkTo} className="block">
    <div className={`p-6 rounded-lg shadow-md bg-white border-l-4 ${color} hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  </Link>
);

const UpcomingAppointment = ({ appointment }) => {
  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = appointmentDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex items-center p-4 border-b last:border-b-0">
      <div className="bg-blue-100 text-blue-800 p-3 rounded-full mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{appointment.patient.name}</h4>
        <div className="flex items-center text-sm text-gray-600">
          <span>{formattedDate} à {formattedTime}</span>
          <span className="mx-2">•</span>
          <span>{appointment.reason}</span>
        </div>
      </div>
      <div>
        <Link to={`/appointments/${appointment.id}`} className="text-blue-500 hover:underline text-sm">
          Détails
        </Link>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    appointmentsToday: 0,
    pendingDocuments: 0,
    upcomingAppointments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/api/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">
          Bonjour {user?.name}, voici un aperçu de votre activité.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Patients enregistrés" 
          value={stats.patients} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
          color="border-blue-500"
          linkTo="/patients" 
        />
        <DashboardCard 
          title="Rendez-vous aujourd'hui" 
          value={stats.appointmentsToday} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } 
          color="border-green-500"
          linkTo="/appointments/calendar" 
        />
        <DashboardCard 
          title="Documents en attente" 
          value={stats.pendingDocuments} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          } 
          color="border-yellow-500"
          linkTo="/medical-records" 
        />
      </div>

      {/* Prochains rendez-vous */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Prochains rendez-vous</h2>
        </div>
        <div className="divide-y">
          {stats.upcomingAppointments.length > 0 ? (
            stats.upcomingAppointments.map((appointment) => (
              <UpcomingAppointment key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Aucun rendez-vous à venir.
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 text-center">
          <Link to="/appointments/calendar" className="text-blue-500 hover:underline">
            Voir tous les rendez-vous
          </Link>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Actions rapides</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            to="/patients/new" 
            className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau patient
          </Link>
          <Link 
            to="/appointments/new" 
            className="flex items-center p-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau rendez-vous
          </Link>
          <Link 
            to="/medical-records/upload" 
            className="flex items-center p-3 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importer un document
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;