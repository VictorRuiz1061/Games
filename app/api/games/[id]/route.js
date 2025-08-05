import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const id = params.id;
  const games = await prisma.games.findUnique({
    where: { id: parseInt(id) },
  });
  return NextResponse.json(games);
}


export async function PUT(request, { params }) {
  const id = parseInt(params.id);

  try {
    const body = await request.json();

    const updatedGame = await prisma.games.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ message: 'Juego actualizado', data: updatedGame });
  } catch (error) {
    console.error('Error actualizando juego:', error);
    return NextResponse.json({ error: 'Error actualizando juego' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const id = params.id;
  const games = await prisma.games.delete({
    where: { id_usuario: parseInt(id) },
  });
  return NextResponse.json({ message: "Usuario eliminado", data: games });
}










