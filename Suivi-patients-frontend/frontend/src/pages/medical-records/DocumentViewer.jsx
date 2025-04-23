// components/medical-records/DocumentViewer.jsx
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

const DocumentViewer = ({ document }) => {
  const [showModal, setShowModal] = useState(false);

  if (!document) {
    return <div>Aucun document sélectionné</div>;
  }

  const renderDocumentContent = () => {
    switch (document.type) {
      case 'pdf':
        return (
          <iframe
            src={document.url}
            title={document.title}
            width="100%"
            height="500px"
            style={{ border: 'none' }}
          />
        );
      case 'image':
        return (
          <img
            src={document.url}
            alt={document.title}
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        );
      default:
        return <div>Type de document non pris en charge</div>;
    }
  };

  return (
    <Card title={document.title}>
      <div className="document-info">
        <p><strong>Type:</strong> {document.type}</p>
        <p><strong>Date:</strong> {document.date}</p>
        <p><strong>Ajouté par:</strong> {document.uploadedBy}</p>
      </div>
      <div className="document-actions">
        <Button onClick={() => setShowModal(true)}>Voir le document</Button>
        <Button variant="secondary" onClick={() => window.open(document.url, '_blank')}>
          Télécharger
        </Button>
      </div>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={document.title}
        size="large"
      >
        <div className="document-viewer">
          {renderDocumentContent()}
        </div>
      </Modal>
    </Card>
  );
};

export default DocumentViewer;