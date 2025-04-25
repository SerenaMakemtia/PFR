import React, { useState, useEffect } from 'react';
import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { SearchBar } from '../common/SearchBar';
import { Pagination } from '../common/Pagination';
import { Modal } from '../common/Modal';
import PatientCard from './PatientCard';
import usePagination from '../../hooks/usePagination';

const PatientsList = ({ patients, loading, onPatientClick, onEdit, onDelete, onSearch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  const {
    currentPage,
    totalPages,
    currentItems,
    setPage,
    itemsPerPage,
    setItemsPerPage
  } = usePagination(patients, 10);

  const confirmDelete = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (patientToDelete) {
      onDelete(patientToDelete.id);
      setShowDeleteModal(false);
      setPatientToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getAge = (birthDate) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      width: '10%'
    },
    {
      header: 'Nom',
      accessor: 'lastName',
      width: '15%'
    },
    {
      header: 'Prénom',
      accessor: 'firstName',
      width: '15%'
    },
    {
      header: 'Date de naissance',
      accessor: row => formatDate(row.birthDate),
      width: '15%'
    },
    {
      header: 'Âge',
      accessor: row => getAge(row.birthDate),
      width: '5%'
    },
    {
      header: 'Téléphone',
      accessor: 'phone',
      width: '15%'
    },
    {
      header: 'Dernière visite',
      accessor: row => formatDate(row.lastVisit),
      width: '15%'
    },
    {
      header: 'Actions',
      accessor: row => (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(row.id)} variant="secondary" size="sm">
            Modifier
          </Button>
          <Button onClick={() => confirmDelete(row.id)} variant="danger" size="sm">
            Supprimer
          </Button>
        </div>
      ),
      width: '20%'
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <SearchBar 
          onSearch={onSearch}
          placeholder="Rechercher un patient..." 
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            onClick={() => setViewMode('table')} 
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
          >
            Vue Tableau
          </Button>
          <Button 
            onClick={() => setViewMode('cards')} 
            variant={viewMode === 'cards' ? 'primary' : 'secondary'}
          >
            Vue Cartes
          </Button>
        </div>
        
        <div>
          <label className="mr-2">Par page:</label>
          <select 
            value={itemsPerPage} 
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Chargement des patients...</div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-8">Aucun patient trouvé</div>
      ) : viewMode === 'table' ? (
        <Table 
          columns={columns}
          data={currentItems}
          onRowClick={(row) => onPatientClick(row.id)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map(patient => (
            <PatientCard 
              key={patient.id}
              patient={patient}
              onClick={onPatientClick}
              onEdit={onEdit}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setPage}
        />
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        {patientToDelete && (
          <>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer le dossier de {patientToDelete.firstName} {patientToDelete.lastName} ?</p>
            <p className="mb-4 text-red-600 font-semibold">Cette action est irréversible.</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowDeleteModal(false)} variant="secondary">Annuler</Button>
              <Button onClick={handleDelete} variant="danger">Confirmer la suppression</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PatientsList;