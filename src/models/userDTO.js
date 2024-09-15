class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;

    if (user.role === 'client' && user.clientDetails) {
      this.clientType = user.clientDetails.clientType;
      this.planId = user.clientDetails.planId;
    }

    if (user.role === 'employee' && user.employeeDetails) {
      this.employeeType = user.employeeDetails.employeeType;
      this.department = user.employeeDetails.department;
    }
  }

  getId() {
    return this.id;
  }
}
module.exports = UserDTO;
