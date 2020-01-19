import {Request, Response} from 'express';
import { Movie } from '../../app/models/movies'
const axios = require('axios');


export default class moviesController {

	static create() {
		const movie = new Movie();
	}


		// *** on regarde si le film existe
		//on regarde le statut du film : noExist / downloaded / downloadOnGoing
		//if no Exist on le telecharge
		//on renvoi la liste des films avec leur statut
	static download(req: Request, res: Response) {
		console.log("On est ici");
		var url = req.body.url;
		var hash = req.body.hash;
		var movie = Movie.getMovie(url, hash);
		if (movie == "noExist"){
			var moviee = new Movie();
			moviee.hash = hash;
			moviee.url = url;
			moviee.launchDownload();
			res.send("non_dispo");
		}
		else{
			var movies = Movie.getMovies();
			res.send("dispo");
		}
	}

	static testAPI(req: Request, res: Response) {
		axios
		.get('http://yts.tl/api/v2/list_movies.json')
		.then((response: any) => {
			if (response.status == 200){
				//console.log(response.data)
				//console.log(typeof (response.data));
				res.send(response.data);
			}
			else{
				console.log("erro in api");
				res.send("error");
			}
		})
	}

	static testApiQueryString(req: Request, res: Response) {
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
				//console.log(response.data)
				//console.log(typeof (response.data));
				res.send(response.data);
			}
			else{
				console.log("erro in api");
				res.send("error");
			}
		})
	}



}
