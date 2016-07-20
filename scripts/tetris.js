
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
				if (Tetris.boxes[0][col] > 0)
					return true;
				Tetris.boxes[0][col] = 1;
				Tetris.currentBlock = {
					type: 1,
					points: [[[0, 5], [-1, 5], [-2, 5], [-3, 5], [-4, 5]]]
				};
				return false;
            }
        },
		// |__
		2: {
			img: "",
			add: function() {
				if ((Tetris.boxes[0][4] + Tetris.boxes[0][5] + Tetris.boxes[0][6]) > 0)
					return true;
				Tetris.boxes[0][4] = Tetris.boxes[0][5] = Tetris.boxes[0][6] = 2;
				Tetris.currentBlock = {
					type: 2,
					points: [[[0, 4], [-1, 4]], [[0, 5]], [[0, 6]]]
				};
				return false;
			}
		},
		// __|
		3: {
			img: "",
			add: function() {
				if ((Tetris.boxes[0][4] + Tetris.boxes[0][5] + Tetris.boxes[0][6]) > 0)
					return true;
				Tetris.boxes[0][4] = Tetris.boxes[0][5] = Tetris.boxes[0][6] = 3;
				Tetris.currentBlock = {
					type: 3,
					points: [[[0, 4]], [[0, 5]], [[0, 6], [-1, 6]]]
				};
				return false;
			}
		},
		//田
		4: {
			img: "",
			add: function() {
				if ((Tetris.boxes[0][5] + Tetris.boxes[0][6]) > 0)
					return true;
				Tetris.boxes[0][5] = Tetris.boxes[0][6] = 4;
				Tetris.currentBlock = {
					type: 4,
					points: [[[0, 5], [-1, 5]], [[0, 6], [-1, 6]]]
				};
				return false;
			}
		},
		//    __
		// __|
		5: {
			img: "",
			add: function() {
				if ((Tetris.boxes[0][5] + Tetris.boxes[0][6]) > 0)
					return true;
				Tetris.boxes[0][5] = Tetris.boxes[0][6] = 5;
				Tetris.currentBlock = {
					type: 5,
					points: [[[0, 5]], [[0, 6], [-1, 6]], [[-1, 7]]]
				};
				return false;
			}
		},
		//土
		6: {
			img: "",
			add: function() {
				if ((Tetris.boxes[0, 4] + Tetris.boxes[0, 5] + Tetris.boxes[0, 6]) > 0)
					return true;
				Tetris.boxes[0, 4] = Tetris.boxes[0, 5] = Tetris.boxes[0, 6] = 6;
				Tetris.currentBlock = {
					type: 6,
					points: [[[0, 4]], [[0, 5], [-1, 5]], [[0, 6]]]
				};
				return false;
			}
		},
		//  --
 		//   |__
		7: {
			img: "",
			add: function() {
				if ((Tetris.boxes[0][5] + Tetris.boxes[0][6]) > 0)
					return true;
				Tetris.boxes[0][5] = Tetris.boxes[0][6] = 7;
				Tetris.currentBlock = {
					type: 7,
					points: [[[-1, 4]], [[0, 5], [-1, 5]], [[0, 6]]]
				};
				return false;
			}
		}
    },
	//记录哪些
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
		for (var i = 0;i < Tetris.boxNum.rows;i ++) {
			arr = Tetris.boxes[i] = [];
			for (var j =  0;j < Tetris.boxNum.cols;j ++) {
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
		for (var i = 0;i < Tetris.boxNum.rows;i ++) {
			for (var j =  0;j < Tetris.boxNum.cols;j ++) {
				var n;
				if ((n = Tetris.boxes[i][j]) > 0) {
					//brush.drawImage(shapes[n], 0, 0);
					Tetris.brush.fillRect(j * Tetris.boxSize, i * Tetris.boxSize, Tetris.boxSize, Tetris.boxSize);
				} else {
					Tetris.brush.clearRect(j * Tetris.boxSize, i * Tetris.boxSize, Tetris.boxSize, Tetris.boxSize);
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
			if ((n = p[0] + 1) >= rows || Tetris.boxes[n][p[1]] > 0) {
				Tetris.blockDead();
				return;
			}
		}
		//下移
		var l, a;
		for (i = 0, cols = points.length; i < cols; i++) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				a = p[0] + 1;
				if (a >= 0)
					Tetris.boxes[a][p[1]] = +type;
				if (a > 0)
					Tetris.boxes[p[0]][p[1]] = 0;
				p[0] = a;
			}
		}
	},
	/**
	 * 处理左箭头按下事件，向左移动
	 */
	moveLeft: function () {
		var points = Tetris.currentBlock.points;
		if (points[0][0][1] === 0) return;
		var i, j, cols, l, p;
		for (i = 0, cols = points.length; i < cols; i++) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				if (p[0] >= 0) {
					Tetris.boxes[p[0]][p[1] - 1] = Tetris.boxes[p[0]][p[1]];
					Tetris.boxes[p[0]][p[1]] = 0;
				}
				p[1]--;
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
		if (points[cols - 1][0][1] === Tetris.boxNum.cols - 1) return;
		var i, j, l, p;
		for (i = cols - 1; i >= 0; i--) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				if (p[0] >= 0) {
					Tetris.boxes[p[0]][p[1] + 1] = Tetris.boxes[p[0]][p[1]];
					Tetris.boxes[p[0]][p[1]] = 0;
				}
				p[1]++;
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
			deep = p[0] + 1;
			while (deep < rows && Tetris.boxes[deep][p[1]] === 0)
				++deep;
			deep -= (p[0] + 1);
			minDepth = deep < minDepth ? deep : minDepth;
		}
		//向下移动minDepth个单位
		if (minDepth === 20) return;
		for (i = 0; i < cols; i++) {
			for (j = 0, l = points[i].length; j < l; j++) {
				p = points[i][j];
				Tetris.boxes[p[0] + minDepth][p[1]] = Tetris.boxes[p[0]][p[1]];
				Tetris.boxes[p[0]][p[1]] = 0;
			}
		}
		Tetris.refresh(true);
	},
	/**
	 * 变形(顺时针)
	 */
	transform: function () {

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
		var type = Tetris.utils.getRandomInt(1, 8);
		var next = Tetris.utils.getRandomInt(1, 8);
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
		resetThread: function() {
			clearInterval(Tetris.currentIntervalID);
			//简单的每次速度加倍
			Tetris.refreshInterval /= 2;
			Tetris.currentIntervalID = setInterval(Tetris.refresh, Tetris.refreshInterval);
		}
    }
};