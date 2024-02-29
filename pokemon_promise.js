const fs = require('fs');

const fetchPokemonData = url =>{
    return fetch(url).then(response => response.json()).then(data => {
        const pokeData = {
            nome: data.name,
            tipo: data.types.map(type => type.type.name),
            peso: data.weight,
            altura: data.height,
            numDex: data.id,
            spriteLink: data.sprites.front_default
        };
        return pokeData;
    }).catch(error => {
        console.error('Error fetch dados pokemon:', error);
    });
};

const fetchAllPokemon = () =>{
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then(response => response.json()).then(data => {
            const pokemonUrls = data.results.map(pokemon => pokemon.url);
            const promises = pokemonUrls.map(url => fetchPokemonData(url));
            return Promise.all(promises);
        })
        .catch(error => {
            console.error('Error fetch lista:', error);
        });
}

const saveJson = async (filename, data) => {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log('Data saved to', filename);
    } catch (error) {
        console.error('Error save data JSON:', error);
    }
};

fetchAllPokemon().then(pokemonsData => {
    saveJson('pokemons.json', pokemonsData);
});