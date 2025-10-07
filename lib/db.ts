// lib/db.ts

import postgres from 'postgres';

// Leemos la URL de la base de datos desde las variables de entorno
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not defined in environment variables');
}

// Creamos la instancia del cliente SQL
const sql = postgres(connectionString);

export default sql;