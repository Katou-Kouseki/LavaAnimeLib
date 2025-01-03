import axios from "axios";
import config from "./config.js";
import { logger } from "./tools/logger.js";

const oneBotAPI = axios.create({
  baseURL: config.oneBot.adapterSettings.http.baseURL,
  timeout: 10000,
});

export async function sendMessageToAllTarget(cqCode, reTry) {
  logger(cqCode);
  logger(`[OneBot Handler] 批量发送以上消息到所有接收群...`);

  for (const groupId of config.oneBot.target.group) {
    await sendGroupMessage(groupId, cqCode, reTry);
    logger(`[OneBot Handler] 发送 ${groupId} 完成.`);
    await doRandomDelay();
  }
}

export async function sendGroupMessage(groupId, cqCode, reTry = 3) {
  try {
    return await oneBotAPI.get("/send_group_msg", {
      params: {
        access_token: config.oneBot.accessToken,
        group_id: groupId,
        message: cqCode,
      },
    });
  } catch (error) {
    if (reTry === 0) throw error;
    
    console.error(error);
    console.error(`[OneBot Handler] 发送消息失败! 剩余重试次数: ${reTry}`);

    await doRandomDelay();
    return await sendGroupMessage(groupId, cqCode, reTry - 1);
  }
}

async function doRandomDelay() {
  let randomDelay = 10000 * Math.random();
  await delay(randomDelay);
  // logger(`[OneBot Handler] 完成 ${randomDelay}ms 随机延迟`);
}

/**
 * Promise 延迟
 * @param {Number} delayTime
 * @returns
 */
function delay(delayTime) {
  return new Promise((resolve) => setTimeout(resolve, delayTime));
}
