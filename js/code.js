// Author: Tiina Pelimanni
// Created: 01-2022

/* --- GLOBAL VARIABLES etc. */
const MENU_BUTTON = document.getElementById("btn-menu");
const SEARCH_BUTTON = document.getElementById("btn-search");
const SEARCH_INPUT = document.getElementById("pokemon-search");
const NAV = document.querySelector("nav");
const POKEMON_ROSTER = document.getElementById("pokemon-roster");
const MAIN = document.querySelector("main");
const RESULTS = document.querySelector(".results");
const ERROR_ELEMENT = RESULTS.querySelector(".error");
const POKEMON_INFO = RESULTS.querySelector(".pokemon-info");
const WELCOME = MAIN.querySelector(".welcome");
const HEADER_H1 = document.querySelector("header>h1");

let parsedResponse;
let pokemonToSearch;

/* --- EVENTS AND STUFF */
requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon?limit=151", generatePokemonListForMain);
requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon?limit=151", generatePokemonlistForNav);

HEADER_H1.addEventListener("click", function () {
    location.reload();
});

MENU_BUTTON.addEventListener("click", toggleMenu);

SEARCH_BUTTON.addEventListener("click", initiateSearch);


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
 * Hides the main text, shows the search results (error message or the Pokémon info)
 */
function initiateSearch() {
    if (SEARCH_INPUT.value.length < 1) {
        POKEMON_INFO.classList.add("hidden")
        MAIN.classList.add("hidden")
        RESULTS.classList.remove("hidden");
        ERROR_ELEMENT.classList.remove("hidden");
        ERROR_ELEMENT.innerHTML = "Please enter the name of the Pokémon you are looking for.";
    } else {
        pokemonToSearch = SEARCH_INPUT.value.toLowerCase();
        requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon?limit=151", searchForPokemon);
        RESULTS.classList.remove("hidden");
        MAIN.classList.add("hidden");
        ERROR_ELEMENT.classList.add("hidden");
    }
    SEARCH_INPUT.value = "";
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
        RESULTS.classList.remove("hidden");
        ERROR_ELEMENT.classList.remove("hidden");
        ERROR_ELEMENT.innerHTML = "<p>Couldn't find information for <em>" + pokemonToSearch + "</em>.</p><p>Is the name you entered spelled correctly?</p><p>Please note the search bar does not recognize empty spaces. You must use \"-\" instead.</p><p>For example, if you are looking for:<br>– Nidoran Male, type <em>nidoran-m</em><br>– Mr. Mime, type <em>mr-mime</em></p>";
        POKEMON_INFO.innerHTML = "";
    } else {
        ERROR_ELEMENT.classList.add("hidden");
        MAIN.classList.add("hidden");
        RESULTS.classList.remove("hidden");
        POKEMON_INFO.classList.remove("hidden");
        requestAssistanceFromAPI(pokemonList[foundPokemonId].url, showPokemonInfo);
    }
}

/**
 * Displays the information about the chosen Pokémon
 */
