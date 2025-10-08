// api/admin/stocksTable/route.ts

import sql from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
     console.log("API ROUTE: Petición GET recibida en /api/admin/stocksTable");
    try{
        const stocks = await sql `SELECT id, ticket, entryprice, active from stocks ORDER BY id ASC`

        console.log("API ROUTE: Datos obtenidos de la DB:", stocks);

        return NextResponse.json(stocks)
    }catch(error){
        console.log('Hubo un error', error)
        return NextResponse.json(
            {message: 'Hubo un error con la base de datos', status: 500}
        )
    }
}

export async function POST(request: Request) {
  try {
    // 1. Obtenemos los datos del nuevo stock desde el frontend
    const { ticket, entryprice, quantity, active } = await request.json();

    // 2. Validación simple para asegurarnos de que los datos necesarios están presentes
    if (!ticket || !entryprice || !quantity) {
      return NextResponse.json(
        { message: "Ticket, precio de entrada y cantidad son requeridos" },
        { status: 400 } // 400 = Bad Request
      );
    }

    // 3. Insertamos el nuevo registro en la base de datos
    // Usamos "RETURNING *" para que la base de datos nos devuelva el objeto recién creado,
    // incluyendo el nuevo 'id' que se generó automáticamente. ¡Esto es muy útil!
    const newStock = await sql`
      INSERT INTO stocks (ticket, entryprice, quantity, active) 
      VALUES (${ticket}, ${entryprice}, ${quantity}, ${active})
      RETURNING *
    `;

    // 4. Devolvemos el stock recién creado al frontend con un estado 201 (Created)
    return NextResponse.json(newStock[0], { status: 201 });

  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json(
      { message: "Error al crear el nuevo stock" },
      { status: 500 }
    );
    }
}