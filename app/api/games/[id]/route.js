import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Utilidades
const json = (data, status = 200) => NextResponse.json(data, { status });

const parseId = (idParam) => {
  const id = parseInt(idParam);
  return isNaN(id) ? null : id;
};

async function saveCoverFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uniqueFilename = `${uuidv4()}_${file.name.replace(/\s/g, "_")}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filePath = join(uploadDir, uniqueFilename);
  await writeFile(filePath, buffer);
  return `/uploads/${uniqueFilename}`;
}

// Handlers
export async function GET(_, { params }) {
  try {
    const id = parseId(params.id);
    if (!id) return json({ error: "ID no válido" }, 400);

    const game = await prisma.games.findUnique({ where: { id } });
    if (!game) return json({ error: "Juego no encontrado" }, 404);

    return json(game);
  } catch (error) {
    console.error("Error obteniendo juego:", error);
    return json({ error: "Error al obtener el juego" }, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseId(params.id);
    if (!id) return json({ error: "ID no válido" }, 400);

    const existingGame = await prisma.games.findUnique({ where: { id } });
    if (!existingGame) return json({ error: "Juego no encontrado" }, 404);

    const formData = await request.formData();
    const yearInt = parseInt(formData.get("year"));
    if (isNaN(yearInt))
      return json({ error: "El campo 'year' debe ser un número válido" }, 400);

    const updateData = {
      title: formData.get("title"),
      plataformId: parseInt(formData.get("plataformId")),
      categoryId: parseInt(formData.get("categoryId")),
      year: yearInt,
    };

    const coverFile = formData.get("cover");
    if (coverFile instanceof File) {
      updateData.cover = await saveCoverFile(coverFile);
    }

    const updatedGame = await prisma.games.update({
      where: { id },
      data: updateData,
    });

    return json({ message: "Juego actualizado correctamente", data: updatedGame });
  } catch (error) {
    console.error("Error actualizando juego:", error);
    return json({ error: "Error al actualizar el juego" }, 500);
  }
}

export async function DELETE(_, { params }) {
  try {
    const id = parseId(params.id);
    if (!id) return json({ error: "ID no válido" }, 400);

    const existingGame = await prisma.games.findUnique({ where: { id } });
    if (!existingGame) return json({ error: "Juego no encontrado" }, 404);

    await prisma.games.delete({ where: { id } });
    return json({ message: "Juego eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando juego:", error);
    return json({ error: "Error al eliminar el juego" }, 500);
  }
}
