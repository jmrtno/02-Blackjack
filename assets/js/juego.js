const myModule = (() => {
    'use strict';


    let deck       = [];
    const tipes    = ['C', 'D', 'H', 'S'],
          specials = ['A', 'J', 'Q', 'K']
    
    let playersPoints = [];
        
    
    //REFERENCES HTML
    const btnTake = document.querySelector('#btnTake'),
          btnNew  = document.querySelector('#btnNew'),
          btnStop = document.querySelector('#btnStop');
    
    const divPlayersCards = document.querySelectorAll('.divCards'),
          pointsHTML      = document.querySelectorAll('small');

    // This function starts game
    const startGame = (numPlayers = 2) => {
        deck = madeDeck();

        playersPoints = [];
        for(let i = 0; i<numPlayers; i++) {
            playersPoints.push(0);
        }
        
        pointsHTML.forEach(elem => elem.innerText = 0);
        divPlayersCards.forEach(elem => elem.innerHTML = '');
    
        btnTake.disabled=false;
        btnStop.disabled=false;

    }
    
    // CREATE DECK
    const madeDeck = () => {
    // CREATE TIPES CARDS ON DECK
        deck = [];
        for(let i=2; i<=10; i++) {
            for(let tipe of tipes) {
                deck.push(i + tipe);
            }
        }
    // CREATE SPECIAL CARDS ON DECK
        for(let tipe of tipes) {
            for (let sp of specials) {
                deck.push(sp + tipe)
            }
        }
        // RANDOM CARDS ON DECK
        return _.shuffle(deck);
    }
    
    
    // TAKE CARD
    const takeCard = () => {
    
        if (deck.length === 0) {
            throw 'No more cards on deck';
        }
        return deck.pop();
    }
    
    const cardValue = (card) =>{
    
        // let points = 0;
        // 2 = 2, 10 = 10...
        // if(isNaN(value)){ //Nos dice si el valor introducido es o no un número
        //     points = (value === 'A') ? 11 : 10;
        // } else {
        //     points = value * 1; // * 1 Para convertir string a entero
        // }
    
        //LAST FUNCTION SHORT:
        const value = card.substring(0, card.length-1); // Delete card tipe. Only take number or special (2 to K)
        return ( isNaN(value) ) ?
              ( value === 'A' ) ? 11 : 10
              : value * 1;
    }
    // Turn: 0 = first player. Last player is computer
    const getPoints = (card, turn) => {

        playersPoints[turn] = playersPoints[turn] + cardValue(card);
        pointsHTML[turn].innerText = playersPoints[turn] //[0] estamos indicando que nos referimos al primer small del HTML
        return playersPoints[turn];
    }

    const createCard = (card, turn) => {

        const imgCards = document.createElement('img');
        imgCards.src = `assets/cartas/${card}.png`; // 3H, 2C, AC...
        imgCards.classList.add('cards');
        divPlayersCards[turn].append(imgCards);
    }

    const setWinner = () => {

        const[minimumPoints, computerPoints] = playersPoints;

        setTimeout(() => {
            if(computerPoints === minimumPoints){
                alert('Empate');
            } else if(minimumPoints > 21){
                alert('You loose');
            } else if (computerPoints > 21){
                alert('You wins')
            } else  {
                alert('You loose');
            }
        }, 100);

    }

    // Computer turn
    const computerTurn = (minimumPoints) => {
        
        let computerPoints = 0;

        do {
            const card = takeCard();
            
            computerPoints = getPoints(card, playersPoints.length -1);
            createCard(card, playersPoints.length -1);
    
        } while((computerPoints < minimumPoints) && (minimumPoints <=21));
    
        setWinner();
    }
    
    
    //EVENTS
    btnTake.addEventListener('click', () => { //callback: funcion que se manda como argumento
        
        const card = takeCard();
        const playerPoints = getPoints(card, 0);
        
        createCard(card, 0);
        
    
        if (playerPoints > 21) {
            console.error('Sorry you loose');
            btnTake.disabled = true;
            btnStop.disabled=true;
            computerTurn(playerPoints);
            
        } else if (playerPoints === 21) {
            console.warn('21, great!');
            btnTake.disabled = true;
            btnStop.disabled=true;
            computerTurn(playerPoints);
    
        }
    
    }); 
    
    btnStop.addEventListener('click', () =>{
        btnTake.disabled=true;
        btnStop.disabled=true;
        
        computerTurn(playersPoints[0]);
    });
    
    btnNew.addEventListener('click', () => {

        startGame();

    });

    // Evitamos pulsar el botón 'New Game' para comenzar
    return {
        newGame: startGame
    };
    

})();