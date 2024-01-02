let allPokemons = [];
let pokemonSpezies = [];
let allNames = [];
let limit = 10;
let startNumber = 0;

let pokemonContainer = document.getElementById('show-pokemons');
let detailpage = document.getElementById('detailpage');
let fullpage = document.getElementById('fullpage');

getPokemons();

async function loadPokemons() {
	showLoader();
	allPokemons = [];
	allNames = [];
	limit = 10;
	startNumber = 0;
	try {
		await renderPokemons();
	} catch(error) {
		console.error('Error loading pokemons:', error);
	} finally {
		hideLoader();
	}
}

async function renderPokemons() {
	for (let i = startNumber; i < limit; i++) {
		if (!allNames.includes(allPokemons[i]) && !allPokemons.includes(allPokemons[i])) {
			let url = `https://pokeapi.co/api/v2/pokemon/${i + 1}`;
			let response = await fetch(url);
			let responseAsJson = await response.json();
			allPokemons.push(responseAsJson);
			allNames.push(responseAsJson['name']);
			pokemonContainer.innerHTML += generatePokemons(i);
		} else {
			pokemonContainer.innerHTML += generatePokemons(i);
		}
	}
	savePokemons();
}

function generatePokemons(i) {
	return `
	<div onclick="showDetailpage(${i})" class="card flex ${getCardColorClass(allPokemons[i]['types'])}">
		<div class="text">
			<h2 id="pokemon-name">${allPokemons[i]['name']}</h2>
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

		typeClass = typeNull;
    }
    return typeClass;
}

async function showDetailpage(i) {
	showLoader();
	try {
		let pokemon = allPokemons[i];
		urlAbout(i);

		fullpage.style.zIndex = 0;
		detailpage.style.display = 'flex';
		detailpage.innerHTML = await generateDetailpage(pokemon, i);
	} catch(error) {
		console.error('Error loading detailpage:', error);
	} finally {
		hideLoader();
	}
}

async function generateDetailpage(pokemon, i) {
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
	setTimeout(() => {
		let about = document.getElementById('info-table');
		about.innerHTML = generateAboutHtml(i);
	}, 100);
}

function generateAboutHtml(i) {
	let pokemon = allPokemons[i];
	return `
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
			${pokemonSpezies[0]['egg_groups'][0] ? `
				<tr>
					<td class="character">Egg Groups</td>
					<td>${pokemonSpezies[0]['egg_groups'][0]['name']}</td>
				</tr>
				` : ''
			}
			${pokemonSpezies[0]['egg_groups'][1] ? `
				<tr>
					<td class="character">Egg Groups</td>
					<td>${pokemonSpezies[0]['egg_groups'][1]['name']}</td>
				</tr>
				` : ''
			}
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

    let about = document.getElementById('info-table');
    about.innerHTML = generateEvolutionHtml(responseAsJson);
}

function extractPokemonId(url) {
	const parts = url.split('/');
	return +parts[parts.length - 2];
}

function generateEvolutionHtml(responseAsJson) {
	return `
		<div class="evolution flex-wrap justify-center">
			${responseAsJson['chain']['species'] ? `
				<div class="evolution-box">
					<img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${extractPokemonId(responseAsJson['chain']['species']['url'])}.svg">
					<p>${responseAsJson['chain']['species']['name']}</p>
				</div>
			` : ''}
			${responseAsJson['chain']['evolves_to'][0] ? `
				<div class="evolution-box">
					<img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${extractPokemonId(responseAsJson['chain']['evolves_to'][0]['species']['url'])}.svg">
					<p>${responseAsJson['chain']['evolves_to'][0]['species']['name']}</p>
				</div>
			` : ''}
			${responseAsJson['chain']['evolves_to'][0]?.['evolves_to'][0] ? `
				<div class="evolution-box">
					<img class="evolution-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${extractPokemonId(responseAsJson['chain']['evolves_to'][0]['evolves_to'][0]['species']['url'])}.svg">
					<p>${responseAsJson['chain']['evolves_to'][0]['evolves_to'][0]['species']['name']}</p>
				</div>
			` : ''}
		</div>
	`;
}

function generateMoves(i) {
	let pokemon = allPokemons[i];
	let moves = pokemon['moves'];
	let paragraphHtml = '<p id="moves">';

	for (let j = 0; j < moves.length; j++) {
	  let move = moves[j]['move']['name'];
	  paragraphHtml += move + ', ';
	}

	// Entferne das letzte Komma und füge das schließende P-Tag hinzu
	paragraphHtml = paragraphHtml.replace(/, $/, '') + '</p>';

	let about = document.getElementById('info-table');
	about.innerHTML = paragraphHtml;
}

function closeDetailpage() {
	detailpage.style.display = 'none';
	detailpage.innerHTML = '';
	fullpage.style.zIndex = 1;
}

function filterPokemons() {
    let search = document.getElementById('search').value.toLowerCase();
    pokemonContainer.innerHTML = '';

    for (let i = 0; i < allPokemons.length; i++) {
        let pokemonName = allPokemons[i]['name'].toLowerCase();

        if (pokemonName.includes(search)) {
            pokemonContainer.innerHTML += generatePokemons(i);
        }
    }
}

async function loadMorePokemons() {
	try {
		limit += 10;
		startNumber += 10;
		document.getElementById('load-more').disabled = true;
		await renderPokemons();
	} catch(error) {
		console.error('Error loading pokemons:', error);
	} finally {
		document.getElementById('load-more').disabled = false;
	}

}

function savePokemons() {
	let allNamesAsText = JSON.stringify(allNames);
	let allPokemonsAsText = JSON.stringify(allPokemons);
	let limitAsText = JSON.stringify(limit);
	let startNumberAsText = JSON.stringify(startNumber);

	localStorage.setItem('names', allNamesAsText);
	localStorage.setItem('pokemon', allPokemonsAsText);
	localStorage.setItem('limit', limitAsText);
	localStorage.setItem('startNumber', startNumberAsText);
}

function getPokemons() {
	let allNamesAsText = localStorage.getItem('names');
	let allPokemonsAsText = localStorage.getItem('pokemon');
	let limitAsText = localStorage.getItem('limit');
	let startNumberAsText = localStorage.getItem('startNumber');

	if(allNamesAsText && allPokemonsAsText) {
		allNames = JSON.parse(allNamesAsText);
		allPokemons = JSON.parse(allPokemonsAsText);
		limit = JSON.parse(limitAsText);
		startNumber = JSON.parse(startNumberAsText);
	}
}