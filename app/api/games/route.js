import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET() {
  const games = await prisma.games.findMany();
  return NextResponse.json(games);
}
export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const year = formData.get("year");
    const plataformId = formData.get("plataformId");
    const categoryId = formData.get("categoryId");
    const coverFile = formData.get("cover");

    if (!title || !year || !plataformId || !categoryId || !coverFile) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (!(coverFile instanceof File)) {
      return NextResponse.json({ error: "El archivo 'cover' no es válido" }, { status: 400 });
    }

    const bytes = await coverFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${coverFile.name || "cover.jpg"}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // ✅ Convertir año a fecha válida
    const parsedYear = new Date();
    if (isNaN(parsedYear.getTime())) {
      return NextResponse.json({ error: "El campo 'year' no es una fecha válida" }, { status: 400 });
    }

    const newGame = await prisma.games.create({
      data: {
        title: String(title),
        year: parsedYear,
        plataformId: parseInt(String(plataformId)),
        categoryId: parseInt(String(categoryId)),
        cover: imageUrl,
      },
    });

    return NextResponse.json({
      message: "Juego creado exitosamente",
      data: newGame,
    });
  } catch (error) {
    console.error("Error al crear juego:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