function showPokemonInfo() {
    POKEMON_INFO.innerHTML = "";
    ERROR_ELEMENT.classList.add("hidden");
    MAIN.classList.add("hidden");
    RESULTS.classList.remove("hidden");
    POKEMON_INFO.classList.remove("hidden");
    // Image
    let img = document.createElement("img");
    let img_src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + parsedResponse.id + ".png";
    img.setAttribute("src", img_src);
    // # and name
    let h2 = document.createElement("h2");
    let pokemonName = parsedResponse.name[0].toUpperCase() + parsedResponse.name.substring(1);
    switch (pokemonName) {
        case "Nidoran-m":
            pokemonName = "Nidoran (Male)";
            break;
        case "Nidoran-f":
            pokemonName = "Nidoran (Female)";
            break;
        case "Mr-mime":
            pokemonName = "Mr. Mime";
    }
    h2.textContent = "#" + parsedResponse.id + " " + pokemonName;
    // Types
    let typesList = document.createElement("ul");
    typesList.classList.add("pokemon-types");
    for (let i = 0; i < parsedResponse.types.length; i++) {
        let type = parsedResponse.types[i].type.name;
        let li = document.createElement("li");
        li.classList.add("type-card", type);
        li.textContent = type;
        typesList.appendChild(li);
    }
    // Stats
    let h3 = document.createElement("h3");
    h3.textContent = "Stats";
    let statsList = document.createElement("ul");
    statsList.classList.add("pokemon-stats");
    let statNames = ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
    let baseStatTotal = 0;
    for (let i = 0; i < parsedResponse.stats.length; i++) {
        let statValue = parsedResponse.stats[i].base_stat;
        let li1 = document.createElement("li");
        let li2 = document.createElement("li");
        li1.textContent = statNames[i];
        li2.textContent = statValue;
        statsList.append(li1, li2);
        baseStatTotal += statValue;
    }
    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    li1.textContent = "Total";
    li2.textContent = baseStatTotal;
    statsList.append(li1, li2);
    // Append everything
    POKEMON_INFO.append(img, h2, typesList, h3, statsList);
}

/**
 * Generates a list of 151 Pokémon for the navigation
 */
function generatePokemonlistForNav() {
    for (let i = 0; i < 151; i++) {
        let pokemonName = parsedResponse.results[i].name[0].toUpperCase() + parsedResponse.results[i].name.substring(1);
        switch (pokemonName) {
            case "Nidoran-m":
                pokemonName = "Nidoran (Male)";
                break;
            case "Nidoran-f":
                pokemonName = "Nidoran (Female)";
                break;
            case "Mr-mime":
                pokemonName = "Mr. Mime";
        }
        POKEMON_ROSTER.innerHTML += "<li>#" + (i + 1) + " " + pokemonName + "</li>";
    }
    const NAV_LINKS = POKEMON_ROSTER.getElementsByTagName("li");
    for (let i = 0; i < NAV_LINKS.length; i++) {
        NAV_LINKS[i].addEventListener("click", function () {
            requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon/" + (i + 1) + "/", showPokemonInfo);
            toggleMenu();
        });
    }
}

/**
 * Toggles Pokemon Roster navigation visibility
 */
function toggleMenu() {
    NAV.classList.toggle("hidden");
    MENU_BUTTON.classList.toggle("fa-bars");
    MENU_BUTTON.classList.toggle("fa-times");
    MENU_BUTTON.classList.toggle("close-button");
    if (POKEMON_INFO.innerHTML != "") {
        RESULTS.classList.toggle("hidden");
    } else {
        MAIN.classList.toggle("hidden");
    }
}

/**
 * Generates a list of sprites for the main page. Shows the Pokémon's info when the corresponding image is clicked.
 */
function generatePokemonListForMain() {
    const POKEMON_LIST = document.querySelector(".pokemon-list");
    for (let i = 0; i < 151; i++) {
        let pokemonName = parsedResponse.results[i].name[0].toUpperCase() + parsedResponse.results[i].name.substring(1);
        switch (pokemonName) {
            case "Nidoran-m":
                pokemonName = "Nidoran (Male)";
                break;
            case "Nidoran-f":
                pokemonName = "Nidoran (Female)";
                break;
            case "Mr-mime":
                pokemonName = "Mr. Mime";
        }
        let img = document.createElement("img");
        img.setAttribute("src", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + (i + 1) + ".png");
        img.setAttribute("title", pokemonName);
        POKEMON_LIST.appendChild(img);

    }
    const LIST_IMAGES = POKEMON_LIST.getElementsByTagName("img");
    for (let i = 0; i < LIST_IMAGES.length; i++) {
        LIST_IMAGES[i].addEventListener("click", function () {
            requestAssistanceFromAPI("https://pokeapi.co/api/v2/pokemon/" + (i + 1) + "/", showPokemonInfo);
        });
    }
}
