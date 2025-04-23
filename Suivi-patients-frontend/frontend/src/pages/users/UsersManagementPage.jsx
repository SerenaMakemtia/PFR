// pages/users/UsersManagementPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UsersList from '../../components/users/UsersList';
import UserForm from '../../components/users/UserForm';

const UsersManagementPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isCreating = window.location.pathname.includes('/users/create');

  const handleSubmitSuccess = () => {
    navigate('/users');
  };

  return (
    <div className="users-management-page">
      <h1>{isCreating ? 'Créer un nouvel utilisateur' : userId ? 'Modifier l\'utilisateur' : 'Gestion des utilisateurs'}</h1>
      
      {isCreating || userId ? (
        <UserForm 
          userId={userId} 
          onSubmitSuccess={handleSubmitSuccess} 
        />
      ) : (
        <UsersList />
      )}
    </div>
  );
};

export default UsersManagementPage;