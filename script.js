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

		//console.log(currentPokemon);

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
			<div id="info-table">
				<table>
					<tr>
						<td class="character">Species</td>
						<td>Spezies</td>
					</tr>
					<tr>
						<td class="character">Height</td>
						<td>Spezies</td>
					</tr>
					<tr>
						<td class="character">Weight</td>
						<td>Spezies</td>
					</tr>
					<tr>
						<td class="character">Abilities</td>
						<td>Spezies</td>
					</tr>
					<tr>
						<td>
							<h3>Breeding</h3>
						</td>
					</tr>
					<tr>
						<td class="character">Egg Groups</td>
						<td>Spezies</td>
					</tr>
					<tr>
						<td class="character">Egg Cycle</td>
						<td>Spezies</td>
					</tr>
				</table>
			</div>
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
	let pokemonSpezie = pokemonSpezies[i];

	console.log(pokemonSpezies);

	let about = document.getElementById('info-table');
	about.innerHTML = '';
	about.innerHTML = `
		<table>
			<tr>
				<td class="character">Species</td>
				<td>${urlAbout(i)}</td>
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
				<td>Spezies</td>
			</tr>
			<tr>
				<td class="character">Egg Cycle</td>
				<td>Spezies</td>
			</tr>
		</table>
	`;
}

function generateStats(i) {
	let pokemon = allPokemons[i];
	let about = document.getElementById('info-table');
	about.innerHTML = '';
	about.innerHTML = `
		<table>
			<tr>
				<td class="character">HP</td>
				<td>${pokemon[0]['base_stat']}</td>
			</tr>
			<tr>
				<td class="character">Attack</td>
				<td>${pokemon[1]['base_stat']}</td>
			</tr>
			<tr>
				<td class="character">Defense</td>
				<td>${pokemon[2]['base_stat']}</td>
			</tr>
			<tr>
				<td class="character">Special-Attack</td>
				<td>${pokemon[3]['base_stat']}</td>
			</tr>
			<tr>
				<td class="character">Special-Defense</td>
				<td>${pokemon[4]['base_stat']}</td>
			</tr>
			<tr>
				<td class="character">Speed</td>
				<td>Spezies</td>
			</tr>
			<tr>
				<td class="character">Total</td>
				<td>Spezies</td>
			</tr>
		</table>
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