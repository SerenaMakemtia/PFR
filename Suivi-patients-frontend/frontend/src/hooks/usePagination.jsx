import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePagination = (fetchFunction, defaultParams = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    from: null,
    last_page: 1,
    path: '',
    per_page: 10,
    to: null,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extraire les paramètres de l'URL ou utiliser les valeurs par défaut
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || defaultParams.perPage || '10', 10);
  const search = searchParams.get('search') || defaultParams.search || '';
  const sortBy = searchParams.get('sort_by') || defaultParams.sortBy || '';
  const sortDirection = searchParams.get('sort_direction') || defaultParams.sortDirection || 'asc';

  // Préparer les paramètres de requête
  const queryParams = {
    page,
    per_page: perPage,
    ...(search && { search }),
    ...(sortBy && { sort_by: sortBy, sort_direction: sortDirection }),
    ...Object.entries(defaultParams)
      .filter(([key]) => !['perPage', 'search', 'sortBy', 'sortDirection'].includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  };

  // Fonction pour mettre à jour les paramètres d'URL
  const updateParams = useCallback((newParams) => {
    const currentParams = {};
    searchParams.forEach((value, key) => {
      currentParams[key] = value;
    });

    const updatedParams = { ...currentParams, ...newParams };
    
    // Supprimer les paramètres vides
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key]) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  // Fonction pour changer de page
  const goToPage = useCallback((newPage) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  // Fonction pour changer le nombre d'éléments par page
  const setItemsPerPage = useCallback((newPerPage) => {
    updateParams({ page: 1, per_page: newPerPage });
  }, [updateParams]);

  // Fonction pour effectuer une recherche
  const performSearch = useCallback((searchText) => {
    updateParams({ page: 1, search: searchText });
  }, [updateParams]);

  // Fonction pour trier les données
  const sortData = useCallback((column) => {
    let direction = 'asc';
    
    if (sortBy === column) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    updateParams({
      sort_by: column,
      sort_direction: direction
    });
  }, [sortBy, sortDirection, updateParams]);

  // Charger les données
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchFunction(queryParams);
      
      if (response.data) {
        setData(response.data);
      } else {
        setData(response);
      }
      
      if (response.meta) {
        setMeta(response.meta);
      } else if (response.links) {
        // Extraire les informations de pagination à partir des liens
        const lastPageMatch = response.links.last?.match(/page=(\d+)/);
        const lastPage = lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1;
        
        setMeta({
          current_page: response.current_page || page,
          last_page: lastPage,
          total: response.total || 0,
          per_page: response.per_page || perPage,
          from: response.from,
          to: response.to,
          path: response.path || '',
        });
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, queryParams, page, perPage]);

  // Effet pour charger les données lorsque les paramètres changent
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    meta,
    isLoading,
    error,
    goToPage,
    setItemsPerPage,
    performSearch,
    sortData,
    refresh: fetchData,
    currentPage: page,
    itemsPerPage: perPage,
    searchTerm: search,
    sortBy,
    sortDirection,
  };
};

export default usePagination;