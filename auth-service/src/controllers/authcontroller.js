import {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUserRole
} from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const { user, token } = await registerUser(email, username, password);
    res.status(201).json({ message: 'Inscription réussie', user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const { user, token } = await loginUser(identifier, password);
    res.json({ message: 'Connexion réussie', user, token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  const user = await getUserById(req.user.userId);
  res.json(user);
};

export const getAllUsersController = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

export const updateUserRoleController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    const updated = await updateUserRole(userId, role);
    res.json({ message: 'Rôle mis à jour', user: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};