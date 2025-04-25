import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Table from '../common/Table';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AppointmentDetails from './AppointmentDetails';
import AppointmentForm from './AppointmentForm';
import  useApi  from '../../hooks/useApi';
import  usePagination  from '../../hooks/usePagination';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { get } = useApi();
  const { 
    currentPage, 
    totalPages, 
    pageSize, 
    setTotalItems, 
    changePage, 
    paginatedItems 
  } = usePagination(filteredAppointments, 10);

  // Charger la liste des rendez-vous
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await get('/appointments');
        setAppointments(response.data);
        setFilteredAppointments(response.data);
        setTotalItems(response.data.length);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des rendez-vous:', err);
        setError('Impossible de charger la liste des rendez-vous. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [get, setTotalItems]);

  // Filtrer et trier les rendez-vous
  useEffect(() => {
    const filterAndSortAppointments = () => {
      let filtered = [...appointments];

      // Filtrage par recherche (patient ou médecin)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(appointment => {
          const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
          const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`.toLowerCase();
          return patientName.includes(query) || doctorName.includes(query);
        });
      }

      // Filtrage par date
      if (dateFilter) {
        filtered = filtered.filter(appointment => {
          return format(new Date(appointment.date), 'yyyy-MM-dd') === dateFilter;
        });
      }

      // Filtrage par statut
      if (statusFilter) {
        filtered = filtered.filter(appointment => appointment.status === statusFilter);
      }

      // Filtrage par médecin
      if (doctorFilter) {
        filtered = filtered.filter(appointment => appointment.doctorId === doctorFilter);
      }

      // Tri
      filtered.sort((a, b) => {
        if (sortField === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortField === 'patientName') {
          const nameA = `${a.patient.lastName} ${a.patient.firstName}`.toLowerCase();
          const nameB = `${b.patient.lastName} ${b.patient.firstName}`.toLowerCase();
          return sortDirection === 'asc' 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        } else if (sortField === 'doctorName') {
          const nameA = `${a.doctor.lastName} ${a.doctor.firstName}`.toLowerCase();
          const nameB = `${b.doctor.lastName} ${b.doctor.firstName}`.toLowerCase();
          return sortDirection === 'asc' 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        }
        return 0;
      });

      setFilteredAppointments(filtered);
      setTotalItems(filtered.length);
    };

    filterAndSortAppointments();
  }, [appointments, searchQuery, dateFilter, statusFilter, doctorFilter, sortField, sortDirection, setTotalItems]);

  // Gérer le tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Afficher les détails d'un rendez-vous
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  // Mettre à jour la liste après modification
  const handleAppointmentUpdated = () => {
    // Recharger la liste des rendez-vous
    setIsDetailModalOpen(false);
    setIsFormModalOpen(false);
    // Rafraîchir les données...
  };

  // Colonnes du tableau
  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
      cell: (appointment) => format(new Date(appointment.date), 'dd/MM/yyyy HH:mm', { locale: fr }),
      onSort: () => handleSort('date')
    },
    {
      header: 'Patient',
      accessor: 'patientName',
      sortable: true,
      cell: (appointment) => `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      onSort: () => handleSort('patientName')
    },
    {
      header: 'Médecin',
      accessor: 'doctorName',
      sortable: true,
      cell: (appointment) => `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      onSort: () => handleSort('doctorName')
    },
    {
      header: 'Spécialité',
      accessor: 'specialty',
      cell: (appointment) => appointment.doctor.specialty
    },
    {
      header: 'Motif',
      accessor: 'reason',
      cell: (appointment) => appointment.reason
    },
    {
      header: 'Statut',
      accessor: 'status',
      cell: (appointment) => {
        const statusMap = {
          pending: 'En attente',
          confirmed: 'Confirmé',
          cancelled: 'Annulé',
          completed: 'Terminé'
        };
        const statusClasses = {
          pending: 'status-pending',
          confirmed: 'status-confirmed',
          cancelled: 'status-cancelled',
          completed: 'status-completed'
        };
        return (
          <span className={`status-badge ${statusClasses[appointment.status]}`}>
            {statusMap[appointment.status]}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      cell: (appointment) => (
        <div className="table-actions">
          <Button 
            onClick={() => handleViewDetails(appointment)} 
            variant="outline"
            size="small"
          >
            Détails
          </Button>
        </div>
      )
    }
  ];

  // Obtenir une liste unique de médecins pour le filtre
  const doctors = appointments.reduce((acc, appointment) => {
    if (!acc.some(doctor => doctor.id === appointment.doctorId)) {
      acc.push({
        id: appointment.doctorId,
        name: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      });
    }
    return acc;
  }, []);

  return (
    <div className="appointments-list">
      <div className="list-header">
        <h2>Liste des rendez-vous</h2>
        <Button 
          onClick={() => setIsFormModalOpen(true)} 
          variant="primary"
        >
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <SearchBar 
            placeholder="Rechercher un patient ou médecin..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-date"
            placeholder="Filtrer par date"
          />
        </div>
        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
        <div className="filter-group">
          <select 
            value={doctorFilter} 
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les médecins</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <Button 
          onClick={() => {
            setSearchQuery('');
            setDateFilter('');
            setStatusFilter('');
            setDoctorFilter('');
          }} 
          variant="outline"
          size="small"
        >
          Réinitialiser
        </Button>
      </div>

      {loading ? (
        <div className="loading">Chargement des rendez-vous...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="no-data">Aucun rendez-vous trouvé</div>
      ) : (
        <>
          <Table 
            columns={columns} 
            data={paginatedItems} 
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <div className="pagination-container">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
            <div className="items-per-page">
              {filteredAppointments.length} rendez-vous au total
            </div>
          </div>
        </>
      )}

      {/* Modal pour afficher les détails */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        title="Détails du rendez-vous"
        size="large"
      >
        {selectedAppointment && (
          <AppointmentDetails 
            appointmentId={selectedAppointment.id}
            onBack={() => setIsDetailModalOpen(false)}
            onUpdate={handleAppointmentUpdated}
          />
        )}
      </Modal>

      {/* Modal pour créer un rendez-vous */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title="Nouveau rendez-vous"
      >
        <AppointmentForm 
          onSave={handleAppointmentUpdated}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AppointmentsList;