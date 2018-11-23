var romanWord = localStorage.romanWord || 'sushiarashi';
var types = [];
var gameEndFlg = 0;
var booktitle = null;
var startTime = 0;
var timeLeft = 0;
var timeToCountDown = 99999999 * 1000; // ミリ秒
var cntNgTypes = 0;
var cntOkTypes = 0;
var cntOkWords = 0; 
var idx = '';
var before_title = '';

function init_word() {

    jpWord = 'ローマ字変換後書籍名';
    //var [jpWord, romanWord] = selectWord(words);
    asyncProcess().then(response => {
        document.querySelector('.containerRoman').innerHTML = '';
        console.log(response + 'respon')
        types = response.split('').map(function (str) {
            var type = document.createElement('span');
            type.className = 'type';
            type.textContent = str;

            document.querySelector('.containerRoman').appendChild(type);
            document.querySelector('.containerJp').textContent = jpWord;
            return type;
        });
    });
}
function asyncProcess() {
    return new Promise((resolve, reject) => {
        firebase.database().ref(`users/${idx}`).once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {
                if (child.val === before_title) {
                    reject();
                } else {
                    resolve(jaconv.toHebon(child.val()).toLowerCase());
                }

            });
        });
    });
}

function set_title(title) {
    jpWord = 'ローマ字変換後書籍名';
    console.log('ワードリセット')
    asyncProcess().then(response => {
        document.querySelector('.containerRoman').innerHTML = '';
        types = response.split('').map(function (str) {
            var type = document.createElement('span');
            type.className = 'type';
            type.textContent = str;
            document.querySelector('.containerRoman').appendChild(type);
            document.querySelector('.containerJp').textContent = jpWord;
            return type;
        });
        before_title = response;
    });
}

function init() {
	cntNgTypes = 0;
	cntOkTypes = 0;
	cntOkWords = 0; 
	gameEndFlg = 0;
    init_word();
    timerEnd();
    document.querySelector('.timer').textContent = '書籍名をローマ字にしたもの↓'
    document.querySelector('.message').textContent = 'スペースキーで始動！';
    document.querySelector('.result').textContent = '';

}
init();

function timerStart() {
	startTime = new Date().getTime();
    booktitle = setInterval(set_title
        , 500);
	document.querySelector('.message').textContent = 'リセットするにはESCキーを入力してください。'
}

function timerEnd() {
	clearInterval(booktitle);
	booktitle = null;
}

document.addEventListener('keydown', function (event) {
    var keyCode = event.keyCode;

    if (gameEndFlg === 1) {
		if (keyCode === 27) {
            init();
			return
		} else {
			return
		}
	}

	var key = '';
	if (keyCode === 32) {
		key = ' '
	}

	if (keyCode === 189) {
		key = '-'
	}
	if (keyCode === 188) { // カンマを押したら文字列のみ初期化
	    set_title();
	}
    
	if (keyCode === 27) { //ESC押したら初期化
		init();
		return
	}
	if (key) {
		if (booktitle === null) {
			timerStart()
		}
	}
});
