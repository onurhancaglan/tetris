    "use strict"

    // Load the script
    var script = document.createElement("SCRIPT");

    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function () {
        var nextRandomObject = tetrisGame.gameObjects.getRandomObject();

        CONSTS.activeGameObject = $('.square[active="true"]');
        CONSTS.activeGameObject_type = CONSTS.activeGameObject.attr('gameObject');
        CONSTS.gameState = true;

        tetrisGame.events.setEvents();
        tetrisGame.createGameArea();
        tetrisGame.gameObjects.drawToStartPoint(nextRandomObject);

        window.tetrisLoop = setInterval(function () {
            if (CONSTS.gameState) {
                var gridLineObjects = $('.square[gameobject="gridLine"]');

                // Sürekli olarak, aktif olan objenin kordinatlarını ve elementlerini sabit bir değerde tutuyorum
                CONSTS.activeGameObject = $('.square[active="true"]');
                CONSTS.activeGameObject_type = CONSTS.activeGameObject.attr('gameObject');
                CONSTS.activeGameObject.css({
                    backgroundColor: tetrisGame.gameObjects[CONSTS.activeGameObject_type || 'gridLine'].color
                });

                gridLineObjects.css({
                    backgroundColor: CONSTS.gameBackgroundColor
                });

                if (!tetrisGame.gameObjects.bottomCollision()) {
                    // Herhangi bir engele takılmadıysa obje hareket etmeye devam ediyor.
                    tetrisGame.gameObjects.oneStepForward();
                } else {
                    var nextObject = tetrisGame.gameObjects.getRandomObject();

                    if (tetrisGame.isOver(nextObject)) {
                        // eğer yeni obje için yer yoksa oyunu bitir.
                        console.log('GAME IS OVER')
                    } else {
                        tetrisGame.winScore();
                        tetrisGame.gameObjects.drawToStartPoint(nextObject);
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
        width: 13,
        height: 25,
        // Oyun hızı
        gameSpeed: 600,
        // Oyun renkleri
        gameBackgroundColor: 'black',
        // Oyuncu kaybedene kadar true döner.
        gameState: false,
        // Aktif olarak hareket eden objenin kareleri
        activeGameObject: null,
        // Aktif olarak hareket eden objenin tipi ve kordinatlaro
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
            convertSquareDefaultObject: function (squareElement) {
                var defaultObjectName = 'gridLine';
                var defaultObject = tetrisGame.gameObjects[defaultObjectName];

                squareElement.removeClass('filled');
                squareElement.attr('gameobject', defaultObjectName);
                squareElement.attr('active', false);

                squareElement.css({
                    backgroundColor: CONSTS.gameBackgroundColor,
                    borderColor: defaultObject.color
                });
            },
            convertSquareToActive: function (squareElement, type, disableActive) {
                type = type || CONSTS.activeGameObject_type;

                squareElement.addClass('filled');
                squareElement.attr('gameObject', type);

                if (!disableActive) {
                    squareElement.attr('active', true);
                }

                squareElement.css({
                    backgroundColor: (this[type] || {}).color
                });
            },
            drawToStartPoint: function (type) {
                // Oyunun ortasından, tipi verilen objeyi yaratarak, objeyi oyuna sokuyorum
                var objectToDraw = this[type];

                (objectToDraw.startPosition || []).map(function (position) {
                    var squareToFill = tetrisGame.getSquareGivenCoordinate(position.x, position.y);

                    tetrisGame.gameObjects.convertSquareToActive(squareToFill, type);
                });

                /** Aynı anda bir çok eventi kontrol edebilmek ve sınırlamak için her turun sonunda disable ediyorum.
                 *  Çizdirirken(yani bu fonksyionfa) yeniden aktif ediyorum.*/
                window.disableArrowButton = false;

                CONSTS.activeGameObject_type = type;
                CONSTS.activeObjectCoordiantes = (objectToDraw || {}).startPosition || [];
                CONSTS.activeGameObject = $('.square[active="true"]');
            },
            oneStepForward: function (direction) {
                // Aktif olan oyun objesini bir önceki pozisyonu baz alarak bir adım ilerletiyorum.
                this.clearBeforePosition();

                var newCoordinates = [];

                for (var coordinate = 0; coordinate < 4; coordinate++) {
                    var position = CONSTS.activeObjectCoordiantes[coordinate];
                    var y = position.y;
                    var x = position.x;

                    if (!window.disableArrowButton) {
                        switch (direction) {
                            case 'left':
                                x = position.x - 1;
                                y = position.y;
                                break;
                            case 'right':
                                x = position.x + 1;
                                y = position.y;
                                break;
                            case 'down':
                                if (!window.disableDown) {
                                    x = position.x;
                                    y = position.y + 1;
                                }
                                break;
                            default:
                                x = position.x;
                                y = position.y + 1;
                                break;
                        }
                    }

                    newCoordinates.push({
                        x: x,
                        y: y
                    });

                    // Oyundan yeni kordinatlardaki ve kareleri alıp aktif hale geçirerek oyun objesine çeviriyorum.
                    var emptySquare = tetrisGame.getSquareGivenCoordinate(x, y);

                    tetrisGame.gameObjects.convertSquareToActive(emptySquare);
                }

                CONSTS.activeGameObject = $('.square[active="true"]');
                CONSTS.activeObjectCoordiantes = newCoordinates;
            },
            clearBeforePosition: function () {
                // Şu aktif olan objeyi oyun alanından temizliyorum.
                for (var square = 0; square < 4; square++) {
                    var activeObject = $(CONSTS.activeGameObject[square]);

                    tetrisGame.gameObjects.convertSquareDefaultObject(activeObject);
                }
            },
            isNearObjectCollided: function (x, y, controlPosition, axisLimit, controlAxis) {
                /** Aktif olan oyun objesinin etrafındaki karelerin, objeinin hala hareket etmesine izin verip
                     vermeyeceğini kontrol ediyorum.*/
                var _nearSquare = $('[y="' + y + '"][x="' + x + '"]:not([active="true"])');
                var isCollided = false;

                if (_nearSquare.length > 0 || controlPosition === axisLimit) {
                    // Altındaki kare dolu mu ya da son kare mi diye bakıyorum.
                    isCollided = _nearSquare.hasClass('filled') ||
                        (parseInt(_nearSquare.attr(controlAxis)) || 0) === 0;
                }

                return isCollided;
            },
            sideCollision: function (direction) {
                // Sağ ve sol kısımların çarpışma algılayıcısı
                var isCollided = false;

                $(CONSTS.activeGameObject).map(function (key) {
                    var activeSquare = CONSTS.activeObjectCoordiantes[key] || {};
                    var x = activeSquare.x;
                    var y = activeSquare.y;
                    var axisLimit = 0;
                    var controlPosition = 0;

                    switch (direction) {
                        case 'left':
                            x = x - 1;
                            controlPosition = x;
                            break;
                        case 'right':
                            controlPosition = x;
                            x = x + 1
                            axisLimit = CONSTS.width;
                            break;
                        default:
                            break;
                    }

                    if (!isCollided) {
                        isCollided = tetrisGame.gameObjects.isNearObjectCollided(x, y, controlPosition, axisLimit, 'x');
                    }
                });

                return isCollided;
            },
            bottomCollision: function () {
                // Oyun alt kısmı çarpışma algılayıcısı
                var bottomCollided = false;

                $(CONSTS.activeGameObject).map(function (key) {
                    var activeSquare = CONSTS.activeObjectCoordiantes[key] || {};
                    var x = activeSquare.x;
                    var y = activeSquare.y + 1;

                    if (!bottomCollided) {
                        bottomCollided = tetrisGame.gameObjects.isNearObjectCollided(x, y, y, CONSTS.height, 'y');
                    }

                    if (bottomCollided) {
                        // Eğer hareket edemeyecekse, aktif durumdan çıkarıyorum.
                        $(CONSTS.activeGameObject).attr('active', false);
                        // Kordinatları temizliyorum.
                        CONSTS.activeGameObject = [];
                        window.disableArrowButton = true;

                        // Diğer karelere bakmadan döngüden çıkarıyorum.
                        return bottomCollided;
                    }
                });

                return bottomCollided;
            },
            rotate: function () {
                var center;

                if (CONSTS.activeGameObject_type === 'T') {
                    center = CONSTS.activeObjectCoordiantes[2];
                } else if (CONSTS.activeGameObject_type === 'O') {
                    return false;
                } else if (CONSTS.activeGameObject_type === 'S') {
                    center = CONSTS.activeObjectCoordiantes[0];
                } else {
                    center = CONSTS.activeObjectCoordiantes[1];
                }

                var newPositions = [];

                CONSTS.activeObjectCoordiantes.map(function (square) {
                    var x = square.x - center.x;
                    var y = square.y - center.y;

                    var t = x;

                    x = -y;
                    y = t;

                    // translate the block back
                    x += center.x;
                    y += center.y;

                    newPositions.push({
                        x: x,
                        y: y
                    });
                });

                var newPositionIsCollided = false;

                newPositions.map(function (newCoordinate) {
                    var x = newCoordinate.x;
                    var y = newCoordinate.y;

                    if (!newPositionIsCollided) {
                        newPositionIsCollided =
                            tetrisGame.gameObjects.isNearObjectCollided(x, y, y, CONSTS.height, 'y') || // boottom
                            (x > 13) || (x <= 0); // right & left
                    }
                });

                if (!newPositionIsCollided) {
                    tetrisGame.gameObjects.convertSquareDefaultObject(CONSTS.activeGameObject);

                    newPositions.map(function (position) {
                        tetrisGame.gameObjects.convertSquareToActive(
                            tetrisGame.getSquareGivenCoordinate(position.x, position.y));
                    });

                    CONSTS.activeGameObject = $('.square[active="true"]');
                    CONSTS.activeObjectCoordiantes = newPositions;
                }
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
        winScore: function () {
            var removedLines = [];

            // En alt sıradan başlayarak tetris olan kordinatları alıyorum ve temizliyorum.
            for (var y = CONSTS.height; y > 0; y--) {
                var line = $('[y=' + y + '].filled');

                if (line.length === CONSTS.width) {
                    tetrisGame.gameObjects.convertSquareDefaultObject(line);
                    removedLines.push(y);
                }
            }

            var oldSquares = [];

            // Geri kalan tüm dolu karelerin kordinatlarını alip temizliyorum.
            $('.filled:not([active="true"])').each(function () {
                var square = $(this);

                if (parseInt(square.attr('y')) < removedLines[0]) {
                    oldSquares.push({
                        x: parseInt(square.attr('x')),
                        y: parseInt(square.attr('y')),
                        type: square.attr('gameobject')
                    });

                    tetrisGame.gameObjects.convertSquareDefaultObject(square);
                }
            });

            // Silinen sıraların üstündeki sıraları bir aşağı indiriyorum
            oldSquares.map(function (square) {
                var squareToFill = tetrisGame.getSquareGivenCoordinate(square.x, square.y + removedLines.length);

                tetrisGame.gameObjects.convertSquareToActive(squareToFill, square.type, true);
            });
        },
        isOver: function (nextObjectType) {
            // Oyun kaybetme
            nextObjectType = nextObjectType || 'gridLine';

            var objectToDraw = this.gameObjects[nextObjectType] || {};
            var isOver = false;

            // Eğer başlangıç noktasında yeni obje için yer yoksa, oyunu bitiriyorum.
            (objectToDraw.startPosition || []).map(function (position) {
                var squareToFill = tetrisGame.getSquareGivenCoordinate(position.x, position.y);

                if (!isOver) {
                    isOver = squareToFill.hasClass('filled');
                }
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
            return $('.square[x="' + x + '"][y="' + y + '"]');
        },
        events: {
            setEvents: function () {
                window.addEventListener('keydown', this.onPress);
            },
            onPress: function (event) {
                // Oyun kontrollerinin sayfa üzerinde çalışmasını engelliyorum.
                if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 32) {
                    event.cancelBubble = true;
                    event.returnValue = false;
                }

                if (!window.disableArrowButton) {
                    switch (event.keyCode) {
                        case 37:
                            if (!tetrisGame.gameObjects.sideCollision('left')) {
                                tetrisGame.gameObjects.oneStepForward('left');
                            }
                            break;
                        case 39:
                            if (!tetrisGame.gameObjects.sideCollision('right')) {
                                tetrisGame.gameObjects.oneStepForward('right');
                            }
                            break;
                        case 40:
                            if (!tetrisGame.gameObjects.bottomCollision()) {
                                tetrisGame.gameObjects.oneStepForward('down');
                            }
                            break;
                        case 38:
                            tetrisGame.gameObjects.rotate();
                            break;
                        case 32:
                            // Birden aşağı indirme
                            while (!tetrisGame.gameObjects.bottomCollision()) {
                                tetrisGame.gameObjects.oneStepForward('down');
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }