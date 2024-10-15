const getAvailableEmployeesForService = async (serviceId, scheduledDate) => {
    // Obter funcionários que realizam o serviço
    const employees = await employeeRepository.findEmployeesByService(serviceId);
  
    // Filtrar funcionários disponíveis no horário
    const availableEmployees = [];
    for (const employee of employees) {
      const isAvailable = await appointmentRepository.isEmployeeAvailable(employee._id, scheduledDate);
      if (isAvailable) {
        availableEmployees.push(employee);
      }
    }
  
    return availableEmployees;
  };