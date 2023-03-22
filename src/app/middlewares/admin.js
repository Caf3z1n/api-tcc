export default async (req, res, next) => {
  if (req.userNivel === 0) {
    return next();
  }
  return res.status(401).json({ error: 'Acesso negado' });
};
