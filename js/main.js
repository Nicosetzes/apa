///// MODALIDAD SORTEO TOTAL - EQUIPOS AL AZAR PARA TODOS LOS JUGADORES /////

const playerArray = [];
const teamArray = [];

document.getElementById("confirmationOfSettings").addEventListener("click", (event) => {
    event.preventDefault();
    const numberOfPlayers = Number(document.getElementById("numberOfPlayers").value);
    const numberOfTeams = Number(document.getElementById("numberOfTeams").value * numberOfPlayers);
    playerAndTeamSubmission(numberOfPlayers, numberOfTeams);
});

const playerAndTeamSubmission = (NOfPlayers, NOfTeams) => {
    const playerFormInputs = [];
    const teamFormInputs = [];
    for (i = 1; i <= NOfPlayers; i++) {
        playerFormInputs.push(`<input id="player${i}">`);
    }
    for (i = 1; i <= NOfTeams; i++) {
        teamFormInputs.push(`<input id="team${i}">`);
    }

    const playerForm = playerFormInputs.join(``);
    const teamForm = teamFormInputs.join(``);

    document.getElementById("playerNames").innerHTML = `<span class="formTitle">Players</span><div id="playerInputContainer">${playerForm}</div><button id="playerPickConfirmation">Confirmar</button>`;
    document.getElementById("teamNames").innerHTML = `<span class="formTitle">Teams</span><div id="teamInputContainer">${teamForm}</div><button id="teamPickConfirmation">Confirmar</button>`;

    document.querySelector("#playerPickConfirmation").addEventListener("click", (event) => {
        event.preventDefault();
        const playerInputsAndValues = document.getElementById("playerInputContainer").childNodes;
        for (i = 0; i < NOfPlayers; i++) {
            playerArray.push({ player: playerInputsAndValues[i].value, NOfTeams: NOfTeams / NOfPlayers });
        }

        document.getElementById("playerPickConfirmation").parentElement.classList.add("successful");
        console.log(playerArray)
    })

    document.querySelector("#teamPickConfirmation").addEventListener("click", (event) => {
        event.preventDefault();
        const teamInputAndValues = document.getElementById("teamInputContainer").childNodes;
        for (i = 0; i < NOfTeams; i++) {
            teamArray.push(teamInputAndValues[i].value);
        }
        document.getElementById("teamPickConfirmation").parentElement.classList.add("successful");
        console.log(teamArray)
    })
}

// FUNCIÓN PARA EMPAREJAR A CADA JUGADOR CON LOS EQUIPOS DISPONIBLES (AL AZAR) //

const teamIndexes = []

document.querySelector("#lotteryConfirmation").addEventListener("click", () => {

    if (playerArray.length !== 0 && teamArray.length !== 0) {

        for (i = 0; i < teamArray.length; i++) {
            teamIndexes.push(i);
        }
        const lotteryResults = [];

        while (teamArray.length > 0) {

            let randomizedIndexForPlayers = Math.floor(Math.random() * playerArray.length);
            let randomizedIndexForTeams = Math.floor(Math.random() * teamArray.length);

            let object = { player: playerArray[randomizedIndexForPlayers], team: teamArray[randomizedIndexForTeams] }

            if (object.player.NOfTeams > 0) {
                lotteryResults.push(object);
                playerArray[randomizedIndexForPlayers].NOfTeams--;
            }
            else {
                continue;
            }
            // Descartar equipo que ya fue elegido //
            teamArray.splice(randomizedIndexForTeams, 1);
        }

        lotteryResults.forEach((element) => {
            let node = document.createElement("DIV");
            let textInsideNode = document.createTextNode(`${element.player.player} - ${element.team}`);
            node.appendChild(textInsideNode);
            document.getElementById("lotteryResults").appendChild(node);
        });

        document.getElementById("lotteryResults").classList.add("lotteryResults");

        // FIXING LOTTERYRESULTS //

        const definitiveLotteryResults = lotteryResults.map((result) => { return { player: result.player.player, team: result.team } })

        fixture(definitiveLotteryResults, playerArray);
    }
});

// NÚMERO DE EQUIPOS PARES //

