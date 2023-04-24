import { Router } from  'express';
import { createUser, getUser, getUsers } from '../controllers/users';

const router = Router();

router.get('/', getUsers)
router.post('/', createUser)
router.get('/:_id', getUser)
export default router