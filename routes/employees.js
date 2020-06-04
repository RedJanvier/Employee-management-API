import { Router } from 'express';

import {
  create,
  createMany,
  search,
  edit,
  _delete,
  changeStatus,
} from '../controllers/employees';

const router = Router();

router.route('/').post(create);

router.route('/many').post(createMany);

router.route('/search').put(search);

router.route('/:uuid').put(edit).delete(_delete);

router.route('/:uuid/:status').put(changeStatus);

export default router;
