module.exports = app => {
    require('./tipo.routes')(app);
    require('./pokemon.routes')(app);
    require('./pokemonTipo.routes')(app);
    require('./habilidad.routes')(app);
    require('./pokemonHabilidad.routes')(app);
    require('./evolucion.routes')(app);
}