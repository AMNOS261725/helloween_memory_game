/* IDとクラスの読み込み */
const cards = document.getElementsByClassName("card");
const clearMessage = document.getElementById("clear_message");
const clearArea = document.getElementById("clear_area");
const cardGrid = document.getElementsByClassName("card_grid")[0];
const startButton = document.getElementById("start_button");
const resetButton = document.getElementById("reset_button");
const opening = document.getElementsByClassName("opening")[0];

/* 2枚めくったを覚えておくための箱 */
let firstCard = null;
let secondCard = null;

/* カードを判定中かどうか覚えておくための箱 */
let isChecking = false;

/* そろったペアの数を覚えておく箱 */
let matchedPairs = 0;

/* ゲームがスタートしているか覚えておく箱 */
let gameStarted = false;

/* --------------------オープニング-------------------- */

/* オープニング画像表示の後、2秒待ってから0.8秒かけてフェードアウト */
setTimeout(function () {
  opening.classList.add("opening_fade");
}, 4000);

setTimeout(function () {
  opening.style.display = "none";
}, 4800);

/* --------------------カードを隠す-------------------- */
for (let i = 0; i < cards.length; i++) {
  cards[i].classList.add("card_hidden");
}

/* --------------------ボタンの機能-------------------- */

/* STARTボタンが押されたら{}の処理を実行する */
startButton.addEventListener("click", function () {
  /* カードをシャッフル */
  shuffleCards();
  /* 18枚を1枚ずつ処理 */
  for (let i = 0; i < cards.length; i++) {
    /* 0.1秒ずつ時間差をつける */
    setTimeout(function () {
      cards[i].classList.remove("card_hidden");

      /* 今出たのが18枚目だったらSTARTクリック解禁 */
      if (i === cards.length - 1) {
        gameStarted = true;
      }
    }, i * 100);
  }
});

/* RESETボタンが押されたら{}の処理を実行する */
resetButton.addEventListener("click", function () {
  /* RESETボタン押したらカード触れない */
  gameStarted = false;
  /* 2枚覚えていた箱の中を空っぽに */
  firstCard = null;
  secondCard = null;
  isChecking = false;
  /* そろったペアの数を覚えていた箱の中を空っぽに */
  matchedPairs = 0;
  /* 18枚裏向きになる */
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("card_is_flipped");
    /* カードそのものを隠す */
    cards[i].classList.add("card_hidden");
  }
  /* シャッフル */
  shuffleCards();

  /* クリアしたときのぼかしを元に戻す */
  cardGrid.classList.remove("clear_blur");
  /* クリア画像を隠す */
  clearArea.style.display = "none";
});

/* --------------------ランダムに振り分ける-------------------- */

/* 18枚をシャッフルするときに使用済みのインデックス番号を覚えておく */
let usedNumbers = [];

function shuffleCards() {
  usedNumbers = [];

  /* 1枚ずつ順番に処理をする */
  for (let i = 0; i < cards.length; i++) {
    /* 0~17のランダムな数字を割り振る */
    let randomNumber = Math.floor(Math.random() * cards.length);

    /* 条件が当てはまっている限り処理を繰り返す
    使用済みの番号が出たらもう一回番号を割り振る */
    while (usedNumbers.includes(randomNumber)) {
      randomNumber = Math.floor(Math.random() * cards.length);
    }

    /* 記憶する箱の配列の中に入る番号をどんどん増やしていく */
    usedNumbers.push(randomNumber);

    /* カードの並び順を割り振ったランダムの番号にする */
    cards[i].style.order = randomNumber;
  }
}
/* --------------------カードがめくれる-------------------- */

/* 1枚ずつ順番に処理をする */
for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {
    console.log(gameStarted);

    /* STARTボタン押す前はめくれない */
    if (gameStarted === false) {
      return;
    }

    /* isCheckingがfalseのときカードはめくれる
isCheckingがtrueのときカードはめくれない */
    if (isChecking === true) {
      return;
    }

    /* 3枚目めくれないように */
    if (secondCard !== null) {
      return;
    }

    /* １枚目と同じカードを押したら処理終了
    別のカード(絵柄が同じのも)を押したら2枚目として記録 */
    if (firstCard === cards[i]) {
      return;
    }

    cards[i].classList.add("card_is_flipped");

    /* 2枚覚える */
    if (firstCard === null) {
      firstCard = cards[i];
    } else {
      secondCard = cards[i];

      /* 2枚覚える箱に2枚目がはいって今から合ってるのかの判定をするから
めくるのストップ */
      isChecking = true;

      /* 1枚目と2枚目が同じかみる */
      if (firstCard.dataset.card === secondCard.dataset.card) {
        console.log("あたり");

        /* matchedPairsの数字をあたりの度1増やす */
        matchedPairs++;

        /* matchedPairsの数字が9になったらコンソールにCLEAR!と
        画面に画像を表示 */
        if (matchedPairs === 9) {
          setTimeout(function () {
            cardGrid.classList.add("clear_blur");
            clearArea.style.display = "block";
          }, 500);
        }

        /* 2枚覚える箱の中を空っぽにして次のカードをめくれるようにする */
        firstCard = null;
        secondCard = null;
        isChecking = false;
      } else {
        console.log("はずれ");

        /* 今すぐじゃなくてちょっと待ってから処理 */
        setTimeout(function () {
          /* 180度回るクラスを外す(1枚目も2枚目も) */
          firstCard.classList.remove("card_is_flipped");
          secondCard.classList.remove("card_is_flipped");

          /* 2枚覚える箱の中を空っぽにして次のカードをめくれるようにする */
          firstCard = null;
          secondCard = null;
          isChecking = false;
        }, 1000); /* 1秒待つ */
      }
    }
  });
}
