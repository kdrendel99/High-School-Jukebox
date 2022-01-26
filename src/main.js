import $ from 'jquery';
import './css/styles.css';
import SpotifyService from './spotify-service.js';


window.onload = setTimeout(function() {
  $('.card-landing').fadeOut("slow");
}, 1750 );

$(document).ready( async function() {
  $('.content').fadeIn("slow");
  const token = await testToken();
  const genreList = await SpotifyService.getGenres(token);
  genreList.genres.forEach(function(element){
    $("#inputGenre").append(`<option value=${element}>${element[0].toUpperCase() + element.substring(1)}</option>`);
  });
});
$("#input-form").submit(function(event) {
  clearFields();
  const birthDate = $("#DOB").val();
  const birthYear = parseInt(birthDate.slice(0,4));
  const hsYears = [(birthYear)+14,(birthYear)+18];
  const genre = $("#inputGenre").val();
  validateYear(birthYear);
  outputSearch(genre,hsYears);
  changeView();
  $('html,body').animate({
    scrollTop: $("#hiddenOutput").offset().top},
  'slow');
  event.preventDefault();
});

function validateYear(birthYear){
  const thisYear = new Date().getFullYear();
  const tooYoung = thisYear-18;
  if (birthYear > thisYear || birthYear <= 1894){
    $('#error').text(`Please enter a valid Birthday.`).fadeIn("slow");
    event.preventDefault();
    throw '';
  }
  else if (birthYear > tooYoung){
    $('#error').text(`Hello! Come back in a few years and we'll have data for YOU, kiddo!`).fadeIn("slow");
    event.preventDefault();
    throw '';
  }
  
}

function changeView(){
  $("#hiddenInputs").hide();
  $("#hiddenOutput").show();
}

function getName(fullName){
  let array = fullName.split(/[ ,]+/);
  return array[0];
}
function clearFields() {
  $("#songList").text("");
}

async function testToken() {
  const token = await SpotifyService.getToken();
  return token;
}

async function outputSearch(genre,years) {
  const fullName = $("#name").val();
  let name = getName(fullName);
  const token = await testToken();
  const search = await SpotifyService.getSearch(token,genre,years);
  search.tracks.items.forEach(function(element) {
    $('.list').text(`Welcome ${name}. Feeling Nostalgic? Check out some ${genre} songs from high school!`);
    $("#songList").append("<li>" + `${element.album.release_date.slice(0,4)}` + ` <iframe src="https://open.spotify.com/embed/track/${element.id}" class="embedded_link" allow="encrypted-media">`);
  });
} 