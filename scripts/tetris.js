
var Tetris = {
	//默认2000ms刷新一次
	refreshInterval: 2000,
	//画笔
	brush: null,
	//每个方格的大小
	boxSize: {
		width: 30,
		height: 30
	},
	boxNum: {
		rows: 20,
		cols: 10
	},
	shapes: {},
	//记录哪些
	boxes: [],
	init: function () {
        "use strict";
		//初始化形状对象
		/*for (var i = 1;i < 8;i ++) {
			var img = new Image();
			img.src = i + ".png";
			shapes[i] = img;
		}*/
		var arr, i, j;
		for (i = 0; i < Tetris.boxNum.rows; i++) {
			arr = Tetris.boxes[i] = [];
			for (j =  0;j < Tetris.boxNum.cols - 1;j ++) {
				arr[j] = 0;
			}
		}
		var canvas = document.getElementById("left");
		Tetris.brush = canvas.getContext("2d");
		//TODO 删除
		Tetris.brush.fillStyle="#FF0000";
		setInterval(Tetris.refresh, Tetris.refreshInterval);
	},
	refresh: function() {
		for (var i = 0;i < Tetris.boxNum.rows;i ++) {
			for (var j =  0;j < Tetris.boxNum.cols - 1;j ++) {
				var n;
				if ((n = Tetris.boxes[i][j]) > 0) {
					//brush.drawImage(shapes[n], 0, 0);
					Tetris.brush.fillRect((j - 1) * Tetris.boxSize, (i - 1) * Tetris.boxSize, Tetris.boxSize, Tetris.boxSize);
				}
			}
		}
	},
    /**
     * [[产生一个新的形状]]
     */
    addBox: function() {
        
    }
};

window.onload = function () {
    "use strict";
	Tetris.init();
}