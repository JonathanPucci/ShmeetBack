var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

// Set the configuration for your app
var firebaseConfig = {
    apiKey: "AIzaSyA5BS82V7wLBDJ2B7NI9p_4vLEyQNmaWHQ",
    authDomain: "shmeet-5fdea.firebaseapp.com",
    databaseURL: "https://shmeet-5fdea.firebaseio.com",
    projectId: "shmeet-5fdea",
    storageBucket: "shmeet-5fdea.appspot.com",
    messagingSenderId: "770694324116",
    appId: "1:770694324116:web:fdf15354fab2b1a1e23981",
    measurementId: "G-G1PC9N26LR"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const lobbyDB = firebase.database().ref("lobbys").child('TicTacToe');

const INIT_GRID = [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
];


lobbyDB.on('value', (snapshot) => {
    console.log('====RECEIVED DATA====');
    console.log(snapshot.val())
    checkIfCanMatchPlayer()
});

checkIfCanMatchPlayer = async () => {
    lobbyDB.once('value')
        .then(async snapshot => {
            if (snapshot.val() != null && Object.keys(snapshot.val()).length > 1) {
                let player1 = await getRandomOnlinePlayer();
                console.log("found player 1 : " + player1)
                let player2 = await getRandomOnlinePlayer(player1, true);
                console.log("found player 2 : " + player2)
                removeUsersFromLobby(player1, player2)
                createRoom(player1, player2)
            }
        })
}

removeUsersFromLobby = (user1, user2) => {
    lobbyDB.child(user1)
        .remove();
    lobbyDB.child(user2)
        .remove()
}

getRandomOnlinePlayer = (currentuid, differentFromMe = false) => {
    function randomKey(obj) {
        var keys = Object.keys(obj);
        return keys[(keys.length * Math.random()) << 0];
    }

    return lobbyDB.once('value')
        .then(snapshot => {
            let randomUid = randomKey(snapshot.val());
            while (differentFromMe && randomUid === currentuid)
                randomUid = randomKey(snapshot.val());
            return randomUid;
        })
}

createRoom = async (player1, player2) => {
    // let randomOtherPlayer = await this.getRandomOnlinePlayer()
    let score = {};
    score[player1] = 0;
    score[player2] = 0;

    const newGame = {
        p1_token: player1,
        p2_token: player2,
        grid: INIT_GRID,
        turn: 0,
        gameResult: { done: false, winner: "" },
        score: score
    };
    const gameDB = firebase.database().ref("games");

    this.partyDB = gameDB.child(newGame.p1_token + newGame.p2_token);
    this.partyDB.set(newGame).then(() => {
        console.log("GAME_CREATED");
        console.log(newGame);
        console.log('=============')
    }).catch((err) => {
        throw err;
    });
}



module.exports = {
}