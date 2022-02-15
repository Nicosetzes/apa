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
        // console.log(playerArray)
    })

    document.querySelector("#teamPickConfirmation").addEventListener("click", (event) => {
        event.preventDefault();
        const teamInputAndValues = document.getElementById("teamInputContainer").childNodes;
        for (i = 0; i < NOfTeams; i++) {
            teamArray.push(teamInputAndValues[i].value);
        }
        document.getElementById("teamPickConfirmation").parentElement.classList.add("successful");
        // console.log(teamArray)
    })
}

// FUNCIÓN PARA EMPAREJAR A CADA JUGADOR CON LOS EQUIPOS DISPONIBLES (AL AZAR) //

const playerIndexes = []

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

        console.log(lotteryResults)

        document.getElementById("lotteryResults").classList.add("lotteryResults");

        // FIXING LOTTERYRESULTS //

        const definitiveLotteryResults = lotteryResults.map((result) => { return { player: result.player.player, team: result.team } })

        fixture(definitiveLotteryResults, playerArray);
    }
});

// NÚMERO DE EQUIPOS PARES //

const fixture = (lotteryArray, playerArray) => {
    // console.log(lotteryArray);
    const players = lotteryArray.map((result) => { return result.player })
    const teams = lotteryArray.map((result) => { return result.team })
    console.log(players)
    console.log(teams)
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
    const amountOfGamesByWeek = totalAmoutOfGames / (amountOfGamesForEachTeam / 2);
    console.log("partidos por fecha:" + amountOfGamesByWeek);
    // Calcular cantidad de fechas: //
    const totalAmountOfWeeks = totalAmoutOfGames / amountOfGamesByWeek;
    console.log("cantidad de fechas total:" + totalAmountOfWeeks)

    // const week = [];
    const games = [];
    let limit = totalAmoutOfGames;

    while (limit > 0) {
        let randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);
        let randomTeamOne = [lotteryArray[randomizedIndexForlotteryArray]];
        randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);
        let randomTeamTwo = [lotteryArray[randomizedIndexForlotteryArray]];
        if (randomTeamOne[0].player === randomTeamTwo[0].player) {
            randomTeamOne = [];
            randomTeamTwo = [];
            console.log("Coincidieron los jugadores");
            console.log(games);
        }
        else {
            /// Quizás acá tengo que poner otro condicional para equilibrar las fechas ///
            console.log("Partido arreglado");
            let modifiedGame = randomTeamOne.concat(randomTeamTwo);
            games.push(modifiedGame);
            // modifiedGame = [];
            console.log(games)
            limit--
        }
    }

    // games.forEach((element) => {
    //     let node = document.createElement("DIV");
    //     let textInsideNode = document.createTextNode(`${element[0].player} - ${element[0].team} vs ${element[1].player} - ${element[1].team}`);
    //     node.appendChild(textInsideNode);
    //     document.getElementById("matches").appendChild(node);
    // });

    // game.push([lotteryArray[randomizedIndexForlotteryArray]]);
    // console.log(game);

    // for (i = 0; i < totalAmountOfWeeks; i++) {

    // }

    // let randomizedIndexForlotteryArray = Math.floor(Math.random() * lotteryArray.length);

    // const weeks = lotteryArray.forEach()

    // lotteryArray[randomizedIndexForlotteryArray];

    // const teamSchedule = [];
    // let i = amountOfGamesForEachTeam;

    // while (i > 0) {
    //     teams.forEach((team) => teamSchedule.push())

    // }

    // Calcular fechas (weeks): //
    // const amountOfWeeks = 
}