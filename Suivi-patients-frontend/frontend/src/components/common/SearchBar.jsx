import React, { useState } from 'react';
import  Input  from './Input';
import  Button  from './Button';

const SearchBar = ({ onSearch, placeholder = "Rechercher..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // Default search by name

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ term: searchTerm, searchBy });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <div className="flex-grow">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      </div>
      
      <div className="flex-shrink-0">
        <select 
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="name">Par nom</option>
          <option value="firstName">Par prénom</option>
          <option value="id">Par numéro de dossier</option>
          <option value="birthDate">Par date de naissance</option>
          <option value="lastVisit">Par dernière consultation</option>
          <option value="specialty">Par spécialité médicale</option>
        </select>
      </div>
      
      <Button type="submit" className="flex-shrink-0">
        Rechercher
      </Button>
    </form>
  );
};

export default SearchBar;