    "use strict"

    // Load the script
    var script = document.createElement("SCRIPT");

    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function () {
        CONSTS.activeGameObject = $('.square[active="true"]');
        CONSTS.activeGameObject_type = CONSTS.activeGameObject.attr('gameObject');
        CONSTS.gameState = true;

        tetrisGame.events.setEvents();
        tetrisGame.createGameArea();
        tetrisGame.gameObjects.drawToStartPoint(tetrisGame.gameObjects.getRandomObject());

        window.tetrisLoop = setInterval(function () {
            if (CONSTS.gameState) {
                var gridLineObjects = $('.square[gameobject="gridLine"]');

                // Sürekli olarak aktif olan objenin kordinatlarını ve elementlerini sabit bir değerde tutuyorum
                CONSTS.activeGameObject = $('.square[active="true"]');
                CONSTS.activeGameObject_type = CONSTS.activeGameObject.attr('gameObject');

                CONSTS.activeGameObject.css({
                    backgroundColor: tetrisGame.gameObjects[CONSTS.activeGameObject_type || 'gridLine'].color
                });

                gridLineObjects.css({
                    backgroundColor: CONSTS.gameBackgroundColor
                });

                if (!tetrisGame.gameObjects.detectCollision()) {
                    // Herhangi bir engele takılmadıysa obje hareket etmeye devam ediyor.
                    tetrisGame.gameObjects.oneStepForward();
                } else {
                    if (tetrisGame.isOver(CONSTS.activeGameObject_type)) {
                        // eğer yeni obje için yer yoksa oyunu bitir.
                        console.log('GAME IS OVER')
                    } else {
                        // Rastgele bir obje yaratıp oyunu devam ettiriyorum
                        tetrisGame.gameObjects.drawToStartPoint(tetrisGame.gameObjects.getRandomObject());
                    }
                }

            }
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
        gameSpeed: 100,
        // Oyun renkleri
        gameBackgroundColor: 'black',
        // Oyuncu kaybedene kadar true döner.
        gameState: false,
        // Aktif olarak hareket eden objenin kareleri
        activeGameObject: null,
        // Aktif olarak hareket eden objenin tipi
        activeGameObject_type: null,
        activeObjectCoordiantes: []
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
            getRandomObject: function () {
                // Rastgele oyun objesi
                var randomValue = Math.floor(Math.random() * 7) + 1;

                switch (randomValue) {
                    case 1:
                        return 'Z';
                    case 2:
                        return 'T';
                    case 3:
                        return 'S';
                    case 4:
                        return 'O';
                    case 5:
                        return 'J';
                    case 6:
                        return 'I';
                    case 7:
                        return 'L';
                    default:
                        return 'gridLine';
                };
            },
            drawToStartPoint: function (type) {
                // Oyunun ortasından, tipi verilen objeyi yaratarak, objeyi oyuna sokuyorum
                var objectToDraw = this[type];

                ((objectToDraw || {}).startPosition || []).map(function (position) {
                    var squareToFill = tetrisGame.getSquareGivenCoordinate(position.x, position.y);

                    squareToFill.addClass('filled');
                    squareToFill.attr('gameObject', type);
                    squareToFill.attr('active', true);

                    squareToFill.css({
                        backgroundColor: objectToDraw.color
                    });
                });

                CONSTS.activeObjectCoordiantes = (objectToDraw || {}).startPosition || [];
                CONSTS.activeGameObject = $('.square[active="true"]');
            },
            oneStepForward: function (direction) {
                // Aktif olan oyun objesini bir önceki pozisyonu baz alarak bir adım ilerletiyorum.
                this.clearBeforePosition();
                var newCoordinates = [];

                for (var coordinate = 0; coordinate < 4; coordinate++) {
                    var position = CONSTS.activeObjectCoordiantes[coordinate];

                    switch (direction) {
                        case 'left':
                            position.x = position.x - 1;
                            break;
                        case 'right':
                            position.x = position.x + 1;
                            break;
                        default:
                            position.y = position.y + 1;
                            break;
                    }

                    newCoordinates.push({
                        x: position.x,
                        y: position.y
                    });

                    // Oyundan yeni kordinatlardaki kareleri alıp aktif hale geçirerek oyun objesine çeviriyorum.
                    var emptySquare = tetrisGame.getSquareGivenCoordinate(position.x, position.y);

                    emptySquare.attr('active', true);
                    emptySquare.addClass('filled');
                    emptySquare.attr('gameobject', CONSTS.activeGameObject_type);

                    emptySquare.css({
                        backgroundColor: (this[CONSTS.activeGameObject_type] || {}).color || 'gridLine'
                    });
                }

                CONSTS.activeGameObject = $('.square[active="true"]');
                CONSTS.activeObjectCoordiantes = newCoordinates;
            },
            clearBeforePosition: function () {
                // Şu aktif olan objeyi oyun alanından temizliyorum.
                for (var square = 0; square < 4; square++) {
                    var defaultObjectName = 'gridLine';
                    var defaultObject = this[defaultObjectName];
                    var activeObject = $(CONSTS.activeGameObject[square]);

                    activeObject.attr('active', false);
                    activeObject.removeClass('filled');
                    activeObject.attr('gameobject', defaultObjectName);

                    activeObject.css({
                        backgroundColor: CONSTS.gameBackgroundColor,
                        borderColor: defaultObject.color
                    });
                }
            },
            detectCollision: function () {
                var bottomCollided = false;

                $(CONSTS.activeGameObject).map(function (key) {
                    var activeSquare = CONSTS.activeObjectCoordiantes[key] || {};
                    /** Aktif olan oyun objesinin etrafındaki karelerin, objeinin hala hareket etmesine izin verip
                      vermeyeceğini kontrol ediyorum.*/
                    var _nearSquare = $('[y="' + (activeSquare.y + 1) + '"][x="' + activeSquare.x +
                        '"]:not([active="true"])');

                    if (!bottomCollided && (_nearSquare.length > 0 || activeSquare.y + 1 === CONSTS.height)) {
                        // Altındaki kare dolu mu ya da son kare mi diye bakıyorum.
                        bottomCollided = _nearSquare.hasClass('filled') ||
                            (parseInt(_nearSquare.attr('y')) || 0) === 0;
                    }

                    if (bottomCollided) {
                        // Eğer hareket edemeyecekse, aktif durumdan çıkarıyorum.
                        $(CONSTS.activeGameObject).attr('active', false);
                        // Kordinatları temizliyorum.
                        CONSTS.activeGameObject = [];
                        // Diğer karelere bakmadan döngüden çıkarıyorum.
                        return bottomCollided;
                    }
                });

                return bottomCollided;
            }
        },
        draw: function (type, _class, css, appendTo, x, y, gameObject) {
            // element çizdirme
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
        isOver: function (nextObjectType) {
            nextObjectType = nextObjectType || 'gridLine';

            var objectToDraw = this.gameObjects[nextObjectType];
            var isOver = false;

            // Eğer başlangıç noktasında yeni obje için yer yoksa, oyunu bitiriyorum.
            ((objectToDraw || {}).startPosition || []).map(function (position) {
                var squareToFill = tetrisGame.getSquareGivenCoordinate(position.x, position.y);

                isOver = squareToFill.hasClass('filled');
            });

            if (isOver) {
                CONSTS.gameState = false;
                CONSTS.activeObjectCoordiantes = [];
            }

            return isOver;
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

            // Her bir oyun karesini çizdiriyorum.
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
        events: {
            setEvents: function () {
                window.addEventListener('keydown', this.onPress);
            },
            onPress: function (event) {
                // Oyun kontrollerinin sayfa üzerinde çalışmasını engelliyorum.
                if (event.keyCode === 38 || event.keyCode === 40) {
                    event.cancelBubble = true;
                    event.returnValue = false;
                }

                switch (event.keyCode) {
                    case 37:
                        tetrisGame.gameObjects.oneStepForward('left');
                        break;
                    case 39:
                        tetrisGame.gameObjects.oneStepForward('right');
                        break;
                    default:
                        break;
                }
            }
        }
    }