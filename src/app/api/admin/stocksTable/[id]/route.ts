// app/api/admin/stocksTable/[id]/route.ts

import sql from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

// ✅ ESTA ES LA FIRMA CORRECTA Y ROBUSTA
export async function PUT( //ESTE ES EL CAMBIO QUE DA ERROR EN PRODUCCION, SE USA PROMISA Y ADEMAS ABAJO
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Extraemos el id desde context.params
    const { id } = await context.params; //AQUIIIIIIIIIIIIIII
    const { ticket, entryprice, active } = await request.json();

    if (!ticket || !entryprice) {
      return NextResponse.json({ message: 'Ticket y precio de entrada son requeridos' }, { status: 400 });
    }

    await sql`
      UPDATE stocks
      SET ticket = ${ticket}, entryprice = ${entryprice}, active = ${active}
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Stock actualizado con éxito' }, { status: 200 });

  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ message: 'Error al actualizar el stock' }, { status: 500 });
  }
}