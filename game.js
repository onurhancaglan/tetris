function injectJQuery(game) {
    // Load the script
    var script = document.createElement("SCRIPT");

    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function () {
        playGame();
    };

    document.getElementsByTagName("head")[0].appendChild(script);
}

var playGame = function () {
    var CONSTS = {
        // Her bir oyun karesinin kenar uzunluğu ve çerçeve kalınlığı.
        squareSize: 29,
        borderSize: 1,
        // Arenanın her bir kenarının oyun küpleri cinsinden uzunluğu ve genişliği.
        width: 20,
        height: 25,
        // Oyun renkleri
        colors: {
            gridLine: 'darkgray',
            I: 'red',
            L: 'blue',
            J: 'yellow',
            O: 'orange',
            S: 'purple',
            T: 'green',
            Z: 'darkblue'
        }
    }

    function Square(type, x, y) {
        this._class = 'square' + ' ' + type;
        this.style = {
            border: CONSTS.borderSize / 2 + 'px solid',
            borderColor: CONSTS.colors[type],
            height: CONSTS.squareSize,
            width: CONSTS.squareSize,
            float: 'left'
        };

        this._x = x || 0;
        this._y = y || 0;
    }

    function draw(type, _class, css, appendTo, x, y) {
        x = x || 0;
        y = y || 0;

        $('<' + type + '/>', {
            class: _class
        }).css(css).appendTo(appendTo).attr('x', x).attr('y', y);
    }

    function createGameArea() {
        var block = CONSTS.squareSize + CONSTS.borderSize;

        draw('div', 'game-area', {
            background: 'black',
            position: 'fixed',
            top: '5%',
            left: '25%',
            zIndex: '999',
            width: block * CONSTS.width,
            height: block * CONSTS.height
        }, 'body');

        var x = 0;
        var y = 0;

        for (var y = 1; y <= CONSTS.width; y++) {
            for (var x = 1; x <= CONSTS.height; x++) {
                var gridSquare = new Square('gridLine', x, y);

                draw('span', gridSquare._class, gridSquare.style, '.game-area', gridSquare._x, gridSquare._y);
            }
        }
    }

    function getSquareGivenCoordinate(x, y) {
        return $('.square.gridline[x="' + x + '"][y="' + y + '"]');
    }

    function createGameObject(type) {
        if (type === 'I') {
            getSquareGivenCoordinate().css({
                backgroundColor: colors[type]
            });


        }
    }

    createGameArea();
}

injectJQuery(playGame);

/**    function makeGridLine() {
        for (var y = 0; y < width; y++) {

            for (x = 0; x < height; x++) {
                draw('span', 'tetris-arena', )
            }
        }
    } */