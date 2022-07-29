import { dbQueryAsync } from '../v1/tools/dbQuery.js';

export function getView(req, res) { // 查询播放量
    viewsHandler(req, res, false);
}
export function addView(req, res) { // 增加播放量
    viewsHandler(req, res, true);
}

async function viewsHandler(req, res, update) { // 处理播放量请求
    let id = req.params[0]; // 客户端请求的 ID
    if (isNaN(id) || !id) { // 如果 ID 不是数字
        res.send({ code: 400, message: 'ID 不合法' });
        return;
    }

    let thisAnime = (await dbQueryAsync('SELECT * FROM anime WHERE id = ? AND deleted = 0', [id]));

    if (thisAnime.length == 0) {
        res.send({ code: 404, message: '此 ID 的动画不存在' });
        return;
    }

    thisAnime = thisAnime[0];

    if (!update) {
        res.send({ code: 200, message: 'success', data: thisAnime.views });
    }

    if (update) {
        let newViews = parseInt(thisAnime.views) + 1;
        await dbQueryAsync('UPDATE anime SET views = ? WHERE id = ? AND deleted = 0', [newViews, id])
        console.log(`[新增播放] 新增了播放量 [${thisAnime.id}] ${thisAnime.name} => ${newViews} !`);
        res.send({ code: 200, message: 'success', data: newViews });
    }
}