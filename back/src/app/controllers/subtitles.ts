import {Request, Response} from 'express';
import subtitlesServices from '@app/services/subtitles';
import logger from '@settings/logger';

const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
    useragent:'TemporaryUserAgent',
    ssl: true
});

export default class subtitlesController{

    static getSub(req: Request, res: Response){
        let imdb: string = req.query.imdbId;

        OpenSubtitles.search({
            sublanguageid: 'eng, fre',

            extensions: ['srt', 'vtt'],
            limit: 2,

            imdbid: imdb
        })
        .then(async (subtitles: any) => {
            let downSubTab = new Array;
            if (subtitles.en != null){
                await subtitlesServices.createSubTab(downSubTab, subtitles.en);
            }
            if (subtitles.fr != null){
                await subtitlesServices.createSubTab(downSubTab, subtitles.fr);
            }
            let whichSub: Array<string> | undefined = await subtitlesServices.downSub(downSubTab, imdb);
            res.send(whichSub);

        })
        .catch((error: any) => {
            logger.info("Error get subtitles");
            logger.info(error);
        })
    }
}
