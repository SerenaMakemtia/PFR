// components/users/UsersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import  Card  from '../common/Card';
import  Table  from '../common/Table';
import  SearchBar  from '../common/SearchBar';
import  Button  from '../common/Button';
import  Pagination  from '../common/Pagination';
import  Modal  from '../common/Modal';
import  useApi  from '../../hooks/useApi';
import  usePagination  from '../../hooks/usePagination';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { get, remove } = useApi();
  
  const { 
    page, 
    itemsPerPage, 
    totalItems, 
    totalPages, 
    setTotalItems, 
    handlePageChange 
  } = usePagination();

  useEffect(() => {
    fetchUsers();
  }, [page, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await get(`/users?page=${page}&limit=${itemsPerPage}`);
      setUsers(response.data.items);
      setFilteredUsers(response.data.items);
      setTotalItems(response.data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await remove(`/users/${userToDelete.id}`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getRoleName = (role) => {
    const roleMap = {
      admin: 'Administrateur',
      doctor: 'Médecin',
      nurse: 'Infirmier(ère)',
      staff: 'Personnel administratif'
    };
    return roleMap[role] || role;
  };

  const columns = [
    { 
      header: 'Nom', 
      accessor: 'lastName',
      render: (row) => `${row.lastName} ${row.firstName}`
    },
    { header: 'Nom d\'utilisateur', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Rôle', 
      accessor: 'role',
      render: (row) => getRoleName(row.role)
    },
    { 
      header: 'Statut', 
      accessor: 'isActive',
      render: (row) => (
        <span className={`status-badge ${row.isActive ? 'active' : 'inactive'}`}>
          {row.isActive ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (row) => (
        <div className="table-actions">
          <Link to={`/users/edit/${row.id}`}>
            <Button size="small" variant="secondary">Modifier</Button>
          </Link>
          <Button 
            size="small" 
            variant="danger"
            onClick={() => confirmDelete(row)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card title="Gestion des Utilisateurs">
      <div className="card-header-actions">
        <SearchBar 
          placeholder="Rechercher un utilisateur" 
          onSearch={handleSearch} 
        />
        <Link to="/users/create">
          <Button>Ajouter un utilisateur</Button>
        </Link>
      </div>

      {isLoading ? (
        <p>Chargement des utilisateurs...</p>
      ) : (
        <>
          <Table 
            columns={columns}
            data={filteredUsers}
            emptyMessage="Aucun utilisateur trouvé"
          />
          
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        <div className="delete-confirmation">
          <p>
            Êtes-vous sûr de vouloir supprimer l'utilisateur 
            <strong> {userToDelete?.firstName} {userToDelete?.lastName}</strong> ?
          </p>
          <p>Cette action est irréversible.</p>
          
          <div className="modal-actions">
            <Button 
              variant="danger" 
              onClick={handleDeleteUser}
            >
              Supprimer
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default UsersList;