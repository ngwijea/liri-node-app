require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);


var axios = require('axios');

var fs = require('fs');

var moment = require('moment');

var input = process.argv[2];
var info = process.argv[3];

 
switch(input) {
    case "concert-this":
        displayConcert(info);
        break;
    case "spotify-this-song":
        displaySpotify(info);
        break;
    case "movie-this":
        displayMovie(info);
        break;
    case "do-what-it-says":
        displayInput(info);
        break;
    default:
        console.log("Input Error - try again");
        break;
}

function displayConcert(info) {
    var stringData = info.split(",")
    var queryUrl = "https://rest.bandsintown.com/artists/" + stringData + "/events?app_id=codingbootcamp";
    console.log(queryUrl);

    axios.get(queryUrl).then(
        function(response) {
        for (var i = 0; i < response.data.length; i++) {

            var date = response.data[i].datetime;
            console.log(date)
            var dateInfo = date.replace("T"," ")
            console.log(dateInfo)

            var concertData = 
                "\n--------------------------------------------------------------------\n" +
                    "\nVenue Name: " + response.data[i].venue.name + 
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateInfo[0], "MM-DD-YYYY");
            console.log(concertData);
        }
    })

    .catch(function(error) {
        console.log(error);
    });

}

function displaySpotify(info) {
    if(!info){
        info = "The Sign";
    }
    spotify
    .search({ type: 'track', query: info})
    .then(function(response) {
        for (var i = 0; i < 5; i++) {
            var spotifyData = 
                "--------------------------------------------------------------------" +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
                    "\nSong's Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;
                    
            console.log(spotifyData);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

function displayMovie(info) {
    if(!info){
        info = "Mr Nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + info + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
            var movieData = 
                "--------------------------------------------------------------------" +
                    "\nTitle of the movie: " + response.data.Title + 
                    "\nYear of Release: " + response.data.Year +
                    "\nIMDB Rating: " + response.data.imdbRating +
                    "\nRotten Tomatoes Rating: " + response.data.Ratings[1].info +
                    "\nCountry of Production: " + response.data.Country +
                    "\nLanguage: " + response.data.Language +
                    "\nPlot: " + response.data.Plot +
                    "\nCast: " + response.data.Actors;
            console.log(movieData);
    })
    .catch(function (error) {
        console.log(error);
    });
    
}

function displayInput(info) {

    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        console.log(dataArr);
        displaySpotify(dataArr);
        console.log(displaySpotify)
    })
}
