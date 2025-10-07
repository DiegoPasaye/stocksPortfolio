import Image from "next/image";
import styles from "./page.module.css";
import PortfolioTable from "./components/PortfolioTable";



async function getInitialQuote(symbol: string) {
  const API_KEY = process.env.FINNHUB_API_KEY;
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.error(`Error fetching initial data for ${symbol}: Status ${response.status}`);
      // Si la respuesta es un error, devuelve valores por defecto
      return { currentPrice: 0, dayChange: 0, percentChange: 0 };
    }

    const data = await response.json();
    
    // Si la respuesta es exitosa pero no contiene el precio, también devuelve valores por defecto
    if (data.c === undefined) {
       console.warn(`No price data ('c') found for symbol: ${symbol}`);
       return { currentPrice: 0, dayChange: 0, percentChange: 0 };
    }

    // Si todo está bien, devuelve los datos correctos
    return {
      currentPrice: data.c,
      dayChange: data.d,
      percentChange: data.dp,
    };
  } catch (error) {
    console.error(`Network error fetching initial data for ${symbol}:`, error);
    // Si hay un error de red, devuelve valores por defecto
    return { currentPrice: 0, dayChange: 0, percentChange: 0 };
  }
}

export default async function Home() {

  const myPortfolio = [
    { symbol: 'AAPL', entryPrice: 150.00 },
    { symbol: 'MSFT', entryPrice: 300.00 },
    { symbol: 'GOOGL', entryPrice: 120.00 },
    { symbol: 'AMZN', entryPrice: 135.00 },
    { symbol: 'TSLA', entryPrice: 250.00 },
    { symbol: 'NVDA', entryPrice: 450.00 },
    { symbol: 'META', entryPrice: 310.00 },
    { symbol: 'JPM', entryPrice: 140.00 },
    { symbol: 'V', entryPrice: 240.00 },
    { symbol: 'UNH', entryPrice: 500.00 },
  ];

  const initialData = await Promise.all(
    myPortfolio.map(async (stock) => {
      const quote = await getInitialQuote(stock.symbol);
      return {
        ...stock,
        ...quote
      };
    })
  );


  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <div>
          <Image src='stockLogo.svg' alt="Logo icon" width={30} height={30}/>
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
            <Image src='money.svg' alt="Logo icon" width={20} height={20}/>
            <span>Valor total</span>
          </div>
          <h2>$40000</h2>
        </div>


        <div className={styles.portfolioInfoIndividual}>
          <div>
            <Image src='candleStick.svg' alt="candleStick icon" width={20} height={20}/>
            <span>PNL no realizados</span>
          </div>
          <h2>+$40000</h2>
        </div>


        <div className={styles.portfolioInfoIndividual}>
          <div>
            <Image src='earnings.svg' alt="earnings icon" width={20} height={20}/>
            <span>Rendimiento</span>
          </div>
          <h2>+20%</h2>
        </div>
      </section>


      <PortfolioTable initialData={initialData} />

    </main>
  );
}
