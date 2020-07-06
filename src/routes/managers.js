import { Router } from 'express';

import { checkAuth } from '../middlewares/employees';
import {
  login,
  create,
  requestReset,
  confirm,
  confirmReset,
} from '../controllers/managers';

const router = Router();

router.route('/login').post(login);
router.route('/signup').post(checkAuth, create);
router.route('/reset').post(requestReset);

router.route('/confirm/:confirmationToken').get(confirm);
router
  .route('/reset/:token')
  .get((_, res) => res.sendStatus(400))
  .post(checkAuth, confirmReset);

export default router;
