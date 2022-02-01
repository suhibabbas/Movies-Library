'use strict';



const movieData = require('./MoviesData/data.json');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const  axios= require('axios');

const PORT = `${process.env.PORT}`;


const server = express();

server.use(cors());

server.get('/', )
server.get('/favorite', handelfavorite)
server.get('/trending', handeltrending)
server.get('/search', handelsearch)
server.get('/list', handelList)
server.get('/discover', handeldiscover)
server.use('*', handelNotFound);

let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`
let searchgUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=The&page=2`
let listUrl = `https://api.themoviedb.org/3/list/80?api_key=${process.env.APIKEY}&language=en-US`
let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`

function Movies(id,title, poster_path, overview,adult ) {

    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.adult = adult;

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
    .then((data)=>{
        // console.log(data.data.results)
        let movie = data.data.results.map(result =>{
            return new Movies(result.id, result.original_title, result.poster_path , result.overview)
        })
        res.status(200).json(movie)
    }).catch((err)=>{

    })
   
}
function handelsearch(req, res) {
    axios.get(searchgUrl)
    .then((data)=>{
        // console.log(data.data.results)
        let movie = data.data.results.map(result =>{
            return new Movies(result.id, result.original_title, result.poster_path , result.overview,result.adult)
        })
        //console.log(movie)
        res.status(200).json(movie)
    }).catch((err)=>{

    })
    
}

function handelList(req, res) {
    axios.get(listUrl)
    .then((data)=>{
        //console.log(data.data.items)
        let movie = data.data.items.map(result =>{
            return new Movies(result.id, result.original_title, result.poster_path , result.overview)
        })
        console.log(movie)
        res.status(200).json(movie)
    }).catch((err)=>{

    })
    
}

function handeldiscover(req, res) {
    axios.get(discoverUrl)
    .then((data)=>{
        //console.log(data.data.items)
        let movie = data.data.results.map(result =>{
            return new Movies(result.id, result.original_title, result.poster_path , result.overview)
        })
        console.log(movie)
        res.status(200).json(movie)
    }).catch((err)=>{

    })
    
}



function handelNotFound(req, res) {
    res.status(404).send("page not found")
}


server.listen(PORT, () => {
    console.log('worke')
})