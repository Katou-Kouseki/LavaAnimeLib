import parseFileName from "anime-file-parser";
import { prisma } from "../../../../prisma/client.js";
import { animeParser } from "../../parser/animeParser.js";
import success from "../../response/2xx/success.js";
import wrongQuery from "../../response/4xx/wrongQuery.js";

export async function getRecentUpdatesAPI(req, res) {
  let { skip = 0, take = 20, ignoreDuplicate = true } = req.query;

  try {
    skip = Number.parseInt(skip);
    take = Number.parseInt(take);
    ignoreDuplicate = JSON.parse(ignoreDuplicate);

    if (skip < 0 || take < 0 || typeof ignoreDuplicate !== "boolean") throw "";
  } catch (error) {
    return wrongQuery(res);
  }

  let recentUpdates = await prisma.upload_message.findMany({
    skip,
    take,
    where: ignoreDuplicate
      ? {
          messageSkiped: false,
        }
      : {},
    include: { anime: true },
    orderBy: { uploadTime: "desc" },
  });

  for (let record of recentUpdates) {
    if (record.anime !== null)
      record.anime = (await animeParser(record.anime))[0];
    record.parseResult = parseFileName(record.fileName);
  }

  return success(res, recentUpdates);
}
