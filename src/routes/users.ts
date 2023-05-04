import { Router } from 'express';
import {
  getCurrentUser,
  getUser,
  getUsers,
  updateUserAvatar,
  updateUserData,
} from '../controllers/users';
import { validateUpdateUserAvatar, validateUpdateUserData } from '../utils/validation';

const router = Router();
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:_id', getUser);
router.patch('/me', validateUpdateUserData, updateUserData);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);
export default router;
