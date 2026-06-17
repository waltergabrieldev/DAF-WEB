import prisma from '../prismaClient.js';

export const User = {
  async create({ nome, email, senhaHash }) {
    return prisma.users.create({
      data: {
        nome,
        email,
        senha_hash: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        data_criacao: true,
      },
    });
  },

  async findByEmail(email) {
    return prisma.users.findUnique({
      where: { email },
    });
  },

  async findById(id) {
    return prisma.users.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        data_criacao: true,
      },
    });
  },
};
