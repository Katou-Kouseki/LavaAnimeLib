import config from "../../common/config.js";
import { promiseDB } from "../../common/sql.js";
import { getAllBgmIDInAnimeTable } from "./bangumiDB.js";

updatePosters()
export async function updatePosters() {
    let allBgmIDInAnime = await getAllBgmIDInAnimeTable()
    let allSubjectsData = await promiseDB.query('SELECT bgmid,subjects FROM bangumi_data WHERE bgmid IN (?)', [allBgmIDInAnime])
    allSubjectsData = allSubjectsData[0]
    let newArray = {}
    for (let i in allSubjectsData) {
        newArray[allSubjectsData[i].bgmid] = JSON.parse(allSubjectsData[i].subjects)
    }
    allSubjectsData = newArray

    for (let i in allBgmIDInAnime) {
        let thisPoster = allSubjectsData[allBgmIDInAnime[i]].images.large.replace('https://lain.bgm.tv', config.bangumiImage.host) + '/poster' || ''
        promiseDB.query(
            'UPDATE anime SET poster = ? WHERE bgmid = ?',
            [thisPoster, allBgmIDInAnime[i]]
        )
        console.log(`[Poster 更新] ${allBgmIDInAnime[i]} => ${thisPoster}`);
    }
}