'use strict';



const movieData = require('./MoviesData/data.json');
const express = require('express');
const cors = require('cors');



const server = express();

server.use(cors());

server.get('/',handelmovies)
server.get('/favorite',handelfavorite)
server.use('*',handelNotFound);

function Movies(title,poster_path,overview){

    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}

function handelfavorite(req,res){
res.status(200).send("Welcome to Favorite Page")
}

function handelmovies(req,res){
    let movie  = new Movies(movieData.title,movieData.poster_path,movieData.overview);
    res.status(200).json(movie)
}
function handelNotFound(req,res){
    res.status(404).send("page not found")
}


server.listen(3000,()=>{
    console.log('worke')
})