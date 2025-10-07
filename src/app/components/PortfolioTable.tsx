// app/components/PortfolioTable.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "../page.module.css";

// 1. DEFINICIONES DE TIPOS
interface StockData {
  symbol: string;
  currentPrice: number;
  dayChange: number;
  percentChange: number;
  entryPrice: number;
}

// ✅ NUEVO: Interfaz específica para la respuesta de la API
interface FinnhubQuoteResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
}
async function getStockQuote(symbol: string): Promise<FinnhubQuoteResponse | null> {
  const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY; 
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching data for ${symbol}: ${response.statusText}`);
      return null;
    }
    const data: FinnhubQuoteResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Network error or other issue fetching ${symbol}:`, error);
    return null;
  }
}
// 3. EL COMPONENTE PRINCIPAL
export default function PortfolioTable({ initialData }: { initialData: StockData[] }) {
  const [portfolio, setPortfolio] = useState(initialData);

  useEffect(() => {
    const updateData = async () => {
      console.log("Actualizando datos del portafolio...");
      
      const symbols = portfolio.map(s => s.symbol);
      const updatedQuotes = await Promise.all(
        symbols.map(symbol => getStockQuote(symbol))
      );
      
      setPortfolio(prevPortfolio => 
        prevPortfolio.map((stock, index) => {
          const quote = updatedQuotes[index];

          if (quote && quote.c !== undefined) {
            return {
              ...stock,
              currentPrice: quote.c,
              dayChange: quote.d,
              percentChange: quote.dp,
            };
          }
          return stock; 
        })
      );
    };

    const intervalId = setInterval(updateData, 30000);
    return () => clearInterval(intervalId);
  }, [portfolio]);

  // 4. EL JSX QUE SE RENDERIZA
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Activo</th>
          <th>Precio actual</th>
          <th>Variación del día (%)</th>
          <th>PNL Total</th>
        </tr>
      </thead>
      <tbody>
        {portfolio.map((stock) => {
          const pnlTotal = stock.entryPrice > 0 
            ? ((stock.currentPrice - stock.entryPrice) / stock.entryPrice) * 100 
            : 0;
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