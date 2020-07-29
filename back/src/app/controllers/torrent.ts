import {Request, Response} from 'express';
import torrentClient from '@app/services/torrent'
import logger from '@settings/logger';


export default class torrentsController {

	static async getTorrent(req: Request, res: Response) {
		try {
			let imdbCode: string = req.query.imdbCode;
			if (!imdbCode || imdbCode == '')
				throw "imdbCode missing in getTorrent";
			let torrentYTS = torrentClient.torrentYts(imdbCode);

			let promise = Promise.all([torrentYTS]);
			promise.then((response: any) => {
				if (response[0] != undefined && response[1] != undefined)
				{
					console.log(response);
					
					res.status(200).send(response.flat(Infinity));
				}
				if (response[0] == undefined && response[1] == undefined)
					res.status(200).send({});
				if (response[0] == undefined && response[1] != undefined)
					res.status(200).send(response[1]);
				if (response[0] != undefined && response[1] == undefined)
					res.status(200).send(response[0]);
			})
		} catch (err) {
			res.status(401).send("error");
		}
	}
}
