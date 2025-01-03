import path from "path";
import { prisma } from "../../../prisma/client.js";
import success from "../response/2xx/success.js";
import wrongQuery from "../response/4xx/wrongQuery.js";

/**
 * 此 API 接收下载机的更新上报，然后将信息加入消息队列
 */
export async function reportUploadMessageAPI(req, res) {
  let { index, fileName } = req.body;

  if (typeof index != "string" || typeof fileName != "string")
    return wrongQuery(res);

  // 分割文件路径, 取出最后三层
  let filePath = path.normalize(index).split(/\\|\//);
  let trueIndex = filePath.slice(-3);

  // 尝试获取此动画信息，当然 有可能是未入库的新动画，此项可能为 null
  let possibleAnime = await prisma.anime.findFirst({
    where: {
      year: trueIndex[0],
      type: trueIndex[1],
      name: trueIndex[2],
    },
  });

  let bangumiID = trueIndex.slice(-1)[0].match(/(?<= )\d{1,6}$/);
  let parseBangumiID = Number.parseInt(bangumiID?.[0]);
  if (parseBangumiID !== NaN) {
    bangumiID = parseBangumiID;
  }

  // 先检查是否存在此 bgmID 的 BangumiData, 如果不存在，不关联，否则将导致外键错误
  let bgmData = await prisma.bangumi_data.findFirst({
    where: {
      bgmid: bangumiID,
    },
  });

  if (bgmData === null) {
    bangumiID = null;
  }

  await prisma.upload_message.create({
    data: {
      index: trueIndex.join("/"),
      animeID: possibleAnime?.id,
      bangumiID: bangumiID,
      fileName,
    },
  });

  success(res);
}
