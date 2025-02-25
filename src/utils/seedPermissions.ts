import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const permissoes = [
  { nome: "gerar_senha", descricao: "Permite gerar senhas" },
  { nome: "chamar_senha", descricao: "Permite chamar senhas" },
  { nome: "gerenciar_usuarios", descricao: "Permite gerenciar usuários" },
  { nome: "gerenciar_setores", descricao: "Permite gerenciar setores" },
  {
    nome: "gerenciar_funcionarios",
    descricao: "Permite gerenciar funcionários",
  },
];

async function seed() {
  for (const permissao of permissoes) {
    await prisma.permissao.upsert({
      where: { nome: permissao.nome },
      update: {},
      create: permissao,
    });
  }
  console.log("Permissões cadastradas com sucesso!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
