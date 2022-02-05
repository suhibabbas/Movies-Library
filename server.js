'use strict';



const movieData = require('./MoviesData/data.json');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;


const server = express();
server.use(cors());
server.use(express.json());

server.get('/', handelmovies)
server.get('/favorite', handelfavorite)
server.get('/trending', handeltrending)
server.get('/search', handelsearch)
server.get('/list', handelList)
server.get('/discover', handeldiscover)

server.post('/addMovie', addMovie)
server.get('/getMovies', getMovies)

server.put('/UPDATE/:id', updateMovie)
server.delete('/DELETE/:id', deleteMovie)
server.get('/getSpecificMovie/:id', getSpecificMovie)

server.use('*', handelNotFound);

let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`
let listUrl = `https://api.themoviedb.org/3/list/80?api_key=${process.env.APIKEY}&language=en-US`
let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`

function Movies(id, title, poster_path, overview, adult) {

    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.adult = adult;

}

function updateMovie(req, res) {
    // console.log(req.params.id)
    const id = req.params.id;
    const movie = req.body;
    let sql = `UPDATE movies SET title=$1,poster_path=$2,overview=$3,adult=$4 WHERE id=$5  RETURNING *; `
    let values = [movie.title, movie.poster_path, movie.overview, movie.adult, id];
    client.query(sql, values).then(data =>{
        res.status(200).json(data.rows)
    }).catch(error =>{
    
    })
    // title=movie.title,poster_path=movie.poster_path,overview=movie.overview,adult=movie.adult
}

function deleteMovie(req, res) {
const id = req.params.id;
const sql = `DELETE FROM movies WHERE id=${id}`

client.query(sql).then(() =>{
res.status(200).send('the movie has been deleted')
}).catch(error =>{

})
}

function getSpecificMovie(req, res) {
    const id = req.params.id;
    let sql = `SELECT * FROM movies WHERE id =${id};`
    client.query(sql).then(data => {
        res.status(200).json(data.rows)
    })
}

function getMovies(req, res) {
    let sql = `SELECT * FROM movies;`
    client.query(sql).then(data => {
        res.status(200).json(data.rows)
    })
}

function addMovie(req, res) {
    const movie = req.body
    let sql = `INSERT INTO movies(title,poster_path,overview,adult) VALUES($1,$2,$3,$4) RETURNING *;`
    let values = [movie.title, movie.poster_path, movie.overview, movie.adult];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(err => {

    })

}
function handelmovies(req, res) {
    let movie = new Movies(movieData.title, movieData.poster_path, movieData.overview,);
    res.status(200).json(movie)
}

function handelfavorite(req, res) {
    res.status(200).send("Welcome to Favorite Page")
}

function handeltrending(req, res) {
    axios.get(trendingUrl)
        .then((data) => {
            // console.log(data.data.results)
            let movie = data.data.results.map(result => {
                return new Movies(result.id, result.original_title, result.poster_path, result.overview, result.adult)
            })
            res.status(200).json(movie)
        }).catch((err) => {

        })

}

function handelsearch(req, res) {
    let query = req.query.query
    let page = req.query.page;

    let searchgUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=${query}&page=${page}`

    axios.get(searchgUrl)
        .then((data) => {
            // console.log(data.data.results)
            let movie = data.data.results.map(result => {
                return new Movies(result.id, result.original_title, result.poster_path, result.overview, result.adult)
            })
            //console.log(movie)
            res.status(200).json(movie)
        }).catch((err) => {

        })

}

function handelList(req, res) {
    axios.get(listUrl)
        .then((data) => {
            //console.log(data.data.items)
            let movie = data.data.items.map(result => {
                return new Movies(result.id, result.original_title, result.poster_path, result.overview)
            })
            // console.log(movie)
            res.status(200).json(movie)
        }).catch((err) => {

        })

}

function handeldiscover(req, res) {
    axios.get(discoverUrl)
        .then((data) => {
            //console.log(data.data.items)
            let movie = data.data.results.map(result => {
                return new Movies(result.id, result.original_title, result.poster_path, result.overview)
            })
            console.log(movie)
            res.status(200).json(movie)
        }).catch((err) => {

        })

}

function handelNotFound(req, res) {
    res.status(404).send("page not found")
}

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log('worke')
    })

})
// server.listen(PORT, () => {
//     console.log('worke')
// }
