import { asyncHandler } from '../middlewares';
import Manager from '../models/managers';
import {
  encryptPassword,
  sendEmail,
  managerLog,
  verifyToken,
  decryptPassword,
  signToken,
  ErrorResponse,
} from '../utils';

// @desc    Create a manager
// Route    POST /api/v1/managers/signup
// Access   Public
export const create = asyncHandler(async (req, res) => {
  const manager = await Manager.create({
    ...req.body,
    password: await encryptPassword(req.body.password),
  });
  await sendEmail('confirmation', manager.dataValues.email);
  managerLog('create', {
    manager: req.decoded.name,
    employee: manager.dataValues.name,
  });
  res.status(201).json({
    success: true,
    message: `Please check your inbox to confirm your email!`,
  });
});

// @desc    Confirm a manager from email
// Route    GET /api/v1/managers/confirm/:confirmationToken
// Access   Private
export const confirm = asyncHandler(async (req, res) => {
  const { confirmationToken } = req.params;
  const email = verifyToken(
    confirmationToken,
    process.env.JWT_CONFIRMATION_SECRET
  );

  const [manager] = await Manager.update(
    { confirmed: true },
    { where: { email } }
  );
  if (!manager) throw new ErrorResponse(`Manager's email not confirmed`, 400);
  await sendEmail('communication', email);

  res.status(200).json({
    success: true,
    message: `Thank you for confirming your email!`,
  });
});

// @desc    Login a manager
// Route    POST /api/v1/managers/login
// Access   Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { dataValues } = await Manager.findOne({ where: { email } });
  if (!dataValues) throw new ErrorResponse(`Manager doesn't exist!`, 404);
  const { confirmed, name, uuid, status } = dataValues;
  if (!confirmed)
    throw new ErrorResponse(`Please verify your email first`, 400);
  await decryptPassword(password, dataValues.password);
  const token = signToken(
    { name, uuid, status, email: dataValues.email },
    process.env.JWT_LOGIN_SECRET,
    '1h'
  );
  managerLog('login', { manager: name });

  res.status(200).json({
    success: true,
    data: token,
  });
});

// @desc    Request to reset a manager's Password
// Route    POST /api/v1/managers/reset
// Access   Public
export const requestReset = asyncHandler(async (req, res) => {
  const {
    dataValues: { email },
  } = await Manager.findOne({ where: { email: req.body.email } });
  if (!email) throw new ErrorResponse(`Manager does not exist!`, 404);
  await sendEmail('password reset', email);

  res.status(201).json({
    success: true,
    message: `Please check your inbox to reset your password!`,
  });
});

// @desc    Confirm a manager's password reset
// Route    POST /api/v1/managers/reset/:token
// Access   Private
export const confirmReset = asyncHandler(async (req, res) => {
  const password = await encryptPassword(req.body.password);
  const email = verifyToken(
    req.params.token,
    process.env.JWT_CONFIRMATION_SECRET
  );

  const [manager] = await Manager.update({ password }, { where: { email } });
  if (!manager) throw new ErrorResponse(`Manager's password not reset`, 404);
  managerLog('reset', {
    manager: req.decoded.name,
  });

  res.status(200).json({
    success: true,
    message: `Thank you! You can now use your new password to login!`,
  });
});
