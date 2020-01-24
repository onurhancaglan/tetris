    "use strict"

    // Load the script
    var script = document.createElement("SCRIPT");

    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function () {
        tetrisGame.createGameArea();
        tetrisGame.gameObjects.drawToStartPoint('Z');

        setInterval(function () {
            var activeGameObject = $('.square[active="true"]');
            var gridLineObjects = $('.square[gameobject="gridLine"]');
            var gameObject_type = activeGameObject.attr('gameObject');

            activeGameObject.css({
                backgroundColor: tetrisGame.gameObjects[gameObject_type || 'gridLine'].color
            });

            gridLineObjects.css({
                backgroundColor: CONSTS.gameBackgroundColor
            });

            tetrisGame.gameObjects.moveTo(activeGameObject, gameObject_type);
        }, CONSTS.gameSpeed);
    };

    document.getElementsByTagName("head")[0].appendChild(script);

    var CONSTS = {
        // Her bir oyun karesinin kenar uzunluğu ve çerçeve kalınlığı.
        squareSize: 29,
        borderSize: 1,
        // Arenanın her bir kenarının oyun küpleri cinsinden uzunluğu ve genişliği.
        width: 15,
        height: 25,
        // Oyun hızı
        gameSpeed: 750,
        // Oyun renkleri
        gameBackgroundColor: 'black',
    }

    var tetrisGame = {
        Square: function (type, x, y) {
            this._class = 'square' + ' ' + type;
            this.type = type;
            this.style = {
                border: CONSTS.borderSize / 2 + 'px solid',
                borderColor: tetrisGame.gameObjects[type].color,
                height: CONSTS.squareSize,
                width: CONSTS.squareSize,
                float: 'left'
            };

            this._x = x || 0;
            this._y = y || 0;
        },
        gameObjects: {
            gridLine: {
                color: 'darkgray'
            },
            Z: {
                color: 'darkblue',
                startPosition: [{
                    x: 7,
                    y: 1
                }, {
                    x: 8,
                    y: 1
                }, {
                    x: 8,
                    y: 2
                }, {
                    x: 9,
                    y: 2
                }]
            },
            T: {
                color: 'green',
                startPosition: [{
                    x: 8,
                    y: 1
                }, {
                    x: 7,
                    y: 2
                }, {
                    x: 8,
                    y: 2
                }, {
                    x: 9,
                    y: 2
                }]
            },
            S: {
                color: 'purple',
                startPosition: [{
                    x: 8,
                    y: 1
                }, {
                    x: 9,
                    y: 1
                }, {
                    x: 7,
                    y: 2
                }, {
                    x: 8,
                    y: 2
                }]
            },
            O: {
                color: 'orange',
                startPosition: [{
                    x: 8,
                    y: 1
                }, {
                    x: 9,
                    y: 1
                }, {
                    x: 8,
                    y: 2
                }, {
                    x: 9,
                    y: 2
                }]
            },
            J: {
                color: 'yellow',
                startPosition: [{
                    x: 9,
                    y: 1
                }, {
                    x: 9,
                    y: 2
                }, {
                    x: 9,
                    y: 3
                }, {
                    x: 8,
                    y: 3
                }]
            },
            I: {
                color: 'red',
                startPosition: [{
                    x: 9,
                    y: 1
                }, {
                    x: 9,
                    y: 2
                }, {
                    x: 9,
                    y: 3
                }, {
                    x: 9,
                    y: 4
                }]
            },
            L: {
                color: 'blue',
                startPosition: [{
                    x: 9,
                    y: 1
                }, {
                    x: 9,
                    y: 2
                }, {
                    x: 9,
                    y: 3
                }, {
                    x: 10,
                    y: 3
                }]
            },
            drawToStartPoint: function (type) {
                var objectToDraw = this[type];

                objectToDraw.startPosition.forEach(function (position) {
                    var squareToFill = tetrisGame.getSquareGivenCoordinate(position.x, position.y);

                    squareToFill.attr('filled', true);
                    squareToFill.attr('gameObject', type);
                    squareToFill.attr('active', true);

                    squareToFill.css({
                        backgroundColor: objectToDraw.color
                    });
                });
            },
            moveTo: function (activeGameObject, gameObject_type) {
                var squaresPositions = [];
                var defaultObjectName = 'gridLine';
                var defaultObject = this[defaultObjectName];
                var gameObject = this[gameObject_type] || defaultObject;


                /** Oyun objesinin bir önceki pozisyonunu array içerisine aldıktan sonra oyun alanını,
                 * tekrar çizdirmek üzere temizliyorum */
                for (var square = 0; square < 4; square++) {
                    var position = {
                        x: parseInt($(activeGameObject[square]).attr('x')) || 0,
                        y: parseInt($(activeGameObject[square]).attr('y')) || 0
                    }

                    squaresPositions.push(position);

                    var filledSquare = $(activeGameObject[square]);

                    filledSquare.attr('active', false);
                    filledSquare.attr('filled', false);
                    filledSquare.attr('gameobject', defaultObjectName);

                    filledSquare.css({
                        backgroundColor: CONSTS.gameBackgroundColor,
                        borderColor: defaultObject.color
                    });
                }

                // Aktif olan oyun objesini bir önceki pozisyonu baz alarak bir adım ilerletiyorum.
                for (var coordinate = 0; coordinate < squaresPositions.length; coordinate++) {
                    var position = squaresPositions[coordinate];
                    var x = 0;
                    var y = 0;

                    x = position.x;
                    y = position.y + 1;

                    var emptySquare = $('[x="' + x + '"][y="' + y + '"]');

                    emptySquare.attr('active', true);
                    emptySquare.attr('filled', true);
                    emptySquare.attr('gameobject', gameObject_type);

                    emptySquare.css({
                        backgroundColor: gameObject.color
                    });
                }
            }
        },
        detectCollision: function () {

        },
        draw: function (type, _class, css, appendTo, x, y, gameObject) {
            x = x || 0;
            y = y || 0;

            if (_class !== '' && appendTo !== '' && type !== '') {
                $('<' + type + '/>', {
                        class: _class
                    }).css(css)
                    .appendTo(appendTo)
                    .attr('x', x)
                    .attr('y', y)
                    .attr('gameObject', gameObject);
            }
        },
        createGameArea: function () {
            var block = CONSTS.squareSize + CONSTS.borderSize;

            this.draw('div', 'game-area', {
                background: CONSTS.gameBackgroundColor,
                position: 'fixed',
                top: '5%',
                left: '25%',
                zIndex: '999',
                width: block * CONSTS.width,
                height: block * CONSTS.height
            }, 'body');

            for (var y = 1; y <= CONSTS.height; y++) {
                for (var x = 1; x <= CONSTS.width; x++) {
                    var gridSquare = new this.Square('gridLine', x, y);

                    this.draw('span', gridSquare._class, gridSquare.style, '.game-area', gridSquare._x, gridSquare._y,
                        gridSquare.type);
                }
            }
        },
        getSquareGivenCoordinate: function (x, y) {
            return $('.square.gridline[x="' + x + '"][y="' + y + '"]');
        },
    }