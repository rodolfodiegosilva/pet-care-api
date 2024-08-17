class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;

    // Se for um cliente, inclui detalhes específicos de cliente
    if (user.role === 'client' && user.clientDetails) {
      this.clientType = user.clientDetails.clientType;
      this.planId = user.clientDetails.planId; // Inclui o plano se houver
    }

    // Se for um funcionário, inclui detalhes específicos de funcionário
    if (user.role === 'employee' && user.employeeDetails) {
      this.employeeType = user.employeeDetails.employeeType;
      this.department = user.employeeDetails.department; // Inclui o departamento se houver
    }
  }

  getId(){
    return this.id;
  }
}

module.exports = UserDTO;
