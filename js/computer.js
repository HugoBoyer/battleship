/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        posai: [],
        grid: [],
        tries: [],
        fleet: [],
        kills: 0,
        game: null,
        play: function () {
            var self = this;
            setTimeout(function shot() {
                var x = Math.floor(Math.random() * (9 - 0 + 1) + 0);
                var y = Math.floor(Math.random() * (9 - 0 + 1) + 0);
                for (let i = 0; i < self.tries.length; i++){
                    if (self.tries[i][0] == x && self.tries[i][1] == y){
                        self.play();
                        return;
                    }
                }
                self.tries.push([x, y])
                game.fire(this, x, y, function () {
                    self.tries[x][y];
                });
            }, 2000);
        },
        isShipOk: function (callback) {
            var j;
            var i = Math.floor(Math.random() * (9 - 0 + 1) + 0);
            var arrcol = [];

            this.fleet.forEach(function (ship) {
                j = Math.floor(Math.random() * (5 - 0 + 1) + 0);
                var k = j;
                console.log("---------");
                console.log("vie du bateau : " + ship.life)
                while (j < ship.life + k) {
                    this.grid[j][i] = ship.getId();
                    console.log("line:" + i)
                    console.log("col:" + j)
                    j += 1;
                }
                arrcol.push(i);
                while (arrcol.includes(i)){
                    i = Math.floor(Math.random() * (9 - 0 + 1) + 0);
                }
            }, this);

            setTimeout(function () {
                callback();
            }, 500);
        }
    });

    global.computer = computer;

}(this));