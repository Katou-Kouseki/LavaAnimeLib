import { Router } from 'express';
import { addAnimeViewAPI, getAnimeByIDAPI, getAnimeViewAPI, getFilesByIDAPI } from '../../controllers/v2/anime/api.js';
const router = Router();

router.get(`/get`, getAnimeByIDAPI);
router.get('/file', getFilesByIDAPI);
router.get('/view/get', getAnimeViewAPI);
router.post('/view/add', addAnimeViewAPI);

export default router;