import express from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes from './routes/auth';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bem-vindo ao Controle de Senhas!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



app.use('/auth', authRoutes);