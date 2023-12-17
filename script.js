let currentPokemon;
let allPokemons = [];
let pokemonSpezies = [];

async function loadPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    const pokemonNames = responseAsJson['results'];

    for (let i = 0; i < pokemonNames.length; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
        let response = await fetch(url);
        currentPokemon = await response.json();

        allPokemons.push(currentPokemon);

        document.getElementById('show-pokemons').innerHTML += `
        <div onclick="showDetailpage(${i})" class="card flex ${getCardColorClass(currentPokemon['types'])}">
            <div class="text">
                <h2 id="pokemon-name">${pokemonNames[i]['name']}</h2>
                <div id="type" class="element">${generateElement(i)}</div>
            </div>
            <div class="images">
                <img class="background" src="./img/pokeball-background.svg" alt="">
                <img class="flex p-t-24 image" id="pokemon-img" src="${currentPokemon['sprites']['other']['dream_world']['front_default']}" alt="">
            </div>
        </div>
        `;
    }
}

function generateElement(i) {
    let types = allPokemons[i]['types'];
    let typeHTML = ''; // Initialisiere eine leere Zeichenkette

    for (let j = 0; j < types.length; j++) {
        let type = types[j]['type']['name'];
        typeHTML += `
            <p class="element-name m-t-16">${type}</p>
        `;
    }

    return typeHTML; // Gib den generierten HTML-Code zurück
}

function generateAbility(i) {
    let abilities = allPokemons[i]['abilities'];
    let abilitiesHTML = ''; // Initialisiere eine leere Zeichenkette

    for (let j = 0; j < abilities.length; j++) {
        let ability = abilities[j]['ability']['name'];
        abilitiesHTML += `
            ${ability}
        `;
    }
    return abilitiesHTML; // Gib den generierten HTML-Code zurück
}

function getCardColorClass(types) {
    let typeClass = ''; // Initialisiere leere Klasse

    if (types.length > 0) {
        let typeNull = types[0]['type']['name'];

        // Überprüfe den Typ und setze die entsprechende Klasse
        if (typeNull === 'grass') {
            typeClass = 'green';
        } else if (typeNull === 'fire') {
            typeClass = 'red';
        } else if (typeNull === 'sky') {
            typeClass = 'blue';
        } else if (typeNull === 'water') {
            typeClass = 'blue'; // Zum Beispiel, für Wasser auch 'blue' verwenden
        }
    }
    return typeClass;
}

function showDetailpage(i) {
	let pokemon = allPokemons[i];
	urlAbout(i);

	document.getElementById('fullpage').style.zIndex = 0;
	document.getElementById('detailpage').innerHTML = `
	<div id="pokedex" class="${getCardColorClass(pokemon['types'])}">
		<div class="p-16">
			<div class="header flex space-between">
				<h1 id="pokemon-name">${pokemon['name']}</h1>
				<h2>#${i + 1}</h2>
			</div>
			<div id="type" class="element p-t-16">${generateElement(i)}</div>
			<div class="images">
				<img class="background-img" src="./img/pokeball-background.svg" alt="">
				<img class="flex p-t-24" id="pokemon-img" src="${pokemon['sprites']['other']['dream_world']['front_default']}" alt="">
			</div>
		</div>
		<div class="container-white">
			<div class="info-names flex">
				<p class="info" onclick="generateAbout(${i})">About</p>
				<p class="info" onclick="generateStats(${i})">Base Stats</p>
				<p class="info" onclick="generateEvolution(${i})">Evolution</p>
				<p class="info" onclick="generateMoves(${i})">Moves</p>
			</div>
			<div id="info-table"></div>
		</div>
	</div>
	`;
}

async function urlAbout(i) {
	let url = `https://pokeapi.co/api/v2/pokemon-species/${i + 1}/`;
	let response = await fetch(url);
	let responseAsJson = await response.json();

	pokemonSpezies.push(responseAsJson);
}

function generateAbout(i) {
	let pokemon = allPokemons[i];

	let about = document.getElementById('info-table');
	about.innerHTML = '';
	about.innerHTML = `
		<table>
			<tr>
				<td class="character">Species</td>
				<td>${pokemonSpezies[0]['genera'][7]['genus']}</td>
			</tr>
			<tr>
				<td class="character">Height</td>
				<td>${pokemon['height']}cm</td>
			</tr>
			<tr>
				<td class="character">Weight</td>
				<td>${pokemon['weight']}g</td>
			</tr>
			<tr>
				<td class="character">Abilities</td>
				<td>${generateAbility(i)}</td>
			</tr>
			<tr>
				<td>
					<h3>Breeding</h3>
				</td>
			</tr>
			<tr>
				<td class="character">Egg Groups</td>
				<td>${pokemonSpezies[0]['egg_groups'][0]['name']}</td>
			</tr>
			<tr>
				<td class="character">Egg Cycle</td>
				<td>${pokemonSpezies[0]['egg_groups'][1]['name']}</td>
			</tr>
		</table>
	`;
}

function generateStats(i) {
	let pokemon = allPokemons[i];
	let about = document.getElementById('info-table');
	let stats = pokemon['stats'];
	let sum = 0;

	// Funktion zur Berechnung des Prozentsatzes
	function berechneProzentsatz(halfNumber, wholeNumber) {
		return (halfNumber / wholeNumber) * 100;
	}

	about.innerHTML = '';
	about.innerHTML = `
		<table id="stats"></table>
	`;

	for (let j = 0; j < stats.length; j++) {
		let statName = stats[j]['stat']['name'];
		let baseStat = stats[j]['base_stat'];
		sum += baseStat;

		let prozent = berechneProzentsatz(baseStat, 100);

		document.getElementById('stats').innerHTML += `
		<tr>
			<td class="character">${statName}</td>
			<td class="flex align-center">
				<p>${baseStat}</p>
				<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
					<div class="progress-bar" style="width: ${prozent}%"></div>
				</div>
			</td>
		</tr>
		`;
	}
	document.getElementById('stats').innerHTML += `
		<tr>
			<td class="character">Total</td>
			<td>${sum}</td>
		</tr>
	`;
}

function generateMoves(i) {
	let pokemon = allPokemons[i];
	let moves = pokemon['moves'];

	let about = document.getElementById('info-table');
	about.innerHTML = '';

	let paragraph = document.createElement('p'); // Erstelle ein neues <p>-Element
    paragraph.id = 'moves';

	for (let j = 0; j < moves.length; j++) {
		const move = moves[j]['move']['name'];
		paragraph.appendChild(document.createTextNode(move + ', ')); // Füge Textknoten hinzu
	}

	// Füge das <p>-Element mit den Textknoten dem 'info-table'-Element hinzu
    about.appendChild(paragraph);
}

// async function loadPokemon() {
// 	let url = `https://pokeapi.co/api/v2/pokemon/charmander`;
// 	let response = await fetch(url);
// 	currentPokemon = await response.json();

// 	console.log(currentPokemon);

// 	document.getElementById('pokemon-name').innerHTML = currentPokemon['name'];
// 	document.getElementById('pokemon-img').src = currentPokemon['sprites']['other']['dream_world']['front_default'];

// 	renderPokemonInfo();
// }

// function renderPokemonInfo() {

// }