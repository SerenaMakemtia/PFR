// components/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApi } from '../../hooks/useApi';

const UserForm = ({ userId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff',
    speciality: '',
    username: '',
    password: '',
    confirmPassword: '',
    isActive: true,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { get, post, put } = useApi();

  useEffect(() => {
    if (userId) {
      setIsEditing(true);
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await get(`/users/${userId}`);
      const userData = response.data;
      
      // Remove password fields for editing
      const { password, ...userDataWithoutPassword } = userData;
      
      setFormData({
        ...userDataWithoutPassword,
        password: '',
        confirmPassword: '',
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }
    
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    } else if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (formData.role === 'doctor' && !formData.speciality) {
      newErrors.speciality = 'La spécialité est requise pour les médecins';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dataToSend = { ...formData };
      
      // If password is empty in edit mode, remove it from submission
      if (isEditing && !dataToSend.password) {
        delete dataToSend.password;
      }
      
      // Remove confirmPassword as it's not needed for API
      delete dataToSend.confirmPassword;
      
      if (isEditing) {
        await put(`/users/${userId}`, dataToSend);
      } else {
        await post('/users', dataToSend);
      }
      
      setIsLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card title={isEditing ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <Input
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <Input
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>
        
        <div className="form-row">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Téléphone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="admin">Administrateur</option>
              <option value="doctor">Médecin</option>
              <option value="nurse">Infirmier(ère)</option>
              <option value="staff">Personnel administratif</option>
            </select>
          </div>
          
          {formData.role === 'doctor' && (
            <Input
              label="Spécialité"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              error={errors.speciality}
              required={formData.role === 'doctor'}
            />
          )}
        </div>
        
        <div className="form-row">
          <Input
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive">Utilisateur actif</label>
          </div>
        </div>
        
        <div className="form-row">
          <Input
            label={isEditing ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required={!isEditing}
          />
          <Input
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required={!isEditing || formData.password.length > 0}
          />
        </div>
        
        <div className="form-actions">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer l\'utilisateur'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserForm;