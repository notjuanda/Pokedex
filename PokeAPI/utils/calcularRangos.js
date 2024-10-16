function calcularRangoPokemon({ hp, ataque, defensa, spAtaque, spDefensa, velocidad }) {
    const total = hp + ataque + defensa + spAtaque + spDefensa + velocidad;

    let rango;
    if (total >= 600) {
        rango = 'S';
    } else if (total >= 500) {
        rango = 'A';
    } else if (total >= 400) {
        rango = 'B';
    } else if (total >= 300) {
        rango = 'C';
    } else {
        rango = 'D';
    }

    return { total, rango };
}
