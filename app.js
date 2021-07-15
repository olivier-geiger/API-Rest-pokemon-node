//## Modules ##
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
let pokemons = require('./mock-pokemon');
const { success, getUniqueId } = require('./helper');

//## variables ##
const app = express();
const port = 3000;

//## middleware morgan ##
app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json());

//## routes ##
app.get('/', (req, res) => {
  res.send('Hello Express 2 !');
});
// la route pour afficher un pokémon spécifique
app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find(pokemon => pokemon.id === id);
  const message = 'Un pokémon a bien été trouvé';
  res.json(success(message, pokemon));
});
// la route affichant la liste des pokémons
app.get('/api/pokemons', (req, res) => {
  const message = 'La liste des pokémons a bien été récupérée';
  const pokemon = pokemons.map(pokemon => pokemon);
  res.json(success(message, pokemon));
});
// la route pour ajouter un pokemon
app.post('/api/pokemons', (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`;
  res.json(success(message, pokemonCreated));
});

// route pour modifier un pokemon
app.put('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id }
  pokemons = pokemons.map(pokemon => {
   return pokemon.id === id ? pokemonUpdated : pokemon
  })
   
  const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
  res.json(success(message, pokemonUpdated))
});
// route pour supprimer un pokemon
app.delete('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
  pokemons = pokemons.filter(pokemon => pokemon.id !== id)
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
  res.json(success(message, pokemonDeleted))
});

//## server ##
app.listen(port, () => {
  console.log(
    `Notre application node est démarré sur le port : http://localhost:${port}`,
  );
});
