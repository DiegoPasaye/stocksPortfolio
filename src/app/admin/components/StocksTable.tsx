// app/admin/components/StocksTable.tsx
'use client';

import Image from 'next/image';
import styles from './StocksTable.module.css';
import EditStockModal from './EditStockModal';
import { useState } from 'react';

export type Stock = {
    id: number,
    ticket: string,
    entryprice: string,
    active: boolean
}

export default function StocksTable({initialStocks}: {initialStocks: Stock[]}){
  const [stocks, setStocks] = useState(initialStocks);
  // 3. Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);


  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };
const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
  };
  const handleSaveStock = async (updatedStock: Stock) => {
    try {
      const response = await fetch(`/api/admin/stocksTable/${updatedStock.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStock),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el stock');
      }

      // 5. Actualizamos la lista de stocks en el frontend para reflejar el cambio al instante
      setStocks(stocks.map(s => s.id === updatedStock.id ? updatedStock : s));
      handleCloseModal(); // Cerramos el modal

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudieron guardar los cambios.");
    }
  };

  const handleDelete = (id: number) => {
    alert(`Eliminar stock con ID: ${id}`);
  };

    return(
        <div className={styles.tableContainer}>
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Ticket</th>
                <th>Precio de Entrada</th>
                <th>Activo</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {initialStocks.map((stock) => (
                <tr key={stock.id}>
                <td>{stock.ticket}</td>
                <td>${Number(stock.entryprice).toFixed(2)}</td>
                <td>
                    <span className={`${styles.status} ${stock.active ? styles.active : styles.inactive}`}>
                    {stock.active ? 'Sí' : 'No'}
                    </span>
                </td>
                <td className={styles.actionButtonsGroup}>
                    <button onClick={() => handleEdit(stock)} className={`${styles.actionButton} ${styles.editButton}`}>
                        <Image src='edit.svg' alt='Edit icon' width={25} height={25}/>
                    </button>
                    <button onClick={() => handleDelete(stock.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                        <Image src='delete.svg' alt='Delete icon' width={25} height={25}/>
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        {isModalOpen && editingStock && (
            <EditStockModal
            stock={editingStock}
            onClose={handleCloseModal}
            onSave={handleSaveStock}
            />
        )}
        </div>


    )
}
