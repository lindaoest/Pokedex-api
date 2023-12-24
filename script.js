let currentPokemon;
let allPokemons = [];
let pokemonSpezies = [];
let allNames = [];
let pokemonNames;

async function loadPokemons() {
	showLoader();

	try {
		let url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`;
		let response = await fetch(url);
		let responseAsJson = await response.json();
		pokemonNames = responseAsJson['results'];

		loopAllPokemons();
	} catch(error) {
		console.error('Error loading pokemons:', error);
	} finally {
		hideLoader();
	}

}

async function loopAllPokemons(search) {
	document.getElementById('show-pokemons').innerHTML = '';
	for (let i = 0; i < pokemonNames.length; i++) {
		let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
		let response = await fetch(url);
		let responseAsJson = await response.json();
		if(document.getElementById('search').value !== '') {
			if(responseAsJson['name'].toLowerCase().includes(search)) {
				document.getElementById('show-pokemons').innerHTML += generatePokemons(i, pokemonNames);
			}
		} else {
			allNames.push(responseAsJson['name'])
			allPokemons.push(responseAsJson);
			document.getElementById('show-pokemons').innerHTML += generatePokemons(i, pokemonNames);
		}
	}
}

function generatePokemons(i, pokemonNames) {
	return `
	<div onclick="showDetailpage(${i})" class="card flex ${getCardColorClass(allPokemons[i]['types'])}">
		<div class="text">
			<h2 id="pokemon-name">${pokemonNames[i]['name']}</h2>
			<div id="type" class="element">${generateElement(i)}</div>
		</div>
		<div class="images">
			<img class="background" src="./img/pokeball-background.svg" alt="">
			<img class="flex p-t-24 image" src="${allPokemons[i]['sprites']['other']['dream_world']['front_default']}" alt="">
		</div>
	</div>
	`;
}

function showLoader() {
	document.getElementById('loading').style.display = 'flex';
}

function hideLoader() {
	document.getElementById('loading').style.display = 'none';
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
            typeClass = 'blue';
        }
    }
    return typeClass;
}

function showDetailpage(i) {
	let pokemon = allPokemons[i];
	urlAbout(i);

	document.getElementById('fullpage').style.zIndex = 0;
	document.getElementById('detailpage').innerHTML = generateDetailpage(pokemon, i);
}

function generateDetailpage(pokemon, i) {
	return `
	<div id="pokedex" class="${getCardColorClass(pokemon['types'])}">
		<div class="p-16">
			<div class="header flex space-between">
				<div class="flex gap-16" onclick="closeDetailpage()">
					<img class="back-arrow" src="./img/back-arrow.svg" alt="back-arrow">
					<h1 id="pokemon-name">${pokemon['name']}</h1>
				</div>
				<h2>#${i + 1}</h2>
			</div>
			<div id="type" class="element p-t-16">${generateElement(i)}</div>
			<div class="images">
				<img class="background-img" src="./img/pokeball-background.svg" alt="pokemonball">
				<img class="flex p-t-24" id="pokemon-img" src="${pokemon['sprites']['other']['dream_world']['front_default']}" alt="${pokemon['name']}">
			</div>
		</div>
		<div class="container-white">
			<div class="info-names flex">
				<p class="info" onclick="generateAbout(${i})">About</p>
				<p class="info" onclick="generateStats(${i})">Base Stats</p>
				<p class="info" onclick="generateEvolution()">Evolution</p>
				<p class="info" onclick="generateMoves(${i})">Moves</p>
			</div>
			<div id="info-table">${generateAbout(i)}</div>
		</div>
	</div>
	`;
}

async function urlAbout(i) {
	let url = `https://pokeapi.co/api/v2/pokemon-species/${i + 1}/`;
	let response = await fetch(url);
	let responseAsJson = await response.json();

	pokemonSpezies = [];
	pokemonSpezies.push(responseAsJson);
}

function generateAbout(i) {
	let pokemon = allPokemons[i];

	setTimeout(() => {
		let about = document.getElementById('info-table');
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
	}, 100);
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

async function generateEvolution() {
	let url = pokemonSpezies[0]['evolution_chain']['url'];
	let response = await fetch(url);
	let responseAsJson = await response.json();
	let evolution1 = responseAsJson['chain']['species']['name'];
	let evolution2 = responseAsJson['chain']['evolves_to'][0]['species']['name'];
	let evolution3 = responseAsJson['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];

	function extractPokemonId(url) {
		const parts = url.split('/');
		return +parts[parts.length - 2];
	}

	let speciesUrl1 = responseAsJson['chain']['species']['url'];
	let speciesUrl2 = responseAsJson['chain']['evolves_to'][0]['species']['url'];
	let speciesUrl3 = responseAsJson['chain']['evolves_to'][0]['evolves_to'][0]['species']['url'];

	// Die ID extrahieren
	let pokemonId1 = extractPokemonId(speciesUrl1);
	let pokemonId2 = extractPokemonId(speciesUrl2);
	let pokemonId3 = extractPokemonId(speciesUrl3);

	let about = document.getElementById('info-table');
	about.innerHTML = `
		<div class="evolution flex justify-center">
		${evolution1 ? `
			<div class="evolution-box">
				<img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId1}.svg">
				<p>${evolution1}</p>
			</div>
		` : ``}
		${evolution2 ? `
			<div class="evolution-box">
				<img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId2}.svg">
				<p>${evolution2}</p>
			</div>
		` : ``}
		${evolution3 ? `
			<div class="evolution-box">
				<img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId3}.svg">
				<p>${evolution3}</p>
			</div>
		` : ``}
		</div>
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

function closeDetailpage() {
	document.getElementById('detailpage').innerHTML = '';
	document.getElementById('fullpage').style.zIndex = 1;
}

function filterPokemons() {
	let search = document.getElementById('search').value;
	search = search.toLowerCase();
	loopAllPokemons(search);

	// for (let k = 0; k < allNames.length; k++) {
	// 	let name = allNames[k];
	// 	if(name.toLowerCase().includes(search)) {
	// 		loopAllPokemons()
	// 	}
	// }
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