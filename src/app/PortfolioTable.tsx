// app/components/PortfolioTable.tsx

'use client'; // MUY IMPORTANTE: Esto lo convierte en un Componente de Cliente

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "../page.module.css"; // Ajusta la ruta si es necesario

// Definimos la estructura de los datos que manejaremos
interface StockData {
  symbol: string;
  currentPrice: number;
  dayChange: number;
  percentChange: number;
  entryPrice: number; // Suponemos que este valor lo tienes guardado
}

// Función para obtener la cotización de un solo activo desde Finnhub
async function getStockQuote(symbol: string): Promise<any> {
  const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY; // ¡Recuerda el NEXT_PUBLIC_!
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Error fetching data for ${symbol}`);
    return null;
  }
  return response.json();
}

// El componente recibe los datos iniciales como props
export default function PortfolioTable({ initialData }: { initialData: StockData[] }) {
  // El estado guardará los datos del portafolio y se actualizará
  const [portfolio, setPortfolio] = useState(initialData);

  useEffect(() => {
    // Esta función se encargará de actualizar los datos
    const updateData = async () => {
      console.log("Actualizando datos del portafolio...");

      // Usamos Promise.all para hacer todas las llamadas a la API en paralelo
      const updatedQuotes = await Promise.all(
        initialData.map(stock => getStockQuote(stock.symbol))
      );
      
      // Creamos un nuevo array con los datos actualizados
      const updatedPortfolio = initialData.map((stock, index) => {
        const quote = updatedQuotes[index];
        if (quote) {
          return {
            ...stock, // Mantenemos el symbol y entryPrice
            currentPrice: quote.c,
            dayChange: quote.d,
            percentChange: quote.dp,
          };
        }
        return stock; // Si falla la llamada, mantenemos el dato anterior
      });

      setPortfolio(updatedPortfolio);
    };

    // --- Aquí está la magia del Polling ---
    // Se ejecuta `updateData` cada 30 segundos (30000 milisegundos)
    const intervalId = setInterval(updateData, 30000);

    // Es VITAL limpiar el intervalo cuando el componente se "desmonta"
    // para evitar fugas de memoria.
    return () => clearInterval(intervalId);

  }, [initialData]); // El array de dependencias

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Activo</th>
          <th>Precio actual</th>
          <th>Variación del día (%)</th>
          <th>PNL Total</th>
          {/* Añade más columnas si las necesitas */}
        </tr>
      </thead>
      <tbody>
        {portfolio.map((stock) => {
          const pnlTotal = ((stock.currentPrice - stock.entryPrice) / stock.entryPrice) * 100;
          const pnlColor = pnlTotal >= 0 ? 'green' : 'red';
          const dayChangeColor = stock.dayChange >= 0 ? 'green' : 'red';

          return (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>${stock.currentPrice.toFixed(2)}</td>
              <td style={{ color: dayChangeColor }}>{stock.percentChange.toFixed(2)}%</td>
              <td style={{ color: pnlColor }}>
                <Image className={styles.tableIcon} src='/earnings.svg' alt="earnings icon" width={20} height={20}/>
                {pnlTotal.toFixed(2)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}