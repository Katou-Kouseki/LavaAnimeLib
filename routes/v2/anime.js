import { Router } from 'express';
import { addAnimeViewAPI, getAnimeByIDAPI, getAnimesByIDAPI, getAnimeViewAPI, getFilesByIDAPI } from '../../controllers/v2/anime/api.js';
import { getAnimeFollowListAPI } from '../../controllers/v2/anime/follow/list.js';
import { loginRequire } from '../../controllers/v2/globalAuth/auth.js';
const router = Router();

router.get(`/get`, getAnimeByIDAPI);
router.post(`/get`, getAnimesByIDAPI);

router.get('/file', [loginRequire, getFilesByIDAPI]); // 使用多个中间件

router.get('/view/get', getAnimeViewAPI);
router.post('/view/add', [loginRequire, addAnimeViewAPI]);

router.post('/follow/list', [loginRequire, getAnimeFollowListAPI])

export default router;