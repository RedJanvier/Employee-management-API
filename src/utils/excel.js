import { resolve } from 'path';
import { readFile, utils } from 'xlsx';

export const uploadXL = (req) => {
  if (!req.files) {
    console.log('No files were uploaded.');
    return false;
  }

  const sampleFile = req.files.employees;

  const uploadPath = resolve(__dirname, '../uploads/', 'Boo21.xlsx');

  return sampleFile.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
      return false;
    }

    return true;
  });
};

export const readXL = () => {
  const wb = readFile(resolve(__dirname, '../uploads/', 'Boo21.xlsx'), {
    cellDates: true
  });
  const ws = wb.Sheets.Sheet1;
  const employeesList = utils.sheet_to_json(ws).map((entry) => ({
    name: entry.name,
    email: entry.email,
    phone: entry.phone,
    nid: entry.nid,
    position: entry.position,
    birthday: `${entry.birthday.split('/')[2]}-${
      entry.birthday.split('/')[1]
    }-${entry.birthday.split('/')[0]}`,
    status: entry.status
  }));
  return employeesList;
};
