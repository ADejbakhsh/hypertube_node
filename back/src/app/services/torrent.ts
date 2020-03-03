import axios from "axios"
var fs = require('fs');
import logger from '@settings/logger';
import {Response} from "express";
//import ffmpeg, {FfprobeStream} from 'fluent-ffmpeg'; 
import ffmpeg from 'fluent-ffmpeg'
let torrentStream = require('torrent-stream');


const pathToFfmpeg = require('ffmpeg-static');


//ffmpeg.setFfmpegPath(require('ffmpeg-static').path);

export default class torrentClient {

	static async torrentYts(imdbCode: string) {
		try {
			if (!imdbCode || imdbCode == '')
				throw "error";
			let url = 'http://yts.mx/api/v2/list_movies.json?query_term='+ imdbCode;
			let response: any = await axios.get(url);
			let torrents: Array<any> | undefined;
			let list = this.getTorrentList(response);
			if (list != undefined) {
				list.forEach((torrent: any) => {
					let entry = {
						'provider': 'YTS',
						'magnetLink': torrentClient.buildMagnetLink(torrent.hash, torrent.url),
						'quality': torrent.quality
					};
					if (entry.quality != "3D"){
						if (torrents == undefined)
							torrents = [];
						torrents.push(entry);
					}
				});
			}
			return (torrents);
		} catch (err) {
			return err
		}
	}

	static async torrentPopCorn(imdbCode: string) {
		try {
			if (!imdbCode || imdbCode == '')
				throw "error";
			let url = 'https://tv-v2.api-fetch.website/movie/'+ imdbCode;
			let response: any = await axios.get(url);
			let torrents: Array<any> | undefined;

			let magnetLink = this.getMagnetLink(response, '1080p');
			if (magnetLink != undefined){
				let entry = {
					'provider': 'Pop corn',
					'magnetLink': magnetLink,
					'quality': '1080p'
				};
				if (torrents == undefined)
					torrents = [];
				torrents.push(entry);
			}
			magnetLink = this.getMagnetLink(response, '720p');
			if (magnetLink != undefined){
				let entry = {
					'provider': 'Pop Corn',
					'magnetLink': magnetLink,
					'quality': '720p'
				};
				if (torrents == undefined)
					torrents = [];
				torrents.push(entry);
			}
			return (torrents);
		} catch (err) {
			return err;
		}
	}

	static getTorrentList(response: any){
		if (response == undefined)
			return undefined;
		if (response.data == undefined)
			return undefined;
		if (response.data.data == undefined)
			return undefined;
		if (response.data.data.movies == undefined)
			return undefined;
		if (response.data.data.movies[0] == undefined)
			return undefined;
		if (response.data.data.movies[0].torrents == undefined)
			return undefined;
		else
			return response.data.data.movies[0].torrents;
	}

	static getMagnetLink(response: any, quality: string){
		if (response == undefined)
			return undefined;
		if (response.data == undefined)
			return undefined;
		if (response.data.torrents == undefined)
			return undefined;
		if (response.data.torrents.en == undefined)
			return undefined;
		if (response.data.torrents.en[quality] == undefined)
			return undefined;
		if (response.data.torrents.en[quality].url == undefined)
			return undefined;
		else
			return response.data.torrents.en[quality].url;
	}


	static buildMagnetLink(hash: any, url: any){
		try {
			if (!hash || !url)
				throw "params missing";
			let torrent_hash = decodeURIComponent(hash);
			let torrent_url = decodeURIComponent(url);
			let tracker_1 =  encodeURI("udp://glotorrents.pw:6969/announce");
			let tracker_2 =  encodeURI("udp://tracker.opentrackr.org:1337/announce");
			let tracker_3 =  encodeURI("udp://torrent.gresille.org:80/announce");
			let tracker_4 =  encodeURI("udp://tracker.openbittorrent.com:80");
			let tracker_5 =  encodeURI("udp://tracker.coppersurfer.tk:6969");
			let tracker_6 =  encodeURI("udp://tracker.leechers-paradise.org:6969");
			let tracker_7 =  encodeURI("udp://p4p.arenabg.ch:1337");
			let tracker_8 =  encodeURI("udp://tracker.internetwarriors.net:1337");
			torrent_hash = encodeURI(torrent_hash);
			torrent_url = encodeURI(torrent_url);
			let magnetLink = "magnet:?xt=urn:btih:" + torrent_hash + "&dn=" + torrent_url + "&tr=" + tracker_1 + "&tr=" +tracker_2 + "&tr=" + tracker_3 + "&tr=" + tracker_4 + "&tr=" + tracker_5 + "&tr=" + tracker_6 + "&tr=" + tracker_7 + "&tr=" + tracker_8;
			return magnetLink;
		} catch (err) {
			return err;
		}
	}

