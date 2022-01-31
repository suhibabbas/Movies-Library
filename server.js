'use strict';



const movieData = require('./MoviesData/data.json');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const acios = require('axios');
const  axios= require('axios');

const PORT = `${process.env.PORT}`;


const server = express();

server.use(cors());

server.get('/', handelmovies)
server.get('/favorite', handelfavorite)
server.get('/trending', handeltrending)
server.get('/search', handelsearch)
server.use('*', handelNotFound);

let trendingUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`
let searchgUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=The&page=2`


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