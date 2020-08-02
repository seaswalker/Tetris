window.onload = function () {
    Tetris.start();
};

var Tetris = {
    //默认1000ms刷新一次
    refreshInterval: 1000,
    currentIntervalID: -1,
    //当前活动的方块，存储其类型以及坐标
    //坐标为一个三维数组，第二维为按列划分，第三维即坐标点
    currentBlock: null,
    //下一个方块的类型
    nextType: 0,
    //画笔
    brush: null,
    //每个方格的大小
    boxSize: 30,
    boxNum: {
        rows: 20,
        cols: 10
    },
    pointsPerLine: 10,
    //dom对象缓存
    cache: {
        nextImage: null,
        level: null,
        currentPoint: 0,
        neededPoints: 0,
        //遮罩
        mask: null,
        //pause
        pause: null
    },
    shapes: {
        // ----
        1: {
            //方格图片对象
            box: null,
            //方块图片路径
            block: "images/blocks/1.png",
            /**
             * 添加一个本类型的方块
             * @returns {boolean} 如果游戏结束，返回true
             */
            add: function () {
                var col = Tetris.boxNum.cols / 2;
                if (Tetris.boxes[col][0] > 0)
                    return true;
                Tetris.boxes[col][0] = 1;
                Tetris.currentBlock = {
                    type: 1,
                    points: [
                        [
                            [5, 0],
                            [5, -1],
                            [5, -2],
                            [5, -3]
                        ]
                    ]
                };
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(2);
                this.indexer.reset();
                return false;
            },
            indexer: null,
            getRelativeCoordinate: function () {
                var that = this;
                var relativeCoordinates = [{
                        collisionDetection: {
                            collision: [{
                                    isLeft: true,
                                    distance: -2
                                },
                                {
                                    isLeft: false,
                                    distance: 1
                                }
                            ],
                            coordinates: [
                                [-2, -2],
                                [-1, -2],
                                [1, -2]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [0, -1],
                                [0, -3]
                            ],
                            after: [
                                [-2, -2],
                                [-1, -2],
                                [1, -2]
                            ]
                        },
                        /**
                         * 根据给定的第一列最下点的坐标生成新的活动方块坐标
                         */
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x - 2, y - 2]
                                ],
                                [
                                    [x - 1, y - 2]
                                ],
                                [
                                    [x, y - 2]
                                ],
                                [
                                    [x + 1, y - 2]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [
                                [2, 2],
                                [2, 1],
                                [2, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [1, 0],
                                [3, 0]
                            ],
                            after: [
                                [2, 2],
                                [2, 1],
                                [2, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x + 2, y + 2],
                                    [x + 2, y + 1],
                                    [x + 2, y],
                                    [x + 2, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        },
        // |__
        2: {
            box: null,
            block: "images/blocks/2.png",
            add: function () {
                if ((Tetris.boxes[4][0] + Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
                    return true;
                Tetris.boxes[4][0] = Tetris.boxes[5][0] = Tetris.boxes[6][0] = 2;
                Tetris.currentBlock = {
                    type: 2,
                    points: [
                        [
                            [4, 0],
                            [4, -1]
                        ],
                        [
                            [5, 0]
                        ],
                        [
                            [6, 0]
                        ]
                    ]
                };
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(4);
                this.indexer.reset();
                return false;
            },
            indexer: null,
            getRelativeCoordinate: function () {
                var that = this;
                var relativeCoordinates = [{
                        collisionDetection: {
                            coordinates: [
                                [1, 1],
                                [1, -1],
                                [2, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [0, -1],
                                [2, 0]
                            ],
                            after: [
                                [1, 1],
                                [1, -1],
                                [2, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ],
                                [
                                    [x + 2, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: true,
                                distance: -1
                            }],
                            coordinates: [
                                [-1, -1],
                                [1, -1],
                                [1, 0]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [0, -2],
                                [1, -2]
                            ],
                            after: [
                                [-1, -1],
                                [1, -1],
                                [1, 0]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x - 1, y - 1]
                                ],
                                [
                                    [x, y - 1]
                                ],
                                [
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [
                                [0, 1],
                                [1, 1],
                                [1, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [2, 0],
                                [2, 1]
                            ],
                            after: [
                                [0, 1],
                                [1, 1],
                                [1, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y + 1]
                                ],
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: false,
                                distance: 2
                            }],
                            coordinates: [
                                [0, -1],
                                [0, -2],
                                [2, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [1, 0],
                                [1, -2]
                            ],
                            after: [
                                [0, -2],
                                [0, -1],
                                [2, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y - 1],
                                    [x, y - 2]
                                ],
                                [
                                    [x + 1, y - 1]
                                ],
                                [
                                    [x + 2, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        },
        // __|
        3: {
            box: null,
            block: "images/blocks/3.png",
            add: function () {
                if ((Tetris.boxes[4][0] + Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
                    return true;
                Tetris.boxes[4][0] = Tetris.boxes[5][0] = Tetris.boxes[6][0] = 3;
                Tetris.currentBlock = {
                    type: 3,
                    points: [
                        [
                            [4, 0]
                        ],
                        [
                            [5, 0]
                        ],
                        [
                            [6, 0],
                            [6, -1]
                        ]
                    ]
                };
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(4);
                this.indexer.reset();
                return false;
            },
            indexer: null,
            getRelativeCoordinate: function () {
                var that = this;
                var relativeCoordinates = [{
                        collisionDetection: {
                            coordinates: [
                                [1, -1],
                                [1, 1],
                                [2, 1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [2, 0],
                                [2, -1]
                            ],
                            after: [
                                [1, -1],
                                [1, 1],
                                [2, 1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ],
                                [
                                    [x + 2, y + 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: true,
                                distance: -1
                            }],
                            coordinates: [
                                [-1, 0],
                                [-1, -1],
                                [1, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [1, 0],
                                [0, -2]
                            ],
                            after: [
                                [-1, 0],
                                [-1, -1],
                                [1, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x - 1, y],
                                    [x - 1, y - 1]
                                ],
                                [
                                    [x, y - 1]
                                ],
                                [
                                    [x + 1, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [
                                [0, -2],
                                [1, -2],
                                [1, 0]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [0, -1],
                                [2, -1]
                            ],
                            after: [
                                [0, -2],
                                [1, -2],
                                [1, 0]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y - 2]
                                ],
                                [
                                    [x + 1, y],
                                    [x + 1, y - 1],
                                    [x + 1, y - 2]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: false,
                                distance: 2
                            }],
                            coordinates: [
                                [0, 1],
                                [2, 1],
                                [2, 0]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [1, 0],
                                [1, 2]
                            ],
                            after: [
                                [0, 1],
                                [2, 1],
                                [2, 0]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y + 1]
                                ],
                                [
                                    [x + 1, y + 1]
                                ],
                                [
                                    [x + 2, y + 1],
                                    [x + 2, y]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        },
        //田
        4: {
            box: null,
            block: "images/blocks/4.png",
            add: function () {
                if ((Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
                    return true;
                Tetris.boxes[5][0] = Tetris.boxes[6][0] = 4;
                Tetris.currentBlock = {
                    type: 4,
                    points: [
                        [
                            [5, 0],
                            [5, -1]
                        ],
                        [
                            [6, 0],
                            [6, -1]
                        ]
                    ]
                };
                return false;
            }
        },
        //    __
        // __|
        5: {
            box: null,
            block: "images/blocks/5.png",
            add: function () {
                if ((Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
                    return true;
                Tetris.boxes[5][0] = Tetris.boxes[6][0] = 5;
                Tetris.currentBlock = {
                    type: 5,
                    points: [
                        [
                            [5, 0]
                        ],
                        [
                            [6, 0],
                            [6, -1]
                        ],
                        [
                            [7, -1]
                        ]
                    ]
                };
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(2);
                this.indexer.reset();
                return false;
            },
            indexer: null,
            getRelativeCoordinate: function () {
                var that = this;
                var relativeCoordinates = [{
                        collisionDetection: {
                            coordinates: [
                                [0, -1],
                                [0, -2]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [2, -1]
                            ],
                            after: [
                                [0, -1],
                                [0, -2]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y - 1],
                                    [x, y - 2]
                                ],
                                [
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: false,
                                distance: 2
                            }],
                            coordinates: [
                                [0, 1],
                                [2, 0]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [0, -1]
                            ],
                            after: [
                                [0, 1],
                                [2, 0]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y + 1]
                                ],
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y]
                                ],
                                [
                                    [x + 2, y]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        },
        //土
        6: {
            box: null,
            block: "images/blocks/6.png",
            add: function () {
                if ((Tetris.boxes[4, 0] + Tetris.boxes[5, 0] + Tetris.boxes[6, 0]) > 0)
                    return true;
                Tetris.boxes[4][0] = Tetris.boxes[5][0] = Tetris.boxes[6][0] = 6;
                Tetris.currentBlock = {
                    type: 6,
                    points: [
                        [
                            [4, 0]
                        ],
                        [
                            [5, 0],
                            [5, -1]
                        ],
                        [
                            [6, 0]
                        ]
                    ]
                };
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(4);
                this.indexer.reset();
                return false;
            },
            indexer: null,
            getRelativeCoordinate: function () {
                var that = this;
                var relativeCoordinates = [{
                        collisionDetection: {
                            coordinates: [
                                [1, 1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0]
                            ],
                            after: [
                                [1, 1]
                            ]
                        },
                        /**
                         * 根据给定的第一列最下点的坐标生成新的活动方块坐标
                         */
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ],
                                [
                                    [x + 2, y]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: true,
                                distance: -1
                            }],
                            coordinates: [
                                [-1, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, -2]
                            ],
                            after: [
                                [-1, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x - 1, y - 1]
                                ],
                                [
                                    [x, y],
                                    [x, y - 1]
                                ],
                                [
                                    [x + 1, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [
                                [1, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [2, 0]
                            ],
                            after: [
                                [1, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y]
                                ],
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: false,
                                distance: 2
                            }],
                            coordinates: [
                                [2, 0]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [1, 1]
                            ],
                            after: [
                                [2, 0]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x, y]
                                ],
                                [
                                    [x + 1, y],
                                    [x + 1, y - 1]
                                ],
                                [
                                    [x + 2, y]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        },
        //  --
        //   |__
        7: {
            box: null,
            block: "images/blocks/7.png",
            add: function () {
                if ((Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
                    return true;
                Tetris.boxes[5][0] = Tetris.boxes[6][0] = 7;
                Tetris.currentBlock = {
                    type: 7,
                    points: [
                        [
                            [4, -1]
                        ],
                        [
                            [5, 0],
                            [5, -1]
                        ],
                        [
                            [6, 0]
                        ]
                    ]
                };
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(2);
                this.indexer.reset();
                return false;
            },
            indexer: null,
            getRelativeCoordinate: function () {
                var that = this;
                var relativeCoordinates = [{
                        collisionDetection: {
                            coordinates: [
                                [2, 0],
                                [2, -1]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [0, 0],
                                [2, 1]
                            ],
                            after: [
                                [2, 0],
                                [2, -1]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x + 1, y + 1],
                                    [x + 1, y]
                                ],
                                [
                                    [x + 2, y],
                                    [x + 2, y - 1]
                                ]
                            ];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [{
                                isLeft: true,
                                distance: -1
                            }],
                            coordinates: [
                                [-1, -1],
                                [1, 0]
                            ]
                        },
                        changedCoordinates: {
                            before: [
                                [1, -1],
                                [1, -2]
                            ],
                            after: [
                                [-1, -1],
                                [1, 0]
                            ]
                        },
                        rebuildCurrentPoints: function (x, y) {
                            return [
                                [
                                    [x - 1, y - 1]
                                ],
                                [
                                    [x, y],
                                    [x, y - 1]
                                ],
                                [
                                    [x + 1, y]
                                ]
                            ];
                        }
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        }
    },
    //坐标地图
    boxes: [],
    //消行音效
    soundEffect: new Audio("sounds/collision.mp3"),
    //当前获得的分数
    points: 0,
    //当前级别的满分
    currentLevelPoints: 100,
    //当前的级别
    currentLevel: 1,
    //分数索引
    pointSequencer: null,
    /**
     * 开始游戏:
     * 1. 初始化方块图片对象
     * 2. 初始化方格二维数组
     * 3. 初始化画笔对象
     * 4. 生成一个方块
     * 5. 启动重绘
     * 6. 监听键盘事件
     */
    start: function () {
        //初始化缓存
        Tetris.cache.nextImage = document.getElementById("next-img");
        Tetris.cache.level = document.getElementById("level-content");
        Tetris.cache.currentPoints = document.getElementById("current-point");
        Tetris.cache.neededPoints = document.getElementById("needed-point");
        Tetris.cache.mask = document.getElementById("mask");
        Tetris.cache.pause = document.getElementById("pause");
        Tetris.nextType = Tetris.utils.getRandomInt(1, 8);
        //初始化形状对象
        for (var i = 1; i < 8; i++) {
            var box = new Image();
            box.src = "images/" + i + ".png";
            Tetris.shapes[i].box = box;
        }
        //初始化方格二维数组
        var arr;
        for (var i = 0; i < Tetris.boxNum.cols; i++) {
            arr = Tetris.boxes[i] = [];
            for (var j = 0; j < Tetris.boxNum.rows; j++) {
                arr[j] = 0;
            }
        }
        //初始化画笔对象
        var canvas = document.getElementById("main-canvas");
        Tetris.brush = canvas.getContext("2d");
        Tetris.pointSequencer = Tetris.utils.fibonacciSequencer;
        Tetris.pointSequencer.next();
        //生成一个方块
        Tetris.addBlock();
        Tetris.refresh(true);
        //启动重绘
        Tetris.utils.setThread();
        document.addEventListener("keydown", function (e) {
            Tetris.handleKeyEvent(e.keyCode);
        }, false);
    },
    /**
     * 处理键盘按下时间
     * @param keyCode 键码
     */
    handleKeyEvent: function (keyCode) {
        if (Tetris.utils.checkCurrent() || (Tetris.currentIntervalID == -1) && keyCode != 80) {
            return;
        }

        switch (keyCode) {
            case 37:
                Tetris.moveLeft();
                break;
            case 38:
                Tetris.transform();
                break;
            case 39:
                Tetris.moveRight();
                break;
            case 40:
                Tetris.faster();
                break;
            case 80:
                Tetris.togglePause();
                break;
        }
    },
    /**
     * 刷新重绘
     * @param flag 如果为true，那么表示刚增加了方块，不需要移动
     */
    refresh: function (flag) {
        if (!flag)
            Tetris.moveCurrentPoints();
        for (var i = 0; i < Tetris.boxNum.cols; i++) {
            for (var j = 0; j < Tetris.boxNum.rows; j++) {
                var n;
                if ((n = Tetris.boxes[i][j]) > 0) {
                    Tetris.brush.drawImage(Tetris.shapes[n].box, i * Tetris.boxSize, j * Tetris.boxSize);
                } else {
                    Tetris.brush.clearRect(i * Tetris.boxSize, j * Tetris.boxSize, Tetris.boxSize, Tetris.boxSize);
                }
            }
        }
    },
    /**
     * 将当前的活动方块下移一行
     */
    moveCurrentPoints: function () {
        if (Tetris.utils.checkCurrent()) {
            Tetris.addBlock();
            return;
        }

        //逐列检查第一个box下方是否有box
        var points = Tetris.currentBlock.points,
            p, n, rows = Tetris.boxNum.rows,
            type = +Tetris.currentBlock.type,
            maxY = 0;
        var canMove = true;

        for (var i = 0, cols = points.length; i < cols; i++) {
            p = points[i][0];
            if (p[1] > maxY) maxY = p[1];
            if ((n = p[1] + 1) >= rows || Tetris.boxes[p[0]][n] > 0) {
                canMove = false;
            }
        }

        if (!canMove) {
            Tetris.removeLines(maxY);
            Tetris.addBlock();
            return;
        }

        //下移
        for (var i = 0, cols = points.length; i < cols; i++) {
            for (var j = 0, l = points[i].length; j < l; j++) {
                p = points[i][j];
                Tetris.boxes[p[0]][p[1] + 1] = type;
                Tetris.boxes[p[0]][p[1]] = 0;
                p[1]++;
            }
        }
    },
    /**
     * 处理左箭头按下事件，向左移动
     */
    moveLeft: function () {
        var points = Tetris.currentBlock.points;
        if (points[0][0][0] === 0) {
            return;
        }

        // 检测左边是否有方块，如果有，不能移动
        var mostLeftColumn = points[0];
        for (var i = 0, l = mostLeftColumn.length; i < l; i++) {
            var point = mostLeftColumn[i];
            if (Tetris.boxes[point[0] - 1][point[1]] > 0) {
                return;
            }
        }

        for (var i = 0, cols = points.length; i < cols; i++) {
            for (var j = 0, l = points[i].length; j < l; j++) {
                var p = points[i][j];
                Tetris.boxes[p[0] - 1][p[1]] = Tetris.boxes[p[0]][p[1]];
                Tetris.boxes[p[0]][p[1]] = 0;
                p[0]--;
            }
        }

        Tetris.refresh(true);
    },
    /**
     * 处理右箭头按下事件，向右移动
     */
    moveRight: function () {
        var points = Tetris.currentBlock.points,
            cols = points.length;
        if (points[cols - 1][0][0] === Tetris.boxNum.cols - 1) return;

        // 检测右边是否有方块存在，如果有不能移动
        var mostRightColumn = points[cols - 1];
        for (var i = 0, l = mostRightColumn.length; i < l; i++) {
            point = mostRightColumn[i];
            if (Tetris.boxes[point[0] + 1][point[1]] > 0) {
                return;
            }
        }

        for (var i = cols - 1; i >= 0; i--) {
            for (var j = 0, l = points[i].length; j < l; j++) {
                var p = points[i][j];
                Tetris.boxes[p[0] + 1][p[1]] = Tetris.boxes[p[0]][p[1]];
                Tetris.boxes[p[0]][p[1]] = 0;
                p[0]++;
            }
        }
        Tetris.refresh(true);
    },
    /**
     * 向下加速掉落
     */
    faster: function () {
        var points = Tetris.currentBlock.points,
            maxY = 0,
            cols = points.length,
            p, deep, minDepth = 20,
            rows = Tetris.boxNum.rows,
            type = +Tetris.currentBlock.type;
        //寻找每一列可以下落的最小值
        for (var i = 0; i < cols; i++) {
            //每一列的第一行坐标
            p = points[i][0];
            if (p[1] > maxY) maxY = p[1];
            deep = p[1] + 1;
            while (deep < rows && Tetris.boxes[p[0]][deep] === 0)
                ++deep;
            deep -= (p[1] + 1);
            minDepth = deep < minDepth ? deep : minDepth;
            if (deep == 0) {
                // 说明当前列无法向下移动，所以0就是最小值，没有必要再判断后面的列
                break;
            }
        }

        // minDepth为零的场景是定时器刚把方块移动到不能再次移动的位置，这里就不做任何操作了，等定时器下次调用刷新、清行即可
        if (minDepth === 0) return;

        for (var i = 0; i < cols; i++) {
            for (var j = 0, l = points[i].length; j < l; j++) {
                p = points[i][j];
                Tetris.boxes[p[0]][p[1] + minDepth] = type;
                Tetris.boxes[p[0]][p[1]] = 0;
                p[1] += minDepth;
            }
        }

        Tetris.currentBlock = null;
        Tetris.removeLines(maxY + minDepth);
        Tetris.refresh(true);
    },
    /**
     * 方块变形
     */
    transform: function () {
        var type = +Tetris.currentBlock.type;
        if (type === 4) return;
        var relativeCoordinate = Tetris.shapes[type].getRelativeCoordinate(),
            o,
            points = Tetris.currentBlock.points,
            p = points[0][0],
            x = p[0],
            y = p[1];
        //检测边缘
        if (o = relativeCoordinate.collisionDetection.collision) {
            for (var i = 0, l = o.length; i < l; i++) {
                p = o[i];
                if (p.isLeft === true) {
                    if (x + p.distance < 0) {
                        relativeCoordinate.decreaseIndex();
                        return;
                    }
                } else if (p.isLeft === false) {
                    if (x + p.distance >= Tetris.boxNum.cols) {
                        relativeCoordinate.decreaseIndex();
                        return;
                    }
                }
            }
        }
        //检测碰撞
        o = relativeCoordinate.collisionDetection.coordinates;
        for (var i = 0, l = o.length; i < l; i++) {
            p = o[i];

            xChecked = x + p[0];
            yChecked = y + p[1];

            if (xChecked < 0 || yChecked < 0) {
                continue;
            }

            if (Tetris.boxes[xChecked][yChecked] > 0) {
                relativeCoordinate.decreaseIndex();
                return;
            }
        }
        //移动方格
        o = relativeCoordinate.changedCoordinates;
        for (var i = 0, l = o.before.length; i < l; i++) {
            p = o.after[i];

            xNew = x + p[0];
            yNew = y + p[1];
            if (xNew >= 0 && yNew >= 0) {
                Tetris.boxes[xNew][yNew] = type;
            }

            p = o.before[i];
            Tetris.boxes[x + p[0]][y + p[1]] = 0;
        }
        //重建活动方块坐标
        Tetris.currentBlock.points = relativeCoordinate.rebuildCurrentPoints(x, y);
        Tetris.refresh(true);
    },
    /**
     * 检测满行，消除并计分
     * @param {Number} offset 检测的起始行数(倒序检测)
     */
    removeLines: function (offset) {
        var ps = 0,
            cols = Tetris.boxNum.cols;
        var lastHighBound = -1;
        var blocksMovementOffsets = [];

        A: for (var i = offset; i >= 0; i--) {
            for (var j = 0; j < cols; j++) {
                if (Tetris.boxes[j][i] === 0) {
                    if (lastHighBound > -1) {
                        blocksMovementOffsets.push({
                            offset: lastHighBound,
                            lines: lastHighBound - i
                        });
                        lastHighBound = -1;
                    }
                    continue A;
                }
            }

            //此行已满，加分
            if (j === cols) {
                ps += Tetris.pointsPerLine;
                if (lastHighBound == -1) {
                    lastHighBound = i;
                }
            }
        }

        if (lastHighBound > -1) {
            // 说明顶部最上面一行也可以消除
            blocksMovementOffsets.push({
                offset: lastHighBound,
                lines: lastHighBound + 1
            });
        }

        if (blocksMovementOffsets.length > 0) {
            Tetris.moveBlocks(blocksMovementOffsets);
            Tetris.playSound();
            Tetris.refreshPoints(ps);
        }
    },
    /**
     * 对现有方块进行消行.
     * @param {Array} blocksMovementOffsets 参数结构:
     * [{
     *     offset: 19,
     *     lines: 2
     * }]
     * offset表示第offset行开始是满行(可以消除)，lines表示从offset开始有lines行连续满行。数组结构表示当前方块中可能有多个不连续的
     * 可消除行存在，比如第19-17行一段可以消除，14-13一段也可以消除。
     */
    moveBlocks: function (blocksMovementOffsets) {
        console.log("Block移动数组: " + JSON.stringify(blocksMovementOffsets));

        var prevRemovedLines = 0;
        for (var i = 0, l = blocksMovementOffsets.length; i < l; i++) {
            var lowBound = 0;
            if (i + 1 < l) {
                lowBound = blocksMovementOffsets[i + 1].offset;
            }
            var blocksMovementOffset = blocksMovementOffsets[i];
            Tetris.doMoveBlocks(lowBound, blocksMovementOffset.offset - blocksMovementOffset.lines, blocksMovementOffset.lines + prevRemovedLines);
            prevRemovedLines += blocksMovementOffset.lines;
        }
    },
    /**
     * 把(low, high]之间的块下移lines行.
     */
    doMoveBlocks: function (low, high, lines) {
        // 下移
        for (var i = 0, cols = Tetris.boxNum.cols; i < cols; i++) {
            for (var j = high; j > low; j--) {
                Tetris.boxes[i][j + lines] = Tetris.boxes[i][j];
                Tetris.boxes[i][j] = 0;
            }
        }
        console.log("把(" + low + ", " + high + "]之间的块下移了" + lines + "行");
    },
    /**
     * 播放碰撞音效
     */
    playSound: function () {
        Tetris.soundEffect.loop = false;
        Tetris.soundEffect.play();
    },
    /**
     * 刷新分数显示
     * @param {Number} ps 增长的分数
     */
    refreshPoints: function (ps) {
        Tetris.points += ps;
        if (Tetris.points >= Tetris.currentLevelPoints) {
            Tetris.currentLevel++;
            Tetris.currentLevelPoints = Tetris.pointSequencer.next() * 100;
            Tetris.refreshLevel();
        }
        Tetris.cache.currentPoints.innerHTML = Tetris.points;
        Tetris.cache.neededPoints.innerHTML = Tetris.currentLevelPoints - Tetris.points;
    },
    /**
     * 刷新level
     */
    refreshLevel: function () {
        Tetris.cache.level.innerHTML = Tetris.currentLevel;
        Tetris.utils.setThread();
    },
    /**
     * 暂停/恢复
     */
    togglePause: function () {
        if (Tetris.currentIntervalID < 0) {
            //恢复
            Tetris.cache.mask.style.display = "none";
            Tetris.cache.pause.style.display = "none";
            Tetris.utils.setThread(true);
        } else {
            //清除定时器
            clearInterval(Tetris.currentIntervalID);
            Tetris.cache.mask.style.display = "block";
            Tetris.cache.pause.style.display = "block";
            Tetris.currentIntervalID = -1;
        }

    },
    addBlock: function () {
        if (Tetris.shapes[Tetris.nextType].add())
            Tetris.gameOver();
        else
            Tetris.setNextBlock(Tetris.utils.getRandomInt(1, 8));
    },
    /**
     * [[绘制下一个方块示意图]]
     * @param {[[Number]]} next [[下一个方块的类型]]
     */
    setNextBlock: function (next) {
        Tetris.nextType = next;
        Tetris.cache.nextImage.src = Tetris.shapes[next].block;
    },
    gameOver: function () {
        clearInterval(Tetris.currentIntervalID);
        Tetris.currentBlock = null;
        Tips.showError("Ops! Game over");
    },
    //工具方法集合
    utils: {
        /**
         * 生成一个[min, max)之间的整数
         * @param min 最小值
         * @param max 最大值
         * @returns {integer} 随机数
         */
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        /**
         * 重新设定定时器
         * @param Boolean isResume 如果为true，代表恢复执行，不需要重新设定间隔
         */
        setThread: function (isResume) {
            if (isResume === true) {
                Tetris.currentIntervalID = setInterval(Tetris.refresh, Tetris.refreshInterval);
            } else if (Tetris.refreshInterval > 300) {
                clearInterval(Tetris.currentIntervalID);
                //刷新间隔每次减少200ms，直到400ms不在改变
                Tetris.refreshInterval -= 200;
                Tetris.currentIntervalID = setInterval(Tetris.refresh, Tetris.refreshInterval);
            }
        },
        /**
         * [[为方块的变形建立索引]]
         * @param   {[[Integer]]} types [[方块变形的种数]]
         * @returns {object}   [[索引对象]]
         */
        newIndexer: function (types) {
            var index = 0;
            return {
                next: function () {
                    var i = index;
                    index++;
                    index = index == types ? 0 : index;
                    return i;
                },
                decrease: function () {
                    index = index == 0 ? types - 1 : (--index);
                },
                reset: function () {
                    index = 0;
                }
            };
        },
        returnHelper: function (relativeCoordinates) {
            var t = relativeCoordinates[this.indexer.next()];
            t.decreaseIndex = this.indexer.decrease;
            return t;
        },
        /**
         * [[检查当前是否有活动方块，如果没有，不允许进行左，右，下的移动以及变形]]
         * @returns {[[Boolean]]} [[没有返回true]]
         */
        checkCurrent: function () {
            return Tetris.currentBlock === null;
        },
        /**
         * 返回以类斐波那契数列递增的序列
         * (第二个数字为2，而不是1)
         * @returns {Object}   索引对象
         */
        fibonacciSequencer: (function () {
            var arr = [0, 1];
            return {
                /**
                 * 返回下一个数字
                 */
                next: function () {
                    var result = arr[0] + arr[1];
                    arr[0] = arr[1];
                    arr[1] = result;
                    return result;
                },
                /**
                 * 重置索引对象，重新从1开始
                 */
                reset: function () {
                    arr[0] = 0;
                    arr[1] = 1;
                }
            };
        })()
    }
};