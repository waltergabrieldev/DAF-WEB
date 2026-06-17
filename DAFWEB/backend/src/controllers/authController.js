import { User } from '../models/User.js';
import {
  comparePassword,
  createToken,
  hashPassword,
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from '../services/authService.js';

const publicUser = (user) => ({
  id: user.id,
  nome: user.nome,
  name: user.nome,
  email: user.email,
  data_criacao: user.data_criacao,
  created_at: user.data_criacao,
});

export const register = async (req, res) => {
  try {
    const nome = String(req.body.nome || req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const validationError = validateName(nome) || validateEmail(email) || validatePassword(password);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email ja cadastrado' });
    }

    const senhaHash = await hashPassword(password);
    const newUser = await User.create({ nome, email, senhaHash });
    const token = createToken(newUser);

    res.status(201).json({
      message: 'Usuario criado com sucesso',
      token,
      user: publicUser(newUser),
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro ao registrar usuario' });
  }
};

export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const validationError = validateEmail(email) || (!password ? 'Senha e obrigatoria' : null);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha invalidos' });
    }

    const passwordMatch = await comparePassword(password, user.senha_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha invalidos' });
    }

    const token = createToken(user);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};
