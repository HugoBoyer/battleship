/*jslint browser this */
/*global _, player, computer, utils */

(function (global) {
    "use strict";

    var change = true;
    var lock = 0;

    var noNewTarget = [];

    

    var game = {
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        killai: [],
        killplayer: [],

        // liste des joueurs
        players: [],

        // lancement du jeu
        init: function () {
            // initialisation
            this.grid = document.querySelector('.board .main-grid');
            this.miniGrid = document.querySelector('.board .mini-grid');

            // défini l'ordre des phase de jeu
            this.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_GAME_OVER
            ];
            this.playerTurnPhaseIndex = 0;

            // initialise les joueurs
            this.setupPlayers();

            // ajoute les écouteur d'événement sur la grille
            this.addListeners();

            // c'est parti !
            this.goNextPhase();
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this);
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;

            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[0];
            }

            switch (this.currentPhase) {
            case this.PHASE_GAME_OVER:
                // detection de la fin de partie
                if (!this.gameIsOver()) {
                    console.log("score Joueur :"+player.kills)
                    console.log("score IA :"+computer.kills)
                    // le jeu n'est pas terminé on recommence un tour de jeu
                    this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex];
                    this.currentPhase = this.phaseOrder[2];
                    break;
                }
                else {
                    alert(this.gameIsOver());
                }
            case this.PHASE_INIT_PLAYER:
                utils.info("Placez vos bateaux");
                break;
            case this.PHASE_INIT_OPPONENT:
                this.wait();
                utils.info("En attente de votre adversaire");
                this.players[1].isShipOk(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                });
                break;
            case this.PHASE_PLAY_PLAYER:
                utils.info("A vous de jouer, choisissez une case !");
                break;
            case this.PHASE_PLAY_OPPONENT:
                utils.info("A votre adversaire de jouer...");
                this.players[1].play();
                break;
            }

        },
        gameIsOver: function () {
            if (computer.kills >= 17){
                return "L'IA a gagné la bataille";
            }
            else if (player.kills >= 17){
                return "Le joueur a gagné la bataille";
            }
            return false;
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
            this.grid.addEventListener('click', _.bind(this.handleClick, this));
            this.grid.addEventListener('contextmenu', _.bind(this.changePos, this));
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateau
            if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
                var ship = this.players[0].fleet[this.players[0].activeShip];

                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(ship.dom);
                    // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }
                if(((ship.life)%2) === 0 && change == false) {
                    ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + (this.players[0].activeShip) * 60 - 30 ) + "px";
                    ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + 30 + "px";
                }
                else {
                    ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + (this.players[0].activeShip) * 60) + "px";
                    ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                }
            }
        },

        changePos: function (e){

            var ship = this.players[0].fleet[this.players[0].activeShip];
            e.preventDefault();
            if (lock == 4){
                return;
            }
            if (change == true){
                change = false;
                ship.setPos("vertical");
                ship.dom.style.transform = "rotate(90deg)";
            }
            else if (change == false){
                change = true;
                ship.setPos("horizontal");
                ship.dom.style.transform = "rotate(180deg)";
            }
            if(((ship.life)%2) === 0 && change == false) {
                ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + (this.players[0].activeShip) * 60 - 30 ) + "px";
                ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + 30 + "px";
            }
            else {
                ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + (this.players[0].activeShip) * 60) + "px";
                ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
            }
        },
        
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;
            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains('cell')) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                        lock++;
                        // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
                        self.renderMiniMap();
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?", function () {
                                // si le placement est confirmé
                                console.table(player.pos)
                                self.stopWaiting();
                                self.players[0].clearPreview();
                                self.goNextPhase();
                            }, function () {
                                self.stopWaiting();
                                // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                self.players[0].resetShipPlacement();
                            });
                        }
                    }
                // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    document.getElementById('help').style.display = "none";
                    this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                }
            }
        },
        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réussite ou non du tir
        fire: function (from, col, line, callback) {
            this.wait();
            var self = this;
            var msg = "";

            // determine qui est l'attaquant et qui est attaqué
            var target = this.players.indexOf(from) === 0
                ? this.players[1]
                : this.players[0];

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                document.getElementById('help').style.display = "none";
                msg += "Votre adversaire vous a... ";
            }

            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en pa ramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(col, line, function (hasSucceed) {
                let block = true;
                if (self.currentPhase === self.PHASE_PLAY_PLAYER) {
                    for ( let i = 0; i < noNewTarget.length; i++){
                        if (noNewTarget[i][0] == col && noNewTarget[i][1] == line){
                            block = false;
                            msg += "Vous avez déjà tiré ici voyons qui fait ça ?";
                        }
                    }
                }
                if (self.currentPhase === self.PHASE_PLAY_OPPONENT) {
                    document.getElementById('help').style.display = "block";
                    for ( let i = 0; i <player.pos.length; i++){
                        if (player.pos[i][0] == col && player.pos[i][1] == line){
                            hasSucceed = true;
                        }
                    }
                    if (hasSucceed) {
                        console.log("col="+col)
                        console.log("line="+line)
                        msg += "Touché !";
                        setTimeout(function (){
                            var songSucces = new Audio("audio/succes.wav");
                            songSucces.play();
                        }, 1500)
                        var songSucces = new Audio("audio/shot.mp3");
                        songSucces.play();
                        self.renderMini(col, line);
                        computer.kills++;
                    } 
                    else {
                        msg += "Manqué...";
                        console.log("colraté="+col)
                        console.log("lineraté="+line)
                        setTimeout(function (){
                            var songSucces = new Audio("audio/fail.wav");
                            songSucces.play();
                        }, 1500)
                        var songFail = new Audio("audio/shot.mp3");
                        songFail.play();
                    }
                }
                else {
                    if (block){
                        if (hasSucceed) {
                            msg += "Touché !";
                            setTimeout(function (){
                                var songSucces = new Audio("audio/succes.wav");
                                songSucces.play();
                            }, 1500)
                            var songSucces = new Audio("audio/shot.mp3");
                                songSucces.play();
                            if (self.currentPhase === self.PHASE_PLAY_PLAYER) {
                                noNewTarget.push([col, line])
                            }
                            player.kills++;
        
                        } else {
                            msg += "Manqué...";
                            setTimeout(function (){
                                var songSucces = new Audio("audio/fail.wav");
                                songSucces.play();
                            }, 1500)
                            var songSucces = new Audio("audio/shot.mp3");
                                songSucces.play();
                            if (self.currentPhase === self.PHASE_PLAY_PLAYER) {
                                noNewTarget.push([col, line])
                                console.table(noNewTarget)
                            }
                        }
                    }
                }

                utils.info(msg);

                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
                callback(hasSucceed);
                if (self.currentPhase === self.PHASE_PLAY_PLAYER)
                    self.renderMap();

                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 1000);
            });

        },
        renderMap: function () {
            this.players[0].renderTries(this.grid);
        },
        renderMini: function (col, line) {
            var miniGrid = document.getElementsByClassName('mini-grid').item(0);
            var node = miniGrid.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');
            node.style.backgroundColor = 'orange';


            for (let i = 0; i < player.pos.length ; i++){
                if (player.pos[i][0] == col && player.pos[i][1] == line){
                    if (player.pos[i][2] == 1){
                        player.ship1++;
                    }
                    else if (player.pos[i][2] == 2){
                        player.ship2++;
                    }
                    else if (player.pos[i][2] == 3){
                        player.ship3++;
                    }
                    else if (player.pos[i][2] == 4){
                        player.ship4++;
                    }
                }
            }
            player.removeShip();
        },
        renderMiniMap: function () {
            var gridmini = document.getElementsByClassName('mini-grid').item(0);
            gridmini.innerHTML = document.getElementsByClassName('main-grid').item(0).innerHTML;
            gridmini.style.marginTop == "-208px";
        }
    };

    // point d'entrée
    var gobutton = document.getElementById('button');

    var gojoueur = document.getElementById('joueur');
    var goordinateur = document.getElementById('ordinateur');
    var goaleatoire = document.getElementById('aleatoire');
    var help = document.getElementById('help')

    help.addEventListener('click', function () {
        for (let i = 0 ; i < noNewTarget.length ; i++){
            var x = Math.floor(Math.random() * (9 - 0 + 1) + 0);
            var y = Math.floor(Math.random() * (9 - 0 + 1) + 0);
            if (noNewTarget[i][0] !== x && noNewTarget[i][1] !== y){
                var miniGrid = document.getElementsByClassName('main-grid').item(0);
                var node = miniGrid.querySelector('.row:nth-child(' + (x + 1) + ') .cell:nth-child(' + (y + 1) + ')');
                node.style.backgroundColor = 'yellow';
                setTimeout(function () {
                    node.style.backgroundColor = 'white';
                }, 3000);
                return;
            }
        }
    });

    gojoueur.addEventListener('click', function () {
        game.init();
        gobutton.style.display = "none";
    });
    goordinateur.addEventListener('click', function () {
        game.init();
        game.phaseOrder = [
            this.PHASE_INIT_PLAYER,
            this.PHASE_INIT_OPPONENT,
            this.PHASE_PLAY_OPPONENT,
            this.PHASE_PLAY_PLAYER,
            this.PHASE_GAME_OVER
        ];
        gobutton.style.display = "none";
    });
    goaleatoire.addEventListener('click', function () {
        game.init();
        var x = Math.floor(Math.random() * (9 - 0 + 1) + 0);
        if (x%2==0){
            game.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_GAME_OVER
            ];
        }
        else {
            game.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_GAME_OVER
            ];
        }
        gobutton.style.display = "none";
    });

    global.game = game;

}(this));