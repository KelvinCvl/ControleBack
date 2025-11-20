import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requis' });
  }

  const token = bearer.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: payload.userId,
      role: payload.role
    };

    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'ADMIN uniquement' });
  }
  next();
};