// app/api/admin/stocksTable/[id]/route.ts

import sql from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    // 1. Obtenemos los datos actualizados del cuerpo de la petición
    const { ticket, entryprice, active } = await request.json();

    // 2. Validación simple de los datos (puedes añadir más)
    if (!ticket || !entryprice) {
      return NextResponse.json({ message: 'Ticket y precio de entrada son requeridos' }, { status: 400 });
    }

    // 3. Ejecutamos la consulta UPDATE en la base de datos
    await sql`
      UPDATE stocks
      SET ticket = ${ticket}, entryprice = ${entryprice}, active = ${active}
      WHERE id = ${id}
    `;

    // 4. Devolvemos una respuesta exitosa
    return NextResponse.json({ message: 'Stock actualizado con éxito' }, { status: 200 });

  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ message: 'Error al actualizar el stock' }, { status: 500 });
  }
}