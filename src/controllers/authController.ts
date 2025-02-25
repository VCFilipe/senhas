import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { permissoes: true }, // Inclui as permissões
  });

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    res.status(401).json({ message: "Credenciais inválidas" });
  } else {
    const token = jwt.sign(
      { id: usuario.id, permissoes: usuario.permissoes.map((p) => p.nome) }, // Inclui as permissões no token
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, senha, permissoes } = req.body;
  const hashedSenha = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      email,
      senha: hashedSenha,
      permissoes: {
        connect: permissoes.map((nome: string) => ({ nome })), // Conecta as permissões existentes
      },
    },
    include: { permissoes: true }, // Inclui as permissões na resposta
  });

  res.status(201).json(usuario);
};