const fixture = (lotteryArray, playerArray) => {

    // const players = lotteryArray.map((result) => { return result.player })
    // const teams = lotteryArray.map((result) => { return result.team })
    // console.log(players)
    // console.log(teams)
    // Calcular cantidad de equipos por jugador: //
    const amountOfTeamsForEachPlayer = lotteryArray.length / playerArray.length;
    console.log(amountOfTeamsForEachPlayer);
    // Calcular cantidad de partidos totales por equipo: //
    const amountOfGamesForEachTeam = lotteryArray.length - amountOfTeamsForEachPlayer;
    console.log("partidos por equipo:" + amountOfGamesForEachTeam);
    // Calcular cantidad de partidos en total (del torneo): //
    const totalAmoutOfGames = (amountOfGamesForEachTeam * lotteryArray.length) / 2;  // Dividido 2, porque en cada partido se involucran 2 equipos;
    console.log("cantidad de partidos total:" + totalAmoutOfGames);
    // Calcular cantidad de partidos por fecha: //
    const amountOfGamesByWeek = lotteryArray.length / 2;
    console.log("partidos por fecha:" + amountOfGamesByWeek);
    // Calcular cantidad de fechas: // 
    const totalAmountOfWeeks = totalAmoutOfGames / amountOfGamesByWeek;
    console.log("cantidad de fechas total:" + totalAmountOfWeeks)

    // const matches = [];
    const weeks = [];
    const matchesAlreadyPlayedInTotal = [];
    const matchesAlreadyPlayedByTeam = [];
    let teamHasPlayedThisWeek = [];
    let temporaryWeek = [];
    let limit = totalAmoutOfGames;
    // let maxLoops = 10000;
    let teamsThatHaveNotPlayedThisWeek = [...lotteryArray];

    // PROBANDO FORMAS ALTERNATIVAS //

    // const shuffledLotteryArray = lotteryArray
    //     .map(value => ({ value, sort: Math.random() }))
    //     .sort((a, b) => a.sort - b.sort)
    //     .map(({ value }) => value);

    // console.log(lotteryArray);
    // console.log(shuffledLotteryArray); // Funciona perfecto //

    // let match = [];
    // const allMatches = [];

    // shuffledLotteryArray.forEach((element) => {
    //     match = 
    // })

    // const concertMatches = () => {
    //     shuffledLotteryArray
    // } 

    const concertMatch = (randomTeamOne, randomTeamTwo) => {
        if (!randomTeamOne && !randomTeamTwo) {
            console.log("EL PARTIDO NO SERÁ CONCERTADO");
            // Pusheo la fecha como está // 
            weeks.push(temporaryWeek);
            temporaryWeek = [];
            teamHasPlayedThisWeek = [];
            teamsThatHaveNotPlayedThisWeek = [...lotteryArray];
        }
        else {
            console.log(randomTeamOne, randomTeamTwo)
            // Resto un partido al total con el limit--: //
            limit--;
            // Le pusheo la suma los índices sorteados a matchesAlreadyPlayedInTotal: //
            matchesAlreadyPlayedInTotal.push(randomTeamOne.team + "vs" + randomTeamTwo.team, randomTeamTwo.team + "vs" + randomTeamOne.team);
            // Le pusheo los índices individuales sorteados a matchesAlreadyPlayedByTeam para cuantificar cuántos partidos viene jugando cada equipo: //
            matchesAlreadyPlayedByTeam.push(randomTeamOne.team, randomTeamTwo.team);
            // Le pusheo los índices individuales a teamHasPlayedThisWeek: //
            teamHasPlayedThisWeek.push(randomTeamOne.team, randomTeamTwo.team);
            // Averiguo el index de los equipos en teamsThatHaveNotPlayedThisWeek. Los elimino del array: //
            let firstIndex = teamsThatHaveNotPlayedThisWeek.indexOf(randomTeamOne);
            console.log(`Elimino ${randomTeamOne.team} en la posición ${firstIndex}`)
            console.log(`En la posición obtenida, se encuentra el equipo: ${teamsThatHaveNotPlayedThisWeek[firstIndex].team}`)
            teamsThatHaveNotPlayedThisWeek.splice(firstIndex, 1);
            let secondIndex = teamsThatHaveNotPlayedThisWeek.indexOf(randomTeamTwo);
            console.log(`Elimino ${randomTeamTwo.team} en la posición ${secondIndex}`)
            console.log(`En la posición obtenida, se encuentra el equipo: ${teamsThatHaveNotPlayedThisWeek[secondIndex].team}`)
            teamsThatHaveNotPlayedThisWeek.splice(secondIndex, 1);
            console.log("teamsThatHaveNotPlayedThisWeek:");
            console.log(teamsThatHaveNotPlayedThisWeek);
            // Creo un array que tendrá 2 objetos, cada array es un partido: //
            let modifiedGame = [randomTeamOne, randomTeamTwo];
            temporaryWeek.push(modifiedGame);
            // ÚLTIMO PARTIDO DE CADA FECHA //
            if (temporaryWeek.length === amountOfGamesByWeek) {
                console.log("CONCERTÉ EL ÚLTIMO PARTIDO DE LA FECHA");
                weeks.push(temporaryWeek);
                temporaryWeek = [];
                teamHasPlayedThisWeek = [];
                teamsThatHaveNotPlayedThisWeek = [...lotteryArray];
            }
            // if (limit < 2 * amountOfGamesByWeek) {
            //     console.log("PARTIDO CONCERTADO, AUN QUEDAN PARTIDOS EN LA FECHA");
            // }
            // ÚLTIMO PARTIDO ARREGLADO (LIMIT = 0): //
            if (limit === 0) {
                weeks.push(temporaryWeek);
            }
            // Chequeo si uno de los equipos sorteados ya jugó su máximo de partidos: //
            let firstCount = 0;
            let secondCount = 0;
            // Recorro el array matchesA lreadyPlayedByTeam y cuento la cantidad de partidos que jugó cada equipo: //
            matchesAlreadyPlayedByTeam.forEach((element) => {
                if (element === randomTeamOne.team) {
                    firstCount++;
                }
                if (element === randomTeamTwo.team) {
                    secondCount++;
                }
            });
            // Calculo cuáles son los índices de los equipos sorteados (para el paso que sigue): //
            let firstTeamIndex = lotteryArray.indexOf(randomTeamOne);
            // Si randomTeamOne alcanzó su máximo de partidos, lo elimino de lotteryArray (por performance): //
            firstCount === amountOfGamesForEachTeam ? lotteryArray.splice(firstTeamIndex, 1) : console.log(`El equipo ${randomTeamOne.team} aun tiene ${amountOfGamesForEachTeam - firstCount} partidos por jugar`);
            // Como pude haber borrado un elemento, recién ahora debo calcular el índice del randomTeamTwo //
            let secondTeamIndex = lotteryArray.indexOf(randomTeamTwo);
            // Si randomTeamTwo alcanzó su máximo de partidos, lo elimino de lotteryArray (por performance): //
            secondCount === amountOfGamesForEachTeam ? lotteryArray.splice(secondTeamIndex, 1) : console.log(`El equipo ${randomTeamTwo.team} aun tiene ${amountOfGamesForEachTeam - secondCount} partidos por jugar`);
            firstTeamIndex; // ¿NECESARIO? //
            secondTeamIndex; // ¿NECESARIO? //
        }
    }

    let maxLoops = 1000;

    while (limit > 0) {
        maxLoops--;
        console.log("maxLoops: " + maxLoops);
        if (maxLoops === 0) {
            break;
        }
        // Cuando queden pocos partidos por arreglar, que el pick sea nuevamente desde lotteryArray, y no desde teamsThatHaveNotPlayedThisWeek: //
        // if (limit < amountOfGamesByWeek) {
        //     teamsThatHaveNotPlayedThisWeek = [...lotteryArray]
        // }
        console.log("lotteryArray:");
        console.log(lotteryArray);
        console.log("limit:");
        console.log(limit);
        let firstRandomizedIndex;
        let secondRandomizedIndex;
        let randomTeamOne;
        let randomTeamTwo;
        console.log("temporaryWeek.length:");
        console.log(temporaryWeek.length);
        console.log("teamHasPlayedThisWeek: ");
        console.log(teamHasPlayedThisWeek);
        console.log("teamsThatHaveNotPlayedThisWeek: ");
        console.log(teamsThatHaveNotPlayedThisWeek);
        // Agrego la excepción de amountOfGamesByWeek > 4 así solo aplica para torneos grandes! //
        limit < 2 * amountOfGamesByWeek && amountOfGamesByWeek > 4 ? teamsThatHaveNotPlayedThisWeek = [...lotteryArray] : console.log("AUN QUEDAN MUCHOS PARTIDOS")
        firstRandomizedIndex = Math.floor(Math.random() * teamsThatHaveNotPlayedThisWeek.length);
        secondRandomizedIndex = Math.floor(Math.random() * teamsThatHaveNotPlayedThisWeek.length);
        // Randomizo los equipos //
        randomTeamOne = teamsThatHaveNotPlayedThisWeek[firstRandomizedIndex];
        randomTeamTwo = teamsThatHaveNotPlayedThisWeek[secondRandomizedIndex];
        console.log("EQUIPOS SORTEADOS: ")
        console.log(randomTeamOne, randomTeamTwo)
        if (amountOfGamesByWeek > 4 && (matchesAlreadyPlayedInTotal.some((element) => element === randomTeamOne.team + "vs" + randomTeamTwo.team)) && (temporaryWeek.length === amountOfGamesByWeek - 1 || temporaryWeek.length === amountOfGamesByWeek - 2)) {
            console.log("EL PARTIDO YA SE JUGÓ, PASO A LA SIGUIENTE FECHA");
            concertMatch(); // Los parámetros serán undefined //
        }
        // Con evaluar solo element === randomTeamOne.team + "vs" + randomTeamTwo.team alcanza, porque si está una combinatoria, también está la inversa
        if (matchesAlreadyPlayedInTotal.some((element) => element === randomTeamOne.team + "vs" + randomTeamTwo.team)) {
            console.log("EL PARTIDO YA SE JUGÓ, REPITO EL WHILE");
            continue;
        }
        // Planteando equipos != en lo que sigue, me aseguro de que NO entre aquí si los random teams fueron los mismos (puede pasar y no es nada malo) //
        if (amountOfGamesByWeek > 4 && randomTeamOne.player === randomTeamTwo.player && randomTeamOne.team !== randomTeamTwo.team && (temporaryWeek.length === amountOfGamesByWeek - 1 || temporaryWeek.length === amountOfGamesByWeek - 2)) {
            console.log(randomTeamOne.player);
            console.log(randomTeamTwo.player);
            console.log("EL PARTIDO ES ENTRE EQUIPOS DEL MISMO JUGADOR, PASO A LA SIGUIENTE FECHA");
            concertMatch(); // Los parámetros serán undefined //
        }
        // Ahora debo contemplar el caso donde el último partido a agregar es entre equipos del mismo jugador: //
        if (randomTeamOne.player === randomTeamTwo.player) {
            console.log("EL PARTIDO ES ENTRE EQUIPOS DEL MISMO JUGADOR, REPITO EL WHILE");
            continue;
        }
        console.log("NINGUNO DE LOS EQUIPOS HABÍA JUGADO ENTRE SÍ");
        concertMatch(randomTeamOne, randomTeamTwo);
    }

    console.log("weeks:");
    console.log(weeks);
    console.log("matchesAlreadyPlayedInTotal: ");
    console.log(matchesAlreadyPlayedInTotal);
    console.log("teamsThatHaveNotPlayedThisWeek: ");
    console.log(teamsThatHaveNotPlayedThisWeek);

    weeks.forEach((week, index) => {
        let div = document.createElement("DIV");
        let title = document.createElement("H3");
        let weekTitle = document.createTextNode(`Semana ${index + 1}`);
        div.appendChild(title);
        title.appendChild(weekTitle);
        document.getElementById("matches").appendChild(div);
        week.forEach((game) => {
            let div = document.createElement("DIV");
            let match = document.createTextNode(`${game[0].team} (${game[0].player}) vs ${game[1].team} (${game[1].player})`);
            div.appendChild(match);
            document.getElementById("matches").appendChild(div);
        })
    });

    // Función "containsArray" to check for arrays inside a bigger array //

    // Array.prototype.containsArray = function (val) {
    //     var hash = {};
    //     for (var i = 0; i < this.length; i++) {
    //         hash[this[i]] = i;
    //     }
    //     return hash.hasOwnProperty(val);
    // }

    // Termina la función "containsArray" //

    // Función para combinar arrays dentro de un array //

    // const oldArray = [[1], [2, 3], [4]];
    // const newArray = Array.prototype.concat.apply([], oldArray);
    // console.log(newArray); 

    // Termina la función concat + apply

    // const concatMatches = Array.prototype.concat.apply([], matches);

    // console.log(concatMatches);

};


