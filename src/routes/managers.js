import { Router } from 'express';

import { auth } from '../middlewares';
import {
  login,
  create,
  requestReset,
  confirm,
  confirmReset,
} from '../controllers/managers';

const router = Router();

router.route('/login').post(login);
router.route('/signup').post(auth, create);
router.route('/reset').post(requestReset);

router.route('/confirm/:confirmationToken').get(confirm);
router
  .route('/reset/:token')
  .get((_, res) => res.sendStatus(400))
  .post(auth, confirmReset);

export default router;
