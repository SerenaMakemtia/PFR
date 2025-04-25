import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  data,
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  sortable = true,
  pagination,
  className = '',
  striped = true,
  hoverable = true,
  compact = false,
  bordered = false,
  selectedRowIds = [],
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  const tableClasses = [
    'min-w-full divide-y divide-gray-200',
    bordered ? 'border border-gray-200 rounded-lg' : '',
    className
  ].filter(Boolean).join(' ');

  const rowClasses = [
    hoverable ? 'hover:bg-gray-50' : '',
    onRowClick ? 'cursor-pointer' : ''
  ].filter(Boolean).join(' ');

  const cellClasses = compact ? 'px-3 py-2' : 'px-6 py-4';

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${cellClasses} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable !== false && sortable ? 'cursor-pointer select-none' : ''
                } ${column.width ? column.width : ''}`}
                onClick={() => {
                  if (column.sortable !== false && sortable) {
                    handleSort(column.key);
                  }
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {column.sortable !== false && sortable && (
                    <span className="ml-1">{renderSortIcon(column.key)}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`${rowClasses} ${
                  striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''
                } ${selectedRowIds.includes(row.id) ? 'bg-blue-50' : ''}`}
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.key}`}
                    className={`${cellClasses} text-sm text-gray-900 whitespace-nowrap ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && <div className="mt-4">{pagination}</div>}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      width: PropTypes.string,
      className: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  loading: PropTypes.bool,
  onRowClick: PropTypes.func,
  sortable: PropTypes.bool,
  pagination: PropTypes.node,
  className: PropTypes.string,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  compact: PropTypes.bool,
  bordered: PropTypes.bool,
  selectedRowIds: PropTypes.array,
};

export default Table;