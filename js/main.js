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

        document.getElementById("lotteryResults").classList.add("lotteryResults");
    }
});