// const createBalancedFixture = (arrayWithMathes) => {

//     // Debería crear un bucle que recorra todo arrayWithMathes, que agregue una cantidad igual a amountOfGamesByWeek sobre temporaryArray.

//     let temporaryArray = arrayWithMathes.filter((element, index) => {
//         element[0].team && element[1].team !== lookingIntoTheArray(fixedFixture);
//     })

//     console.log(temporaryArray);
// }

// La idea sería vaciar el temporaryArray cuando complete 10 partidos con equipos que jueguen una vez por vez //

// LO SIGUIENTE FUNCIONA CON BUGS //

// let weeks = [];

//     let temporaryArray = [];

//     let gamesToBeAdded = totalAmoutOfGames;

//     let maxLoops = 10;

//     while (gamesToBeAdded > 0 && maxLoops != 0) {
//         matches.forEach((element, index) => {
//             console.log(weeks)
//             console.log(element[0], element[1]);
//             if ((temporaryArray.some(some => (some === element[0]))) === true) {
//                 console.log("Coincidió el equipo " + element[0].team);
//                 console.log("Me encuentro en la posición " + index + " del array")
//             }
//             else if ((temporaryArray.some(some => (some === element[1]))) === true) {
//                 console.log("Coincidió el equipo " + element[1].team);
//                 console.log("Me encuentro en la posición " + index + " del array")
//             }
//             else if (element === "Partido eliminado") {
//                 console.log("Este partido ya fue agregado")
//                 console.log("Me encuentro en la posición " + index + " del array")
//             }
//             else {
//                 console.log("No lo encontró, agrego");
//                 temporaryArray.push(element[0], element[1]);
//                 matches.splice(index, 1, "Partido eliminado");
//                 console.log("Elimino en la posición " + index);
//                 console.log(matches)
//                 gamesToBeAdded--;
//             }
//         });

