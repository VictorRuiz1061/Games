import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";
import { join } from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Helpers
const json = (data, status = 200) => NextResponse.json(data, { status });

async function saveCoverFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}_${file.name || "cover.jpg"}`;
  const uploadDir = join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  fs.writeFileSync(join(uploadDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

// GET: Listar juegos
export async function GET() {
  const games = await prisma.games.findMany();
  return json(games);
}

// POST: Crear juego
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const year = parseInt(formData.get("year"));
    const plataformId = parseInt(formData.get("plataformId"));
    const categoryId = parseInt(formData.get("categoryId"));
    const coverFile = formData.get("cover");

    // Validaciones básicas
    if (!title || !year || !plataformId || !categoryId || !coverFile)
      return json({ error: "Todos los campos son obligatorios" }, 400);

    if (isNaN(year)) return json({ error: "El campo 'year' debe ser un número válido" }, 400);

    if (!(coverFile instanceof File))
      return json({ error: "El archivo 'cover' no es válido" }, 400);

    // Guardar imagen
    const imageUrl = await saveCoverFile(coverFile);

    // Validar relaciones
    const [platformExists, categoryExists] = await Promise.all([
      prisma.platforms.findUnique({ where: { id: plataformId } }),
      prisma.categories.findUnique({ where: { id: categoryId } })
    ]);

    if (!platformExists) return json({ error: "La plataforma seleccionada no existe" }, 400);
    if (!categoryExists) return json({ error: "La categoría seleccionada no existe" }, 400);

    // Crear juego
    const newGame = await prisma.games.create({
      data: {
        title: String(title),
        year,
        cover: imageUrl,
        platform: { connect: { id: plataformId } },
        category: { connect: { id: categoryId } }
      }
    });

    return json({ message: "Juego creado exitosamente", data: newGame });
  } catch (error) {
    console.error("Error al crear juego:", error);
    return json({ error: error.message || "Error al procesar la solicitud" }, 500);
  }
}
