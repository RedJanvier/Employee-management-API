import { Router } from 'express';

import {
  create,
  createMany,
  search,
  edit,
  deleteEmployee,
  changeStatus
} from '../controllers/employees';

const router = Router();

router.route('/').post(create);
router.route('/search').put(search);
router.route('/many').post(createMany);
router.route('/:uuid/:status').put(changeStatus);
router.route('/:uuid').put(edit).delete(deleteEmployee);

export default router;
