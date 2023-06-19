import express from 'express'
import {generateLink } from '../controller/generate-link_controller.js';
import { reEntryCheckUser } from '../controller/re-entry-check-user_controller.js';


const router = express.Router();

router.route('/').get(generateLink)
router.route('/:userId').get(reEntryCheckUser)
export default router;