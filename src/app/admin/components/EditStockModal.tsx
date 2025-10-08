// app/admin/components/EditStockModal.tsx

'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { type Stock } from './StocksTable'; // Importamos el tipo que ya definimos

interface EditStockModalProps {
  stock: Stock;
  onClose: () => void;
  onSave: (updatedStock: Stock) => void;
}

export default function EditStockModal({ stock, onClose, onSave }: EditStockModalProps) {
  // Creamos un estado local para manejar los cambios del formulario
  // Lo inicializamos con los datos del stock que estamos editando
  const [formData, setFormData] = useState(stock);

  // Sincronizamos el estado del formulario si el stock de las props cambia
  useEffect(() => {
    setFormData(stock);
  }, [stock]);

  // Manejador para actualizar el estado cuando el usuario escribe en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Manejador para cuando se envía el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evitamos que la página se recargue
    onSave(formData); // Llamamos a la función onSave con los datos actualizados
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Editar Activo: {stock.ticket}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="ticket">Ticket</label>
            <input
              type="text"
              id="ticket"
              name="ticket"
              value={formData.ticket}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="entryprice">Precio de Entrada</label>
            <input
              type="number"
              id="entryprice"
              name="entryprice"
              value={formData.entryprice}
              onChange={handleChange}
              step="0.01" // Permite decimales
              required
            />
          </div>
          <div className={styles.formGroupCheckbox}>
            <label htmlFor="active">Activo</label>
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}