	static async downloadMovie(start: any, magnetLink: any){
		return new Promise((resolve, reject) => {
			let engine = torrentStream(magnetLink, {path: '/back/films'});
			engine.on('ready', () => {
				return resolve(engine);
			});
		}) ;
	}


	static streamFile_seconde(file: any, res: Response, extension: string, range: any) {
		console.log("On stream sans consvertion");

		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		let opt = { start: start, end: file.length };
		//let stream = file.createReadStream(opt);

		console.log("Le fichier" + file.path);
		let stream = fs.createReadStream("/back/films/" + file.path);
		console.log(stream);


		const fileSize = file.length;
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize-1
			const chunksize = (end-start)+1
			logger.info("le start ==>"+ start);
			logger.info("le end ==>"+ end);
			logger.info("le file size"+ fileSize);
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
				Connection: 'keep-alive'
			}
			res.writeHead(206, head);
			stream.pipe(res);
			stream.on('error', function (err: any) {
				console.log("erre in stream ==>" + err);
				res.status(416).send("error in stream");
			})
}


static async convertAndStreamFile_seconde(file: any, res: Response, range: any) {
	console.log("On stream avec consvertion");
	console.log(pathToFfmpeg);



		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		let opt = { start: start, end: file.length };
		//let stream = file.createReadStream(opt);

		console.log("Le fichier" + file.path);
		let stream = fs.createReadStream("/back/films/" + file.path);
		console.log(stream);


		const fileSize = file.length;
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize-1
			const chunksize = (end-start)+1
			logger.info("le start ==>"+ start);
			logger.info("le end ==>"+ end);
			logger.info("le file size"+ fileSize);
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
				Connection: 'keep-alive'
			}
			res.writeHead(206, head);






	// const stream = file.createReadStream();

	console.log("Le fichier" + file.path);
	// let stream = fs.createReadStream("/back/films/" + file.path);
	// console.log(stream);


	// stream.on('data', (chunk: any) => {
  		// console.log(`Received ${chunk.length} bytes of data.`);
	// });




	// stream.on('error', (err: any) => {
		// logger.info("erreur dans le stream ==>"+ err);
	// });

  	// res.writeHead(206, {
    	// 'Content-Type': 'video/webm',
    	// Connection: 'keep-alive'
  	// })

	const converter = ffmpeg()
    .input(stream)
    .videoCodec('libvpx')
    .audioCodec('libvorbis')
    .audioBitrate(128)
    .videoBitrate(1024)
    .duration(120 * 60)
    .output(res)
    .outputFormat('webm')


  converter.on('progress', function(progress) {
    console.log('Processing: ' + progress.percent + '% done');
  })



	converter.on('error', (err: any) => {
		logger.info("erreur de ffmpeg ==>"+ err);
	});

	converter.run()

	return converter;
}


static async streamFile(file: any, res: Response, extension: string, opt: any) {
	const ext = extension.split(".")[1];
	res.writeHead(206, {
		'Content-Type': 'video/mp4',
		'Content-Range': `bytes ${opt.start}-${opt.end}/${file.length}`,
		'Content-Length': file.length,
		'Accept-Ranges': 'bytes'
	});
	let stream = file.createReadStream(opt);
	try {
		let proc: any =  ffmpeg(stream)
		.withVideoCodec('libx264')
		.withAspect('16:9')
		.audioCodec('aac')
		.on('start', function(commandLine) {
			console.log('Spawned Ffmpeg with command: ' + commandLine);
		}).on('codecData', function(data) {
			console.log('Input is ' + data.audio + ' audio ' +
						'with ' + data.video + ' video');
		}).on('error', function(err, stdout, stderr) {
			console.log('Cannot process video: ' + err.message);
		})
		.on("data", function(err,ddd) {
			console.log("😊", err,ddd);
		});
		proc.pipe(res, {end: true});
	}
	catch (err) {
		console.error(err);
	}
}

static async convertAndStreamFile(file: any, res: Response, opt: any) {
	let stream = file.createReadStream(opt);
	res.set('Content-Type', 'video/webm');

}






}
