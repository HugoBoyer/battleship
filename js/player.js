/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = {dom: {parentNode: {removeChild: function () {
        
    }}}};

    
    var noNewTarget = [];
    
    var colorship;
    
    

    var player = {
        pos: [],
        grid: [],
        tries: [],
        fleet: [],
        kills: 0,
        ship1: 0,
        ship2: 0,
        ship3: 0,
        ship4: 0,
        game: null,
        activeShip: 0,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;
            }, this));
        },
        removeShip: function (){
            console.log("bat1="+this.ship1)
            console.log("bat2="+this.ship2)
            console.log("bat3="+this.ship3)
            console.log("bat4="+this.ship4)
            if (player.ship1 >= 5){
                let remove = document.querySelector('.battleship')
                remove.classList.add('sunk')
            }
            if (player.ship2 >= 5){
                let remove = document.querySelector('.destroyer')
                remove.classList.add('sunk')
            }
            if (player.ship3 >= 4){
                let remove = document.querySelector('.submarine')
                remove.classList.add('sunk')
            }
            if (player.ship4 >= 3){
                let remove = document.querySelector('.small-ship')
                remove.classList.add('sunk')
            }
            else 
                return;
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;


            if (this.grid[line][col] !== 0) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            callback.call(undefined, succeed);
        },


        setActiveShipPosition: function (x, y) {

            var ship = this.fleet[this.activeShip];
            console.log(ship.getPos());

            
            // console.log(x);
            // console.log(y);
            var i = 0;
            if(ship.getPos() === "horizontal"){
                if (ship.name == "Battleship"){
                    if (x < Math.floor(ship.getLife() / 2) || x > 7){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_x = x-2; temp_x <= x+2; temp_x++){
                                if (this.pos[i][0] == temp_x && this.pos[i][1] == y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 1]);
                        this.pos.push([x -1, y, 1]);
                        this.pos.push([x -2, y, 1]);
                        this.pos.push([x +1, y, 1]);
                        this.pos.push([x +2, y, 1]);
                    }
                }

                else if (ship.name == "Destroyer"){
                    if (x < Math.floor(ship.getLife() / 2) || x > 7){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_x = x-2; temp_x <= x+2; temp_x++){
                                if (this.pos[i][0] == temp_x && this.pos[i][1] == y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 2]);
                        this.pos.push([x -1, y, 2]);
                        this.pos.push([x -2, y, 2]);
                        this.pos.push([x +1, y, 2]);
                        this.pos.push([x +2, y, 2]);
                    }
                }

                else if (ship.getLife() == 4){
                    if (x < Math.floor(ship.getLife() / 2) || x > 8){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_x = x-2; temp_x <= x+1; temp_x++){
                                if (this.pos[i][0] == temp_x && this.pos[i][1] == y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 3]);
                        this.pos.push([x -1, y, 3]);
                        this.pos.push([x -2, y, 3]);
                        this.pos.push([x +1, y, 3]);
                    }
                }

                else if (ship.getLife() == 3){
                    if (x < (Math.floor(ship.getLife() / 2)) || x > 8){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_x = x-1; temp_x <= x+1; temp_x++){
                                if (this.pos[i][0] == temp_x && this.pos[i][1] == y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 4]);
                        this.pos.push([x -1, y, 4]);
                        this.pos.push([x +1, y, 4]);
                    }
                }
            }
            else if (ship.getPos() === "vertical"){
                
                if (ship.name == "Battleship"){
                    if (y < Math.floor(ship.getLife() / 2) || y > 7){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_y = y-2; temp_y <= y+2; temp_y++){
                                if (this.pos[i][0] == x && this.pos[i][1] == temp_y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 1]);
                        this.pos.push([x, y -1, 1]);
                        this.pos.push([x, y -2, 1]);
                        this.pos.push([x, y +1, 1]);
                        this.pos.push([x, y +2, 1]);
                    }
                }
                else if (ship.name == "Destroyer"){
                    if (y < Math.floor(ship.getLife() / 2) || y > 7){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_y = y-2; temp_y <= y+2; temp_y++){
                                if (this.pos[i][0] == x && this.pos[i][1] == temp_y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 2]);
                        this.pos.push([x, y -1, 2]);
                        this.pos.push([x, y -2, 2]);
                        this.pos.push([x, y +1, 2]);
                        this.pos.push([x, y +2, 2]);
                    }
                }

                else if (ship.getLife() == 4){
                    if (y < Math.floor(ship.getLife() / 2) || y > 8){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_y = y-1; temp_y <= y+2; temp_y++){
                                if (this.pos[i][0] == x && this.pos[i][1] == temp_y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 3]);
                        this.pos.push([x, y -1, 3]);
                        this.pos.push([x, y +2, 3]);
                        this.pos.push([x, y +1, 3]);
                    }
                }

                else if (ship.getLife() == 3){
                    if (y < (Math.floor(ship.getLife() / 2)) || y > 8){
                        return false;
                    }
                    else {
                        for ( i ; i < this.pos.length; i++){
                            for (let temp_y = y-1; temp_y <= y+1; temp_y++){
                                if (this.pos[i][0] == x && this.pos[i][1] == temp_y){
                                    return false;
                                }
                            }
                        }
                        this.pos.push([x, y, 4]);
                        this.pos.push([x, y -1, 4]);
                        this.pos.push([x, y +1, 4]);
                    }
                }
            }


            while (i < ship.getLife()) {
                this.grid[y][x + i] = ship.getId();
                i += 1;
            }
            return true;
        },

        setGame(){
            this.game = true;
        },

        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function () {
            pos = [];
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {

            this.tries.forEach(function (row, rid) {
                row.forEach(function (hasSucceed, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                    if (hasSucceed === true) {
                        node.style.backgroundColor = '#e60019';
                        node.classList.add('explosionReussis');
                    } else if (hasSucceed === false) {
                        node.style.backgroundColor = '#aeaeae';
                        node.classList.add('explosionRater');
                    }
                });
            });
        },
        renderShips: function (grid) {
        }
    };

    global.player = player;

}(this));