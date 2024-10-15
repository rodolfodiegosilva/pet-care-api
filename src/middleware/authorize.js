module.exports = (allowedRoles) => (req, res, next) => {
  console.log('Iniciando middleware de autorização');
  console.log('allowedRoles:', allowedRoles);
  console.log('req.user:', req.user);

  if (!req.user) {
    console.log('Usuário não autenticado');
    return res.status(401).json({ message: 'Acesso negado. Usuário não autenticado.' });
  }

  const { role, employeeType } = req.user;

  if (role === 'client') {
    if (!allowedRoles.includes('client')) {
      console.log('Cliente sem permissão');
      return res.status(403).json({ message: 'Acesso negado' });
    }
  } else if (role === 'employee') {
    if (!allowedRoles.includes(employeeType)) {
      console.log('Funcionário sem permissão. employeeType:', employeeType);
      return res.status(403).json({ message: 'Acesso negado' });
    }
  } else {
    console.log('Papel desconhecido:', role);
    return res.status(403).json({ message: 'Acesso negado' });
  }

  console.log('Autorização concedida');
  next();
};
