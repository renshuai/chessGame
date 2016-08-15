// 存储所有黑色棋子的位置
var blackArr = [];
// 存储所有白色棋子的位置
var whiteArr = [];
// 棋盘元素
var chessBoard = document.getElementsByClassName('chess-board')[0];
// 存储棋盘相对页面的位置
var offsetLeft, offsetTop;
// 默认白棋先开始
var whichPlaying = 'white';
/*
 * 判断是否赢
 *
 * @event
 * @param {Object} event 事件对象
 */
function checkIsWin(event) {
    event = event || window.event;
    // 获取具体的位置
    var position = getPosition(event);
    // position已经有棋子
    if (blackArr.indexOf(position) > -1 || whiteArr.indexOf(position) > -1) {
        alert('already exit');
        return;
    }
    // 放置棋子
    renderPiece(position);
    if (whichPlaying === 'white') {
        whiteArr.push(position);
    } else {
        blackArr.push(position);
    }
    // 左斜方向的棋子个数
    var leftSlantNumber = getPiecesNumber(position, 'leftTop') + getPiecesNumber(position, 'rightBottom');
    // 右斜方向的棋子个数
    var rightSlantNumber = getPiecesNumber(position, 'leftBottom') + getPiecesNumber(position, 'rightTop');
    // 水平方向的棋子个数
    var horizontalNumber = getPiecesNumber(position, 'left') + getPiecesNumber(position, 'right');
    // 竖直方向的棋子个数
    var verticalNumber = getPiecesNumber(position, 'top') + getPiecesNumber(position, 'bottom');

    // 判断当前棋子4个方向是否可以连成5个
    if (leftSlantNumber >= 4
        || rightSlantNumber >= 4
        || horizontalNumber >= 4
        || verticalNumber >= 4) {

        alert(whichPlaying + ' is Wining');
        return;
    }
    // 切换旗手
    whichPlaying = whichPlaying === 'white' ? 'black' : 'white';
}

/*
 * 获取对应方向的棋子个数
 *
 * @inner
 * @param {number} position 棋子的位置
 * @param {string} direction 查找对应方向的棋子
 * @return {number} 对应方向上连续棋子的个数
 */
function getPiecesNumber(position, direction) {
    var count = 0;
    position = getRelatedPiecePosition(position, direction);
    var checkArr = whichPlaying === 'white' ? whiteArr : blackArr;
    // 棋盘位置从1-255
    while (position > 0 && position <= 225) {
        // 所在位置有棋子，保证连续
        if (checkArr.indexOf(position) > -1) {
            count++;
            position = getRelatedPiecePosition(position, direction);
        } else {
            break;
        }
    }
    return count;
}

/*
 * 获得特定方向的棋子的位置
 *
 * @inner
 * @param {number} position 参照棋子的位置
 * @param {string} direction 查找对应方向的棋子
 * @return {number} 得到相关棋子的位置
 */
function getRelatedPiecePosition(position, direction) {
    var newPosition;
    switch (direction) {
        case 'leftTop':
            newPosition = position - 16;break;
        case 'top':
            newPosition = position - 15;break;
        case 'rightTop':
            newPosition = position - 14;break;
        case 'left':
            newPosition = position - 1;break;
        case 'right':
            newPosition = position + 1;break;
        case 'leftBottom':
            newPosition = position + 14;break;
        case 'bottom':
            newPosition = position + 15;break;
        case 'rightBottom':
            newPosition = position + 16;break;
    }
    return newPosition;
}

/*
 * 渲染对应位置的棋子
 *
 * @inner
 * @param {number} position 渲染棋子的位置
 */
function renderPiece(position) {
    var piece = document.createElement('div');
    piece.className = whichPlaying === 'white' ? 'chess-piece white' : 'chess-piece black';
    // 一行15个位置，1为table的border，30为每一个各自的宽高，10为棋子本身尺寸的一半
    var pieceLeft = (position % 15 - 1) * 30 + 1 - 10;
    var pieceTop = Math.floor(position / 15) * 30 + 1 - 10;
    piece.style.left = pieceLeft + 'px';
    piece.style.top = pieceTop + 'px';
    chessBoard.appendChild(piece);
}

/*
 * getPosition 根据鼠标点击坐标获取位置
 *
 * @inner
 * @param {Object} event 鼠标事件对象
 */
function getPosition(event) {
    var offsetX = event.x - offsetLeft - 1;
    var offsetY = event.y - offsetTop - 1;
    // 对于靠近位置，进行就近点寻找,靠近左侧取左边位置
    var XPostion = Math[(offsetX % 30) < 15 ? 'floor' : 'ceil'](offsetX / 30) + 1;
    var YPosition = Math[(offsetY % 30) < 15 ? 'floor' : 'ceil'](offsetY / 30);
    // 将坐标位置与位置数字对应
    var position = YPosition * 15 + XPostion;
    return position;
}

// 用到的一些兼容事件
var Event = {
    getEvent: function (event) {
        return event || window.event;
    },
    addEvent: function (type, callback, element) {
        if (element.addEventListener) {
            element.addEventListener(type, callback, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, callback);
        } else {
            element['on' + type] = callback;
        }
    },
    removeEvent: function (type, callback, element) {
        if (element.removeEventListener) {
            element.removeEventListener(type, callback, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, callback);
        } else {
            element['on' + type] = null;
        }
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
}

/*
 * playBtnCallback 开始游戏事件
 *
 * @inner
 * @param {Object} event 鼠标事件对象
 */
function playBtnCallback(event) {
    var event = Event.getEvent();
    var target = Event.getTarget(event);
    if (target.innerHTML === '开始游戏') {
        Event.addEvent('click', checkIsWin, chessBoard);
        target.innerHTML = '暂停游戏';
        target.className = 'pause';
    } else {
        Event.removeEvent('click', checkIsWin, chessBoard);
        target.innerHTML = '开始游戏';
        target.className = 'play';
    }
    // 防止冒泡触发棋盘点击事件
    Event.stopPropagation(event);
}

/*
 * initEvent 初始化事件
 *
 * @inner
 */
function initEvent() {
    var playBtn = document.getElementById('playBtn');
    // 开始游戏点击绑定事件
    Event.addEvent('click', playBtnCallback, playBtn);
    // 页面窗口大小调整，页面中棋盘相对位置重新获取
    Event.addEvent('resize', function () {
        offsetLeft = chessBoard.offsetLeft;
        offsetTop = chessBoard.offsetTop;
    }, window);
}

/*
 * init 初始化页面信息
 *
 * @outer
 */
function init() {
    initEvent();
    // 初始化获得快照，防止重绘和重排
    offsetLeft = chessBoard.offsetLeft;
    offsetTop = chessBoard.offsetTop;
}

// 页面入口
init();

