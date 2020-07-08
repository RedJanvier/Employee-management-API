export const managerLog = (type, payload = null) => {
  const { manager, employee, status } = payload;
  let msg = '===== MANAGER LOG: ';
  const today = new Date(Date.now());
  switch (type) {
    case 'reset':
      msg += `${manager} did reset his/her password at ${today} ======`;
      break;
    case 'login':
      msg += `${manager} logged into his account at ${today} ======`;
      break;
    case 'create':
      msg += `${manager} created a new employee ${employee} at ${today} ======`;
      break;
    case 'edit':
      msg += `${manager} ${type}d ${employee} ${today} ======`;
      break;
    case 'status':
      msg += `${manager} ${status}d ${employee} at ${today} ======`;
      break;
    case 'search':
      msg += `${manager} searched for employees at ${today} ======`;
      break;
    case 'delete':
      msg += `${manager} deleted an employee with ${employee} uuid at ${today} ======`;
      break;
    default:
  }
  console.log(`${msg}`.blue.underline);
};
