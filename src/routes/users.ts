import { Router } from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateUserAvatar,
  updateUserData,
} from '../controllers/users';

const router = Router();
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:_id', getUser);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);
export default router;
