// components/medical-records/MedicalHistory.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { SearchBar } from '../common/SearchBar';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/dateUtils';

const MedicalHistory = ({ patientId }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { get } = useApi();

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await get(`/patients/${patientId}/medical-history`);
        setMedicalHistory(response.data);
        setFilteredHistory(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching medical history:', error);
        setIsLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [patientId, get]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistory(medicalHistory);
    } else {
      const filtered = medicalHistory.filter(
        (item) =>
          item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.treatment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchTerm, medicalHistory]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const columns = [
    { header: 'Date', accessor: 'date', render: (row) => formatDate(row.date) },
    { header: 'Médecin', accessor: 'doctor' },
    { header: 'Diagnostic', accessor: 'diagnosis' },
    { header: 'Traitement', accessor: 'treatment' },
    { header: 'Type', accessor: 'type' },
  ];

  return (
    <Card title="Historique Médical">
      <SearchBar 
        placeholder="Rechercher par diagnostic, médecin ou traitement" 
        onSearch={handleSearch} 
      />
      {isLoading ? (
        <p>Chargement de l'historique médical...</p>
      ) : (
        <Table 
          columns={columns}
          data={filteredHistory}
          emptyMessage="Aucun historique médical trouvé"
        />
      )}
    </Card>
  );
};

export default MedicalHistory;