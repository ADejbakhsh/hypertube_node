import {Request, Response} from 'express';
import { Movie } from '../../app/models/movies';
const fs = require('fs');
const axios = require('axios');


export default class moviesController {

	static create() {
		const movie = new Movie();
	}

	static async deleteAllMovies(req: Request, res: Response) {
		const allMovies = await Movie.find();
		for (const property in allMovies) {
			allMovies[property].remove();
		}
		res.send("movies delete")
	}

	static async getDownload(req: Request, res: Response){
		var allMovies = await Movie.find();
		var hereMovie = JSON.stringify(allMovies)
		res.send(hereMovie);
	}

	static async postDownload(req: Request, res: Response) {
		var url = req.body.url;
		var hash = req.body.hash;
		var imdbCode = req.body.imdbCode;
		var movieInfo = req.body.movie;
		console.log(movieInfo);
		if (req.body.url != undefined && req.body.hash != undefined && req.body.imdbCode != undefined){
			const movieSearch = await Movie.findOne({ hash: hash, url: url, imdbCode: imdbCode});
			if (movieSearch == undefined){
				var movie = new Movie;
				movie.title = movieInfo.title;
				movie.imdbCode = imdbCode;
				movie.hash = hash;
				movie.imageUrl = "la super image url du film";
				movie.url = url;
				movie.buildMagnetLink();
				movie.downloadStatus = "notStarted"
				console.log("On save");
				await movie.save();
			}
			else{
				var movie = movieSearch;
			}
			if (movie.downloadStatus == "notStarted"){
				movie.downloadMovie();
			}
		}
		console.log("On get");
		moviesController.getDownload(req, res);
	}

	static ytsApiQueryString(req: Request, res: Response) {
		var stringResearch = req.body.queryString;
		stringResearch = encodeURI(stringResearch);
		console.log("on recherche");
		console.log(stringResearch);
		var url = 'http://yts.tl/api/v2/list_movies.json?query_term='+ stringResearch;
		console.log(url);
		axios
		.get(url)
		.then((response: any) => {
			if (response.status == 200){
				res.send(response.data);
			}
			else{
				console.log("erro in api");
				res.send("error");
			}
		})
	}

	static player(req: Request, res: Response) {
		const path = '/back/films/copy.mp4'
		const stat = fs.statSync(path)
		const fileSize = stat.size
		const range = req.headers.range
		if (range) {
			const parts = range.replace(/bytes=/, "").split("-")
			const start = parseInt(parts[0], 10)
			const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize-1
			const chunksize = (end-start)+1
			const file = fs.createReadStream(path, {start, end})
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
			}
			res.writeHead(206, head);
			file.pipe(res);
		} else {
			console.log("pas de range **********************");
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
			}
			res.writeHead(200, head)
			fs.createReadStream(path).pipe(res)
		}
	}
}