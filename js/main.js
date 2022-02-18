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
    console.log(lotteryArray);
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

    const matches = [];
    let limit = totalAmoutOfGames;

    const concertMatch = (randomTeamOne, randomTeamTwo) => {
        let modifiedGame = randomTeamOne.concat(randomTeamTwo);
        modifiedGame[0].playedAgainst ? modifiedGame[0].playedAgainst.push(modifiedGame[1].team) : modifiedGame[0].playedAgainst = [modifiedGame[1].team];
        modifiedGame[1].playedAgainst ? modifiedGame[1].playedAgainst.push(modifiedGame[0].team) : modifiedGame[1].playedAgainst = [modifiedGame[0].team];
        matches.push(modifiedGame);
        console.log(randomTeamOne, randomTeamTwo)
        console.log("Partido concertado");
        // console.log(matches)
        limit--;
    }

    while (limit > 0) {
        let randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);
        let randomTeamOne = [lotteryArray[randomizedIndexForlotteryArray]];
        randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);
        let randomTeamTwo = [lotteryArray[randomizedIndexForlotteryArray]];
        if (randomTeamOne[0].player === randomTeamTwo[0].player) {
            console.log(randomTeamOne, randomTeamTwo)
            console.log("Coincidieron los jugadores");
            randomTeamOne = [];
            randomTeamTwo = [];
        }
        else {
            if (randomTeamOne[0].playedAgainst && randomTeamTwo[0].playedAgainst) {
                console.log("Ambos equipos tienen partidos jugados contra otros");
                if (randomTeamOne[0].playedAgainst.includes(randomTeamTwo[0].team)) {
                    console.log(randomTeamOne, randomTeamTwo)
                    console.log("Ya jugaron entre si");
                    randomTeamOne = [];
                    randomTeamTwo = [];
                }
                else {
                    concertMatch(randomTeamOne, randomTeamTwo)
                }
            }
            else if (randomTeamOne[0].playedAgainst) {
                console.log("El equipo 1 tiene partidos jugados contra otros")
                console.log(randomTeamOne, randomTeamTwo);
                if (randomTeamOne[0].playedAgainst.includes(randomTeamTwo[0].team)) {
                    console.log(randomTeamOne, randomTeamTwo)
                    console.log("Ya jugaron entre si");
                    randomTeamOne = [];
                    randomTeamTwo = [];
                }
                else {
                    concertMatch(randomTeamOne, randomTeamTwo)
                }
            }
            else if (randomTeamTwo[0].playedAgainst) {
                console.log("El equipo 2 tiene partidos jugados contra otros");
                console.log(randomTeamOne, randomTeamTwo);
                if (randomTeamTwo[0].playedAgainst.includes(randomTeamOne[0].team)) {
                    console.log("Ya jugaron entre si");
                    randomTeamOne = [];
                    randomTeamTwo = [];
                }
                else {
                    concertMatch(randomTeamOne, randomTeamTwo)
                }
            }
            // Si llego a este punto del flujo, significa que ninguno jugó algún partido antes.
            else {
                console.log("Ninguno de los equipos había jugado antes");
                concertMatch(randomTeamOne, randomTeamTwo)
            }
        }
    }

    console.log(matches);

    // Función "containsArray" to check for arrays inside a bigger array //

    Array.prototype.containsArray = function (val) {
        var hash = {};
        for (var i = 0; i < this.length; i++) {
            hash[this[i]] = i;
        }
        return hash.hasOwnProperty(val);
    }

    // Termina la función "containsArray" //

    // Función para combinar arrays dentro de un array //

    // const oldArray = [[1], [2, 3], [4]];
    // const newArray = Array.prototype.concat.apply([], oldArray);
    // console.log(newArray); 

    // Termina la función concat + apply

    // const concatMatches = Array.prototype.concat.apply([], matches);

    // console.log(concatMatches);

    let weeks = [];

    let matchesForFunction = [...matches]

    let temporaryArray = [];

    let gamesToBeAdded = totalAmoutOfGames;

    let maxLoops = 10;

    fixtureManagement(matches, matchesForFunction, weeks, temporaryArray, gamesToBeAdded, totalAmoutOfGames, amountOfGamesByWeek, maxLoops);

    while (weeks.length < totalAmountOfWeeks) {
        console.log("REPITO LA FUNCIÓN")
        fixtureManagement(matches, matchesForFunction, weeks, temporaryArray, gamesToBeAdded, totalAmoutOfGames, amountOfGamesByWeek, maxLoops);
    }

    weeks.forEach((week, index) => {
        let div = document.createElement("DIV");
        let title = document.createElement("H3");
        let weekTitle = document.createTextNode(`Fecha ${index + 1}`);
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
};

const fixtureManagement = (matches, matchesForFunction, weeks, temporaryArray, gamesToBeAdded, totalAmoutOfGames, amountOfGamesByWeek, maxLoops) => {
    while (gamesToBeAdded > 0) {
        matchesForFunction.forEach((element, index) => {
            console.log(weeks)
            console.log(element[0], element[1]);
            // console.log(temporaryArray.some(some => (some === element[0])));
            // console.log(temporaryArray.some(some => (some === element[1])));
            if ((temporaryArray.some(some => (some[0] === element[0]))) === true) {
                console.log("Coincidió el equipo " + element[0].team);
            }
            else if ((temporaryArray.some(some => (some[1] === element[0]))) === true) {
                console.log("Coincidió el equipo " + element[0].team);
            }
            else if ((temporaryArray.some(some => (some[0] === element[1]))) === true) {
                console.log("Coincidió el equipo " + element[1].team);
            }
            else if ((temporaryArray.some(some => (some[1] === element[1]))) === true) {
                console.log("Coincidió el equipo " + element[1].team);
            }
            else if (element === "Partido eliminado") {
                console.log("Este partido ya fue agregado")
            }
            else {
                console.log("No lo encontró, agrego");
                temporaryArray.push([element[0], element[1]]);
                matchesForFunction.splice(index, 1, "Partido eliminado");
                console.log("Elimino en la posición " + index);
                console.log(matchesForFunction);
                gamesToBeAdded--;
            }
        });

        maxLoops--;
        console.log("La cantidad de loops es: " + maxLoops)

        if (temporaryArray.length === amountOfGamesByWeek) {
            weeks.push(temporaryArray);
            temporaryArray = [];
        }
        /// REVISAR ///
        else if (maxLoops === 0) {
            temporaryArray = [];
            gamesToBeAdded = totalAmoutOfGames;
            weeks = [];
            matchesForFunction = [...matches]
            break;
        }
        else {
            continue;
        }
        console.log(weeks);
    }
}

// const lookingIntoTheArray = (fixedFixture) => {
//     return fixedFixture.forEach((element) => element[0].team, element[1].team)
// }


// const createBalancedFixture = (arrayWithMathes) => {

//     // Debería crear un bucle que recorra todo arrayWithMathes, que agregue una cantidad igual a amountOfGamesByWeek sobre temporaryArray.

//     let temporaryArray = arrayWithMathes.filter((element, index) => {
//         element[0].team && element[1].team !== lookingIntoTheArray(fixedFixture);
//     })

//     console.log(temporaryArray);
// }

// La idea sería vaciar el temporaryArray cuando complete 10 partidos con equipos que jueguen una vez por vez //