// app/admin/components/AddStockModal.tsx

'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

// Definimos el tipo para los datos del formulario (sin el 'id')
export type NewStockData = {
  ticket: string;
  entryprice: string;
  quantity: string;
  active: boolean;
};

// Definimos las props que el componente necesita
interface AddStockModalProps {
  onClose: () => void;
  onSave: (newStock: NewStockData) => void;
}

const initialState: NewStockData = {
  ticket: '',
  entryprice: '',
  quantity: '1',
  active: true,
};

export default function AddStockModal({ onClose, onSave }: AddStockModalProps) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Agregar Nueva Posición</h2>
        <form onSubmit={handleSubmit}>
          {/* Los campos del formulario son los mismos que tenías antes */}
          <div className={styles.formGroup}>
            <label htmlFor="ticket">Ticket</label>
            <input
              type="text"
              id="ticket"
              name="ticket"
              value={formData.ticket}
              onChange={handleChange}
              placeholder="Ej. AAPL"
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
              step="0.01"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Cantidad</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              step="1"
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
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}