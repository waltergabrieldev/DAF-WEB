import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

export const normalizeEmail = (email) => {
  return String(email || '').trim().toLowerCase();
};

export const validateName = (nome) => {
  const normalizedName = String(nome || '').trim();

  if (!normalizedName) {
    return 'Nome e obrigatorio';
  }

  if (normalizedName.length < 2) {
    return 'Nome deve ter no minimo 2 caracteres';
  }

  return null;
};

export const validateEmail = (email) => {
  if (!email) {
    return 'Email e obrigatorio';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Email invalido';
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Senha e obrigatoria';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Senha deve ter no minimo ${MIN_PASSWORD_LENGTH} caracteres`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Senha deve ter no maximo ${MAX_PASSWORD_LENGTH} caracteres`;
  }

  if (/\s/.test(password)) {
    return 'Senha nao deve conter espacos';
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Senha deve conter letras e numeros';
  }

  return null;
};

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

export const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET nao configurado no servidor');
  }

  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};
