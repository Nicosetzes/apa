///// MODALIDAD SORTEO TOTAL - EQUIPOS AL AZAR PARA TODOS LOS JUGADORES /////

const playerArray = [];
const teamArray = [];
let definitiveLotteryResults = [];

// on-click event-listeners //

document.getElementById("confirmationOfSettings").addEventListener("click", (event) => {
    event.preventDefault();
    const numberOfPlayers = Number(document.getElementById("numberOfPlayers").value);
    const numberOfTeams = Number(document.getElementById("numberOfTeams").value * numberOfPlayers);
    playerAndTeamSubmission(numberOfPlayers, numberOfTeams);
});

document.querySelector("#teamLottery").addEventListener("click", () => {
    assignTeamsToPlayers()
});

document.querySelector("#fixtureGeneration").addEventListener("click", () => {
    fixture(definitiveLotteryResults, playerArray)
});

// Genero la cantidad de inputs adecuada, declaro los on-click necesarios y capturo lo ingresado por el user //

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

// FUNCI??N PARA EMPAREJAR A CADA JUGADOR CON LOS EQUIPOS DISPONIBLES (AL AZAR) //

const assignTeamsToPlayers = () => {

    const teamIndexes = [];

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

        definitiveLotteryResults = lotteryResults.map((result) => { return { player: result.player.player, team: result.team } });

        console.log(definitiveLotteryResults);

        // ARMANDO LA VISTA DEL TORNEO //
        
        const tableElements = [document.createTextNode(`Posici??n`), document.createTextNode(`Equipo`), document.createTextNode(`PJ`), document.createTextNode(`PG`), 
        document.createTextNode(`PE`), document.createTextNode(`PP`), document.createTextNode(`GF`), document.createTextNode(`GC`), document.createTextNode(`+/-`), 
        document.createTextNode(`Puntos`)];

        for(i = 0; i < 10; i++) {
            let div = document.createElement("DIV");
            let span = document.createElement("SPAN");
            span.appendChild(tableElements[i]);
            div.appendChild(span);
            document.getElementById("tournamentView").appendChild(div);
        }

        definitiveLotteryResults.forEach((element, index) => {  
            
            let headerArray = [element.position, element.team, element.player, element.totalGamesPlayed, element.win, element.draw, element.lose, element.scored, element.received,
                element.difference, element.totalPoints];
            
            let tournamentViewChildren = document.getElementById("tournamentView").children;
            let tournamentViewChildrenArray = Array.from(tournamentViewChildren);
            
            tournamentViewChildrenArray.forEach((child, childIndex) => {
                let span = document.createElement("SPAN");
                let textInsideSpan = document.createTextNode(`${headerArray[childIndex]}`);
                span.appendChild(textInsideSpan);
                child.appendChild(span); 
            })
        });
    }
}

// FUNCI??N PARA GENERAR EL FIXTURE //