//         maxLoops--;
//         console.log("Ahora maxLoops es igual a " + maxLoops);

//         if (temporaryArray.length === amountOfGamesByWeek) {
//             weeks.push(temporaryArray);
//             temporaryArray = [];
//             console.log("SE AGREGÓ UNA FECHA")
//         }
//         else {
//             continue;
//         }
//     }

// const matches = [];
//     let limit = totalAmoutOfGames;

//     const concertMatch = (randomTeamOne, randomTeamTwo) => {
//         let modifiedGame = randomTeamOne.concat(randomTeamTwo);
//         modifiedGame[0].playedAgainst ? modifiedGame[0].playedAgainst.push(modifiedGame[1].team) : modifiedGame[0].playedAgainst = [modifiedGame[1].team];
//         modifiedGame[1].playedAgainst ? modifiedGame[1].playedAgainst.push(modifiedGame[0].team) : modifiedGame[1].playedAgainst = [modifiedGame[0].team];
//         matches.push(modifiedGame);
//         console.log(randomTeamOne, randomTeamTwo)
//         console.log("Partido concertado");
//         // console.log(matches)
//         limit--;
//     }

//     while (limit > 0) {
//         let randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);
//         let randomTeamOne = [lotteryArray[randomizedIndexForlotteryArray]];
//         randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);
//         let randomTeamTwo = [lotteryArray[randomizedIndexForlotteryArray]];
//         if (randomTeamOne[0].player === randomTeamTwo[0].player) {
//             console.log(randomTeamOne, randomTeamTwo)
//             console.log("Coincidieron los jugadores");
//             randomTeamOne = [];
//             randomTeamTwo = [];
//         }
//         else {
//             if (randomTeamOne[0].playedAgainst && randomTeamTwo[0].playedAgainst) {
//                 console.log("Ambos equipos tienen partidos jugados contra otros");
//                 if (randomTeamOne[0].playedAgainst.includes(randomTeamTwo[0].team)) {
//                     console.log(randomTeamOne, randomTeamTwo)
//                     console.log("Ya jugaron entre si");
//                     randomTeamOne = [];
//                     randomTeamTwo = [];
//                 }
//                 else {
//                     concertMatch(randomTeamOne, randomTeamTwo)
//                 }
//             }
//             else if (randomTeamOne[0].playedAgainst) {
//                 console.log("El equipo 1 tiene partidos jugados contra otros")
//                 console.log(randomTeamOne, randomTeamTwo);
//                 if (randomTeamOne[0].playedAgainst.includes(randomTeamTwo[0].team)) {
//                     console.log(randomTeamOne, randomTeamTwo)
//                     console.log("Ya jugaron entre si");
//                     randomTeamOne = [];
//                     randomTeamTwo = [];
//                 }
//                 else {
//                     concertMatch(randomTeamOne, randomTeamTwo)
//                 }
//             }
//             else if (randomTeamTwo[0].playedAgainst) {
//                 console.log("El equipo 2 tiene partidos jugados contra otros");
//                 console.log(randomTeamOne, randomTeamTwo);
//                 if (randomTeamTwo[0].playedAgainst.includes(randomTeamOne[0].team)) {
//                     console.log("Ya jugaron entre si");
//                     randomTeamOne = [];
//                     randomTeamTwo = [];
//                 }
//                 else {
//                     concertMatch(randomTeamOne, randomTeamTwo)
//                 }
//             }
//             // Si llego a este punto del flujo, significa que ninguno jugó algún partido antes.
//             else {
//                 console.log("Ninguno de los equipos había jugado antes");
//                 concertMatch(randomTeamOne, randomTeamTwo)
//             }
//         }
//     }

//     console.log(matches);