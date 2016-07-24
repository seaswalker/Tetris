window.onload = function() {
    Tetris.start();
};

var Tetris = {
	//默认2000ms刷新一次
	refreshInterval: 2000,
	currentIntervalID: -1,
	//当前活动的方块，存储其类型以及坐标
	//坐标为一个三维数组，第二维为按列划分，第三维即坐标点
	currentBlock: {},
	//画笔
	brush: null,
	//每个方格的大小
	boxSize: 30,
	boxNum: {
		rows: 20,
		cols: 10
	},
	shapes: {
        // ----
        1: {
            img: "",
			/**
			 * 添加一个本类型的方块
			 * @returns {boolean} 如果游戏结束，返回true
			 */
            add: function() {
                var col = Tetris.boxNum.cols / 2;
				if (Tetris.boxes[col][0] > 0)
					return true;
				Tetris.boxes[col][0] = 1;
				Tetris.currentBlock = {
					type: 1,
					points: [[[5, 0], [5, -1], [5, -2], [5, -3]]]
				};
				return false;
            },
            indexer: null,
			getRelativeCoordinate: function() {
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(2);
                var that = this;
                var relativeCoordinates = [
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: true,
                                    distance: -2
                                },
                                {
                                    isLeft: false,
                                    distance: 1
                                }
                            ],
                            coordinates: [[-2, -2], [-1, -2], [1, -2]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [0, -1], [0, -3]],
                            after: [[-2, -2], [-1, -2], [1, -2]]
                        },
                        /**
                         * 根据给定的第一列最下点的坐标生成新的活动方块坐标
                         */
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x - 2, y - 2]], [[x - 1, y - 2]], [[x, y - 2]], [[x + 1, y - 2]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [[2, 2], [2, 1], [2, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [1, 0], [3, 0]],
                            after: [[2, 2], [2, 1], [2, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x + 2, y + 2], [x + 2, y + 1], [x + 2, y], [x + 2, y - 1]]];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
        },
		// |__
		2: {
			img: "",
			add: function() {
				if ((Tetris.boxes[4][0] + Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
					return true;
				Tetris.boxes[4][0] = Tetris.boxes[5][0] = Tetris.boxes[6][0] = 2;
				Tetris.currentBlock = {
					type: 2,
					points: [[[4, 0], [4, -1]], [[5, 0]], [[6, 0]]]
				};
				return false;
			},
            indexer: null,
            getRelativeCoordinate: function() {
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(4);
                var that = this;
                var relativeCoordinates = [
                    {
                        collisionDetection: {
                            coordinates: [[1, 1], [1, -1], [2, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [0, -1], [2, 0]],
                            after: [[1, 1], [1, -1], [2, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x + 1, y + 1], [x + 1, y], [x + 1, y - 1]], [[x + 2, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: true,
                                    distance: -1
                                }
                            ],
                            coordinates: [[-1, -1], [1, -1], [1, 0]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [0, -2], [1, -2]],
                            after: [[-1, -1], [1, -1], [1, 0]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x - 1, y - 1]], [[x, y - 1]], [[x + 1, y], [x + 1, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [[0, 1], [1, 1], [1, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [2, 0], [2, 1]],
                            after: [[0, 1], [1, 1], [1, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y + 1]], [[x + 1, y + 1], [x + 1, y], [x + 1, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: false,
                                    distance: 2
                                }
                            ],
                            coordinates: [[0, -1], [0, -2], [2, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [1, 0], [1, -2]],
                            after: [[0, -2], [0, -1], [2, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y - 1], [x, y - 2]], [[x + 1, y - 1]], [[x + 2, y - 1]]];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
		},
		// __|
		3: {
			img: "",
			add: function() {
				if ((Tetris.boxes[4][0] + Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
					return true;
				Tetris.boxes[4][0] = Tetris.boxes[5][0] = Tetris.boxes[6][0] = 3;
				Tetris.currentBlock = {
					type: 3,
					points: [[[4, 0]], [[5, 0]], [[6, 0], [6, -1]]]
				};
				return false;
			},
            indexer: null,
            getRelativeCoordinate: function() {
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(4);
                var that = this;
                var relativeCoordinates = [
                    {
                        collisionDetection: {
                            coordinates: [[1, -1], [1, 1], [2, 1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [2, 0], [2, -1]],
                            after: [[1, -1], [1, 1], [2, 1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x + 1, y + 1], [x + 1, y], [x + 1, y - 1]], [[x + 2, y + 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: true,
                                    distance: -1
                                }
                            ],
                            coordinates: [[-1, 0], [-1, -1], [1, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [1, 0], [0, -2]],
                            after: [[-1, 0], [-1, -1], [1, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x - 1, y], [x - 1, y - 1]], [[x, y - 1]], [[x + 1, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [[0, -2], [1, -2], [1, 0]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [0, -1], [2, -1]],
                            after: [[0, -2], [1, -2], [1, 0]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y - 2]], [[x + 1, y], [x + 1, y - 1], [x + 1, y - 2]]];
                        },
                        decreaseIndex: null
                    },
                     {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: false,
                                    distance: 2
                                }
                            ],
                            coordinates: [[0, 1], [2, 1], [2, 0]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [1, 0], [1, 2]],
                            after: [[0, 1], [2, 1], [2, 0]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y + 1]], [[x + 1, y + 1]], [[x + 2, y + 1], [x + 2, y]]];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
		},
		//田
		4: {
			img: "",
			add: function() {
				if ((Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
					return true;
				Tetris.boxes[5][0] = Tetris.boxes[6][0] = 4;
				Tetris.currentBlock = {
					type: 4,
					points: [[[5, 0], [5, -1]], [[6, 0], [6, -1]]]
				};
				return false;
			}
		},
		//    __
		// __|
		5: {
			img: "",
			add: function() {
				if ((Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
					return true;
				Tetris.boxes[5][0] = Tetris.boxes[6][0] = 5;
				Tetris.currentBlock = {
					type: 5,
					points: [[[5, 0]], [[6, 0], [6, -1]], [[7, -1]]]
				};
				return false;
			},
            indexer: null,
            getRelativeCoordinate: function() {
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(2);
                var that = this;
                var relativeCoordinates = [
                    {
                        collisionDetection: {
                            coordinates: [[0, -1], [0, -2]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [2, -1]],
                            after: [[0, -1], [0, -2]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y - 1], [x, y - 2]], [[x + 1, y], [x + 1, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: false,
                                    distance: 2
                                }
                            ],
                            coordinates: [[0, 1], [2, 0]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [0, -1]],
                            after: [[0, 1], [2, 0]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y + 1]], [[x + 1, y + 1], [x + 1, y]], [[x + 2, y]]];
                        },
                        decreaseIndex: null
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
		},
		//土
		6: {
			img: "",
			add: function() {
				if ((Tetris.boxes[4, 0] + Tetris.boxes[5, 0] + Tetris.boxes[6, 0]) > 0)
					return true;
				Tetris.boxes[4][0] = Tetris.boxes[5][0] = Tetris.boxes[6][0] = 6;
				Tetris.currentBlock = {
					type: 6,
					points: [[[4, 0]], [[5, 0], [5, -1]], [[6, 0]]]
				};
				return false;
			}, 
            indexer: null,
            getRelativeCoordinate: function() {
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(4);
                var that = this;
                var relativeCoordinates = [
                    {
                        collisionDetection: {
                            coordinates: [[1, 1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0]],
                            after: [[1, 1]]
                        },
                        /**
                         * 根据给定的第一列最下点的坐标生成新的活动方块坐标
                         */
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x + 1, y + 1], [x + 1, y], [x + 1, y - 1]], [[x + 2, y]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: true,
                                    distance: -1
                                }
                            ],
                            coordinates: [[-1, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, -2]],
                            after: [[-1, -1]]
                        }, 
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x - 1, y - 1]], [[x, y], [x, y - 1]], [[x + 1, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            coordinates: [[1, -1]]
                        },
                        changedCoordinates: {
                            before: [[2, 0]],
                            after: [[1, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y]], [[x + 1, y + 1], [x + 1, y], [x + 1, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: false,
                                    distance: 2
                                }
                            ],
                            coordinates: [[2, 0]]
                        },
                        changedCoordinates: {
                            before: [[1, 1]],
                            after: [[2, 0]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x, y]], [[x + 1, y], [x + 1, y - 1]], [[x + 2, y]]];
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
			img: "",
			add: function() {
				if ((Tetris.boxes[5][0] + Tetris.boxes[6][0]) > 0)
					return true;
				Tetris.boxes[5][0] = Tetris.boxes[6][0] = 7;
				Tetris.currentBlock = {
					type: 7,
					points: [[[4, -1]], [[5, 0], [5, -1]], [[6, 0]]]
				};
				return false;
			},
            indexer: null,
            getRelativeCoordinate: function() {
                if (!this.indexer) this.indexer = Tetris.utils.newIndexer(2);
                var that = this;
                var relativeCoordinates = [
                    {
                        collisionDetection: {
                            coordinates: [[2, 0], [2, -1]]
                        },
                        changedCoordinates: {
                            before: [[0, 0], [2, 1]],
                            after: [[2, 0], [2, -1]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x + 1, y + 1], [x + 1, y]], [[x + 2, y], [x + 2, y - 1]]];
                        },
                        decreaseIndex: null
                    },
                    {
                        collisionDetection: {
                            collision: [
                                {
                                    isLeft: true,
                                    distance: -1
                                }
                            ],
                            coordinates: [[-1, -1], [1, 0]]
                        },
                        changedCoordinates: {
                            before: [[1, -1], [1, -2]],
                            after: [[-1, -1], [1, 0]]
                        },
                        rebuildCurrentPoints: function(x, y) {
                            return [[[x - 1, y - 1]], [[x, y], [x, y - 1]], [[x + 1, y]]];
                        }
                    }
                ];
                return Tetris.utils.returnHelper.call(that, relativeCoordinates);
            }
		}
    },
	//坐标地图
	boxes: [],
	/**
	 * 开始游戏:
	 * 1. 初始化方块图片对象
	 * 2. 初始化方格二维数组
	 * 3. 初始化画笔对象
	 * 4. 生成一个方块
	 * 5. 启动重绘
	 * 6. 监听键盘事件
	 */
	start: function() {
		//初始化形状对象
		/*for (var i = 1;i < 8;i ++) {
			var img = new Image();
			img.src = i + ".png";
			shapes[i] = img;
		}*/
		//初始化方格二维数组
		var arr;
		for (var i = 0;i < Tetris.boxNum.cols;i ++) {
			arr = Tetris.boxes[i] = [];
			for (var j =  0;j < Tetris.boxNum.rows;j ++) {
				arr[j] = 0;
			}
		}
		//初始化画笔对象
		var canvas = document.getElementById("main-canvas");
		Tetris.brush = canvas.getContext("2d");
		//TODO 删除
		Tetris.brush.fillStyle="#FF0000";
		//生成一个方块
		Tetris.addBlock();
		Tetris.refresh(true);
		//启动重绘
		Tetris.utils.resetThread();
		document.addEventListener("keydown", function(e) {
			Tetris.handleKeyEvent(e.keyCode);
		}, false);
	},
	/**
	 * 处理键盘按下时间
	 * @param keyCode 键码
	 */
	handleKeyEvent: function (keyCode) {
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
				Tetris.pause();
				break;
		}
	},
	/**
	 * 刷新重绘
	 * @param flag 如果为true，那么表示刚增加了方块，不需要移动
	 */
	refresh: function(flag) {
		if (!flag)
			Tetris.moveBlock();
		for (var i = 0;i < Tetris.boxNum.cols;i ++) {
			for (var j =  0;j < Tetris.boxNum.rows;j ++) {
				var n;
				if ((n = Tetris.boxes[i][j]) > 0) {
					//brush.drawImage(shapes[n], 0, 0);
					Tetris.brush.fillRect(i * Tetris.boxSize, j * Tetris.boxSize, Tetris.boxSize, Tetris.boxSize);
				} else {
					Tetris.brush.clearRect(i * Tetris.boxSize, j * Tetris.boxSize, Tetris.boxSize, Tetris.boxSize);
				}
			}
		}
	},
	/**
	 * 将当前的活动方块下移一行
	 */
	moveBlock: function () {
		//逐列检查第一个box下方是否有box
		var points = Tetris.currentBlock.points, i, j, cols, p, n, rows = Tetris.boxNum.rows,
			type = Tetris.currentBlock.type;
		for (i = 0, cols = points.length; i < cols; i++) {
			p = points[i][0];
			if ((n = p[1] + 1) >= rows || Tetris.boxes[p[0]][n] > 0) {
				Tetris.blockDead();
				return;
			}
		}
		//下移
		var l, a;
		for (i = 0, cols = points.length; i < cols; i++) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				a = p[1] + 1;
				if (a >= 0)
					Tetris.boxes[p[0]][a] = +type;
				if (a > 0)
					Tetris.boxes[p[0]][p[1]] = 0;
				p[1] = a;
			}
		}
	},
	/**
	 * 处理左箭头按下事件，向左移动
	 */
	moveLeft: function () {
		var points = Tetris.currentBlock.points;
		if (points[0][0][0] === 0) return;
		var i, j, cols, l, p;
		for (i = 0, cols = points.length; i < cols; i++) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				if (p[1] >= 0) {
					Tetris.boxes[p[0] - 1][p[1]] = Tetris.boxes[p[0]][p[1]];
					Tetris.boxes[p[0]][p[1]] = 0;
				}
				p[0]--;
			}
		}
		Tetris.refresh(true);
	},
	/**
	 * 处理右箭头按下事件，向右移动
	 */
	moveRight: function() {
		var points = Tetris.currentBlock.points,
			cols = points.length;
		if (points[cols - 1][0][0] === Tetris.boxNum.cols - 1) return;
		var i, j, l, p;
		for (i = cols - 1; i >= 0; i--) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				if (p[1] >= 0) {
					Tetris.boxes[p[0] + 1][p[1]] = Tetris.boxes[p[0]][p[1]];
					Tetris.boxes[p[0]][p[1]] = 0;
				}
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
			cols = points.length, i, j, l, p, deep, minDepth = 20, rows = Tetris.boxNum.rows;
		//寻找每一列可以下落的最小值
		for (i = 0; i < cols; i++) {
			//每一列的第一行坐标
			p = points[i][0];
			deep = p[1] + 1;
			while (deep < rows && Tetris.boxes[p[0]][deep] === 0)
				++deep;
			deep -= (p[1] + 1);
			minDepth = deep < minDepth ? deep : minDepth;
		}
		//向下移动minDepth个单位
		if (minDepth === 20) return;
		for (i = 0; i < cols; i++) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				Tetris.boxes[p[0]][p[1] + minDepth] = Tetris.boxes[p[0]][p[1]];
				Tetris.boxes[p[0]][p[1]] = 0;
			}
		}
		Tetris.refresh(true);
	},
	/**
	 * 方块变形
	 */
	transform: function () {
		var type = +Tetris.currentBlock.type;
		if (type === 4) return;
		//Tetris.shapes[type].transform();
        var relativeCoordinate = Tetris.shapes[type].getRelativeCoordinate(), o,
            points = Tetris.currentBlock.points, p = points[0][0], x = p[0], y = p[1], i, l, p;
        //检测边缘
        if (o = relativeCoordinate.collisionDetection.collision) {
            for (i = 0, l = o.length; i < l; i++) {
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
        for (i = 0, l = o.length; i < l; i++) {
            p = o[i];
            if (Tetris.boxes[x + p[0]][y + p[1]]  > 0) {
                relativeCoordinate.decreaseIndex();
                return;
            }
        }
        //移动方格
        o = relativeCoordinate.changedCoordinates;
        for (i = 0, l = o.before.length; i < l; i++) {
            p = o.after[i];
            Tetris.boxes[x + p[0]][y + p[1]] = type;
            p = o.before[i];
            Tetris.boxes[x + p[0]][y + p[1]] = 0;
        }
        //重建活动方块坐标
        Tetris.currentBlock.points = relativeCoordinate.rebuildCurrentPoints(x, y);
		Tetris.refresh(true);
	},
	/**
	 * 暂停
	 */
	pause: function () {

	},
	/**
	 * 方块无法继续向下移动
	 * 1. 添加一个新的方块
	 * 2. 确定下一块，并显示出来
	 */
	blockDead: function () {

	},
    /**
     * 在顶部生成一个新的方块
     */
    addBlock: function() {
		//var type = Tetris.utils.getRandomInt(1, 8);
		//var next = Tetris.utils.getRandomInt(1, 8);
		var type = 3, next = 3;
		Tetris.setNextBlock(next);
		if (Tetris.shapes[type].add())
			Tetris.gameOver();
	},
	/**
	 * 绘制下一个方块示意图
	 * @param type 方块类型
	 */
    setNextBlock: function(type) {
        
    },
	/**
	 * 游戏结束
	 * TODO
	 */
	gameOver: function () {

	},
    //工具方法集合
    utils: {
		/**
		 * 生成一个[min, max)之间的整数
		 * @param min 最小值
		 * @param max 最大值
		 * @returns {integer} 随机数
		 */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
		/**
		 * [[逐级提高游戏速度]]
		 */
		resetThread: function() {
			clearInterval(Tetris.currentIntervalID);
			//简单的每次速度加倍
			Tetris.refreshInterval /= 2;
			Tetris.currentIntervalID = setInterval(Tetris.refresh, Tetris.refreshInterval);
		},
        /**
         * [[为方块的变形建立索引]]
         * @param   {[[Integer]]} types [[方块变形的种数]]
         * @returns {object}   [[索引对象]]
         */
        newIndexer: function(types) {
            var index = 0;
            return {
                next: function() {
                    var i = index;
                    index++;
                    index = index == types ? 0 : index;
                    return i;
                },
                decrease: function() {
                    index = index == 0 ? types - 1 : (--index);
                }
            };
        },
        returnHelper: function(relativeCoordinates) {
            var t = relativeCoordinates[this.indexer.next()];
            t.decreaseIndex = this.indexer.decrease;
            return t;
        }
    }
};