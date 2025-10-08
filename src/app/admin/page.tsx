// app/admin/page.tsx

'use client'

import styles from "./admin.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import StocksTable, {type Stock} from "./components/StocksTable";
import AddStockModal from "./components/AddStockModal";

export default function AdminPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Estado para controlar el modal de "Agregar"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // useEffect para obtener los stocks (sin cambios)
  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/stocksTable');
        if (!response.ok) throw new Error('La respuesta de la red no fue exitosa');
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error("Error al obtener los stocks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocks();
  }, [pathname]);

  // useEffect para el menú (sin cambios)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // La función para guardar el nuevo stock (sin cambios)
  const handleAddStock = async (newStockData: any) => {
    try {
      const response = await fetch('/api/admin/stocksTable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket: newStockData.ticket.toUpperCase(),
          entryprice: parseFloat(newStockData.entryprice),
          quantity: parseInt(newStockData.quantity, 10),
          active: newStockData.active
        }),
      });

      if (!response.ok) throw new Error('Error al agregar la posición');

      const addedStock = await response.json();
      setStocks(prevStocks => [...prevStocks, addedStock]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('No se pudo agregar la posición.');
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return(
    <section className={styles.adminPage}>
      {/* ... (Tu navbar móvil se queda igual) ... */}
      
      <div className={styles.adminStyles}>
        <h2>Panel de administrador</h2>
        <hr />
        
        {/* TU ESTRUCTURA ORIGINAL, EXACTAMENTE COMO LA QUERÍAS */}
        <div className={styles.adminActions}>
          {/* 1. El input está aquí solo como placeholder visual, sin estado ni funcionalidad */}
          <input type="text" placeholder={'Escribe algún ticket'} />

          {/* 2. El botón solo se encarga de abrir el modal */}
          <button onClick={() => setIsAddModalOpen(true)}>
            <Image src={'/create.svg'} alt="create icon" width={20} height={20} />
            Agregar posición
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Cargando activos...</p>
      ) : (
        <StocksTable initialStocks={stocks} />
      )}

      {/* 3. El modal se abre con campos vacíos, sin recibir ninguna prop extra */}
      {isAddModalOpen && (
        <AddStockModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddStock}
        />
      )}

      {/* ... (Tu menú overlay móvil se queda igual) ... */}
    </section>
  )
}