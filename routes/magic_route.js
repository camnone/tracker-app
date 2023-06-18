import express from 'express'
import { magicController } from '../controller/magic_controller.js'


const router = express.Router();

router.route('/').post(magicController);

export default router;