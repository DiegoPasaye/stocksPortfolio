// app/page.tsx

import Image from "next/image";
import styles from "./page.module.css";
import PortfolioTable from "./components/PortfolioTable";
import sql from "@/lib/db";

// Definimos un tipo para la data que viene de la base de datos
type StockFromDb = {
  symbol: string;
  entryprice: number;
  quantity: number;
};

// Función para obtener la cotización de la API de Finnhub
async function getInitialQuote(symbol: string) {
  const API_KEY = process.env.FINNHUB_API_KEY;
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.error(`Error fetching initial data for ${symbol}: Status ${response.status}`);
      return { currentPrice: 0, dayChange: 0, percentChange: 0 };
    }
    const data = await response.json();
    if (data.c === undefined) {
       console.warn(`No price data ('c') found for symbol: ${symbol}`);
       return { currentPrice: 0, dayChange: 0, percentChange: 0 };
    }
    return {
      currentPrice: data.c,
      dayChange: data.d,
      percentChange: data.dp,
    };
  } catch (error) {
    console.error(`Network error fetching initial data for ${symbol}:`, error);
    return { currentPrice: 0, dayChange: 0, percentChange: 0 };
  }
}

export default async function Home() {
  // Obtenemos los datos de las acciones desde la base de datos de Neon
  const stocksFromDb = await sql<StockFromDb[]>`
    SELECT 
      ticket AS symbol, 
      entryprice,
      quantity 
    FROM stocks 
    WHERE active = true
  `;

  // Combinamos los datos de la DB con los datos de la API de precios
  const initialData = await Promise.all(
    stocksFromDb.map(async (stock) => {
      const quote = await getInitialQuote(stock.symbol);
      return {
        symbol: stock.symbol,
        entryPrice: Number(stock.entryprice),
        quantity: Number(stock.quantity),
        ...quote
      };
    })
  );

  // Calculamos los totales para las tarjetas de resumen
  const initialCost = initialData.reduce((acc, stock) => acc + (stock.entryPrice * stock.quantity), 0);
  const totalValue = initialData.reduce((acc, stock) => acc + (stock.currentPrice * stock.quantity), 0);
  const unrealizedPNL = totalValue - initialCost;
  const portfolioReturn = initialCost > 0 ? (unrealizedPNL / initialCost) * 100 : 0;

  // Formateamos los valores para mostrarlos
  const formattedTotalValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue);
  const formattedPNL = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', signDisplay: 'always' }).format(unrealizedPNL);
  const formattedReturn = `${portfolioReturn.toFixed(2)}%`;
  const pnlColor = unrealizedPNL >= 0 ? 'green' : 'red';


  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <div>
          <Image src='/stockLogo.svg' alt="Logo icon" width={30} height={30}/>
          <span>Mi Portafolio</span>
        </div>
        <div>
          <a href="">Portafolio</a>
          <a href="">Analisis</a>
          <a href="">Historial</a>
        </div>
      </nav>

      <div className={styles.bodyTittle}>
        <h1>Mi Portafolio de Acciones</h1>
        <p>Seguimiento en tiempo real de tus inversiones.</p>
      </div>

      <section className={styles.portfolioInfo}>
        <div className={styles.portfolioInfoIndividual}>
          <div>
            <Image src='/money.svg' alt="Logo icon" width={20} height={20}/>
            <span>Valor total</span>
          </div>
          <h2>{formattedTotalValue}</h2>
        </div>

        <div className={styles.portfolioInfoIndividual}>
          <div>
            <Image src='/candleStick.svg' alt="candleStick icon" width={20} height={20}/>
            <span>PNL no realizados</span>
          </div>
          <h2 style={{ color: pnlColor }}>{formattedPNL}</h2>
        </div>

        <div className={styles.portfolioInfoIndividual}>
          <div>
            <Image src='/earnings.svg' alt="earnings icon" width={20} height={20}/>
            <span>Rendimiento</span>
          </div>
          <h2 style={{ color: pnlColor }}>{portfolioReturn >= 0 && '+'}{formattedReturn}</h2>
        </div>
      </section>

      <PortfolioTable initialData={initialData} />
    </main>
  );
}