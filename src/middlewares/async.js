import { conn as db } from '../config/database';

export default (func) => (req, res, next) =>
  Promise.resolve(db.sync({ logging: false }).then(func(req, res, next))).catch(
    next
  );
