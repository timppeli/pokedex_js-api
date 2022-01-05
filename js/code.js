// Author: Tiina Pelimanni
// Created: 01-2022

/* --- GLOBAL VARIABLES etc. */
const MENU_BUTTON = document.getElementById("btn-menu");
const SEARCH_BUTTON = document.getElementById("btn-search");
const SEARCH_INPUT = document.getElementById("pokemon-search");
const NAV = document.querySelector("nav");
const POKEMON_ROSTER = document.getElementById("pokemon-roster");
const MAIN = document.querySelector("main");
const ERROR_ELEMENT = MAIN.querySelector(".error");
const POKEMON_INFO = MAIN.querySelector(".pokemon-info");
const WELCOME = MAIN.querySelector(".welcome");
const HEADER_H1 = document.querySelector("header>h1");

let parsedResponse;
let pokemonToSearch;

/* --- EVENT HANDLERS */
HEADER_H1.addEventListener("click", function () {
    location.reload();
});

MENU_BUTTON.addEventListener("click", toggleMenu);

SEARCH_BUTTON.addEventListener("click", function () {
    if (SEARCH_INPUT.value.length < 1) {
        ERROR_ELEMENT.innerHTML = "WRITE SOMETHING, DUMMY";
        POKEMON_INFO.innerHTML = "";
        WELCOME.innerHTML = "";
    } else {
        pokemonToSearch = SEARCH_INPUT.value.toLowerCase();
        requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon?limit=151", searchForPokemon);
        WELCOME.innerHTML = "";
    }
    SEARCH_INPUT.value = "";
});

requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon?limit=151", generatePokemonlistForNav);

/**
 * Generates a list of 151 Pokémon for the navigation
 */
function generatePokemonlistForNav() {
    for (let i = 0; i < 151; i++) {
        POKEMON_ROSTER.innerHTML += "<li>#" + (i + 1) + " " + parsedResponse.results[i].name[0].toUpperCase() + parsedResponse.results[i].name.substring(1) + "</li>";
    }
    const NAV_LINKS = POKEMON_ROSTER.getElementsByTagName("li");
    for (let i = 0; i < NAV_LINKS.length; i++) {
        NAV_LINKS[i].addEventListener("click", function() {
            requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon/" + (i + 1) + "/", showPokemonInfo);
            toggleMenu();
        });
    }
}

/* --- FUNCTIONS */

/**
 * Accesses PokéAPI and calls a function to execute after that
 * @param {URL} url                     the URL of the API
 * @param {function} functionToCall     the function to call after the API resources are available
 */
function requestAssistanceFromAPI(url, functionToCall) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 & xmlhttp.status === 200) {
            parsedResponse = JSON.parse(xmlhttp.responseText);
            functionToCall();
        }
    }
}

/**
 * Checks if the search box input matches any of the 151 Pokémon in the Dex. If not > error message. If yes > calls a function to display additional information about said Pokémon.
 */
function searchForPokemon() {
    let pokemonList = parsedResponse.results;
    let pokemonIsFound = false;
    let foundPokemonId = "";

    for (let i = 0; i < pokemonList.length; i++) {
        if (pokemonList[i].name === pokemonToSearch) {
            pokemonIsFound = true;
            foundPokemonId = i;
            break;
        }
    }
    if (!pokemonIsFound) {
        ERROR_ELEMENT.innerHTML = "Couldn't find information for <em>" + pokemonToSearch + "</em>.";
        POKEMON_INFO.innerHTML = "";
    } else {
        requestAssistanceFromAPI(pokemonList[foundPokemonId].url, showPokemonInfo);
    }
}

/**
 * Displays the information about the chosen Pokémon
 */
function showPokemonInfo() {
    POKEMON_INFO.innerHTML = "";
    ERROR_ELEMENT.innerHTML = "";
    WELCOME.innerHTML = "";
    // Image
    let img = document.createElement("img");
    let img_src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + parsedResponse.id + ".png";
    img.setAttribute("src", img_src);
    // #000 and name
    let h2 = document.createElement("h2");
    h2.textContent = "#" + parsedResponse.id + " " + parsedResponse.name[0].toUpperCase() + parsedResponse.name.substring(1);
    // Types
    let ul = document.createElement("ul");
    ul.classList.add("pokemon-types");

    for (let i = 0; i < parsedResponse.types.length; i++) {
        let type = parsedResponse.types[i].type.name;
        let li = document.createElement("li");
        li.classList.add("type-card");
        li.classList.add(type);
        li.textContent = type;
        ul.appendChild(li);
    }
    // Append everything
    POKEMON_INFO.append(img, h2, ul);
}

/**
 * Toggles Pokemon Roster navigation visibility
 */
function toggleMenu() {
    NAV.classList.toggle("hidden");
    MENU_BUTTON.classList.toggle("fa-bars");
    MENU_BUTTON.classList.toggle("fa-times");
    MENU_BUTTON.classList.toggle("close-button");
}