const fixture = (lotteryArray, playerArray) => {

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

    // Declaro las constantes necesarias //

    const weeks = [];
    const matchesAlreadyPlayedInTotal = [];
    const matchesAlreadyPlayedByTeam = [];
    let teamHasPlayedThisWeek = [];
    let temporaryWeek = [];
    let limit = totalAmoutOfGames;
    let teamsThatHaveNotPlayedThisWeek = [...lotteryArray];

    const concertMatch = (randomTeamOne, randomTeamTwo) => {
        if (!randomTeamOne && !randomTeamTwo) {
            console.log("EL PARTIDO NO SER?? CONCERTADO");
            // Pusheo la fecha como est?? // 
            weeks.push(temporaryWeek);
            temporaryWeek = [];
            teamHasPlayedThisWeek = [];
            teamsThatHaveNotPlayedThisWeek = [...lotteryArray];
        }
        else {
            console.log(randomTeamOne, randomTeamTwo)
            // Resto un partido al total con el limit--: //
            limit--;
            // Le pusheo la suma los ??ndices sorteados a matchesAlreadyPlayedInTotal: //
            matchesAlreadyPlayedInTotal.push(randomTeamOne.team + "vs" + randomTeamTwo.team, randomTeamTwo.team + "vs" + randomTeamOne.team);
            // Le pusheo los ??ndices individuales sorteados a matchesAlreadyPlayedByTeam para cuantificar cu??ntos partidos viene jugando cada equipo: //
            matchesAlreadyPlayedByTeam.push(randomTeamOne.team, randomTeamTwo.team);
            // Le pusheo los ??ndices individuales a teamHasPlayedThisWeek: //
            teamHasPlayedThisWeek.push(randomTeamOne.team, randomTeamTwo.team);
            // Averiguo el index de los equipos en teamsThatHaveNotPlayedThisWeek. Los elimino del array: //
            let firstIndex = teamsThatHaveNotPlayedThisWeek.indexOf(randomTeamOne);
            console.log(`Elimino ${randomTeamOne.team} en la posici??n ${firstIndex}`)
            console.log(`En la posici??n obtenida, se encuentra el equipo: ${teamsThatHaveNotPlayedThisWeek[firstIndex].team}`)
            teamsThatHaveNotPlayedThisWeek.splice(firstIndex, 1);
            let secondIndex = teamsThatHaveNotPlayedThisWeek.indexOf(randomTeamTwo);
            console.log(`Elimino ${randomTeamTwo.team} en la posici??n ${secondIndex}`)
            console.log(`En la posici??n obtenida, se encuentra el equipo: ${teamsThatHaveNotPlayedThisWeek[secondIndex].team}`)
            teamsThatHaveNotPlayedThisWeek.splice(secondIndex, 1);
            console.log("teamsThatHaveNotPlayedThisWeek:");
            console.log(teamsThatHaveNotPlayedThisWeek);
            // Creo un array que tendr?? 2 objetos, cada array es un partido: //
            let modifiedGame = [randomTeamOne, randomTeamTwo];
            temporaryWeek.push(modifiedGame);
            // ??LTIMO PARTIDO DE CADA FECHA //
            if (temporaryWeek.length === amountOfGamesByWeek) {
                console.log("CONCERT?? EL ??LTIMO PARTIDO DE LA FECHA");
                weeks.push(temporaryWeek);
                temporaryWeek = [];
                teamHasPlayedThisWeek = [];
                teamsThatHaveNotPlayedThisWeek = [...lotteryArray];
            }
            // ??LTIMO PARTIDO ARREGLADO (LIMIT = 0): //
            if (limit === 0 && temporaryWeek.length != 0) {
                weeks.push(temporaryWeek);
            }
            // Chequeo si uno de los equipos sorteados ya jug?? su m??ximo de partidos: //
            let firstCount = 0;
            let secondCount = 0;
            // Recorro el array matchesA lreadyPlayedByTeam y cuento la cantidad de partidos que jug?? cada equipo: //
            matchesAlreadyPlayedByTeam.forEach((element) => {
                if (element === randomTeamOne.team) {
                    firstCount++;
                }
                if (element === randomTeamTwo.team) {
                    secondCount++;
                }
            });
            // Calculo cu??les son los ??ndices de los equipos sorteados (para el paso que sigue): //
            let firstTeamIndex = lotteryArray.indexOf(randomTeamOne);
            // Si randomTeamOne alcanz?? su m??ximo de partidos, lo elimino de lotteryArray (por performance): //
            firstCount === amountOfGamesForEachTeam ? lotteryArray.splice(firstTeamIndex, 1) : console.log(`El equipo ${randomTeamOne.team} aun tiene ${amountOfGamesForEachTeam - firstCount} partidos por jugar`);
            // Como pude haber borrado un elemento, reci??n ahora debo calcular el ??ndice del randomTeamTwo //
            let secondTeamIndex = lotteryArray.indexOf(randomTeamTwo);
            // Si randomTeamTwo alcanz?? su m??ximo de partidos, lo elimino de lotteryArray (por performance): //
            secondCount === amountOfGamesForEachTeam ? lotteryArray.splice(secondTeamIndex, 1) : console.log(`El equipo ${randomTeamTwo.team} aun tiene ${amountOfGamesForEachTeam - secondCount} partidos por jugar`);
            firstTeamIndex; // ??NECESARIO? //
            secondTeamIndex; // ??NECESARIO? //
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
        // Agrego la excepci??n de amountOfGamesByWeek > 4 as?? solo aplica para torneos grandes! //
        limit < 2 * amountOfGamesByWeek && amountOfGamesByWeek >= 4 ? teamsThatHaveNotPlayedThisWeek = [...lotteryArray] : console.log("AUN QUEDAN MUCHOS PARTIDOS")
        firstRandomizedIndex = Math.floor(Math.random() * teamsThatHaveNotPlayedThisWeek.length);
        secondRandomizedIndex = Math.floor(Math.random() * teamsThatHaveNotPlayedThisWeek.length);
        // Randomizo los equipos //
        randomTeamOne = teamsThatHaveNotPlayedThisWeek[firstRandomizedIndex];
        randomTeamTwo = teamsThatHaveNotPlayedThisWeek[secondRandomizedIndex];
        console.log("EQUIPOS SORTEADOS: ")
        console.log(randomTeamOne, randomTeamTwo)
        if (amountOfGamesByWeek >= 4 && (matchesAlreadyPlayedInTotal.some((element) => element === randomTeamOne.team + "vs" + randomTeamTwo.team)) && (temporaryWeek.length === amountOfGamesByWeek - 1 || temporaryWeek.length === amountOfGamesByWeek - 2)) {
            console.log("EL PARTIDO YA SE JUG??, PASO A LA SIGUIENTE FECHA");
            concertMatch(); // Los par??metros ser??n undefined //
        }
        // Con evaluar solo element === randomTeamOne.team + "vs" + randomTeamTwo.team alcanza, porque si est?? una combinatoria, tambi??n est?? la inversa
        if (matchesAlreadyPlayedInTotal.some((element) => element === randomTeamOne.team + "vs" + randomTeamTwo.team)) {
            console.log("EL PARTIDO YA SE JUG??, REPITO EL WHILE");
            continue;
        }
        // Planteando equipos != en lo que sigue, me aseguro de que NO entre aqu?? si los random teams fueron los mismos (puede pasar y no es nada malo) //
        if (amountOfGamesByWeek > 4 && randomTeamOne.player === randomTeamTwo.player && randomTeamOne.team !== randomTeamTwo.team && (temporaryWeek.length === amountOfGamesByWeek - 1 || temporaryWeek.length === amountOfGamesByWeek - 2)) {
            console.log(randomTeamOne.player);
            console.log(randomTeamTwo.player);
            console.log("EL PARTIDO ES ENTRE EQUIPOS DEL MISMO JUGADOR, PASO A LA SIGUIENTE FECHA");
            concertMatch(); // Los par??metros ser??n undefined //
        }
        // Ahora debo contemplar el caso donde el ??ltimo partido a agregar es entre equipos del mismo jugador: //
        if (randomTeamOne.player === randomTeamTwo.player) {
            console.log("EL PARTIDO ES ENTRE EQUIPOS DEL MISMO JUGADOR, REPITO EL WHILE");
            continue;
        }
        console.log("NINGUNO DE LOS EQUIPOS HAB??A JUGADO ENTRE S??");
        concertMatch(randomTeamOne, randomTeamTwo);
    }

    console.log("weeks:");
    console.log(weeks);
    console.log("matchesAlreadyPlayedInTotal: ");
    console.log(matchesAlreadyPlayedInTotal);
    // console.log("teamsThatHaveNotPlayedThisWeek: ");
    // console.log(teamsThatHaveNotPlayedThisWeek);

    // ANOTAR FIXTURE // 

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

};

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

    // Funci??n "containsArray" to check for arrays inside a bigger array //

    // Array.prototype.containsArray = function (val) {
    //     var hash = {};
    //     for (var i = 0; i < this.length; i++) {
    //         hash[this[i]] = i;
    //     }
    //     return hash.hasOwnProperty(val);
    // }

    // Termina la funci??n "containsArray" //

    // Funci??n para combinar arrays dentro de un array //

    // const oldArray = [[1], [2, 3], [4]];
    // const newArray = Array.prototype.concat.apply([], oldArray);
    // console.log(newArray); 

    // Termina la funci??n concat + apply

    // const concatMatches = Array.prototype.concat.apply([], matches);

    // console.log(concatMatches);