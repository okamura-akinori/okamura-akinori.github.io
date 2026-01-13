/* スマホファースト LP — バニラ JS */
/* DOMContentLoaded で初期化 */
document.addEventListener('DOMContentLoaded', function () {
  // 年
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ================================================================
 * ハンバーガーメニュー & ドロワーメニュー（開く処理）
 * ================================================================ */

  /* ------------------------------------------------
   * ① 必要なHTML要素を取得
   * ------------------------------------------------ */

  // ハンバーガーボタン（≡ のアイコン）
  const hamburger = document.getElementById('hamburger');

  // 右からスライドして出てくるメニュー本体
  const drawer = document.getElementById('drawer');

  // 背景を暗くする黒い半透明のレイヤー
  const backdrop = document.getElementById('drawerBackdrop');

  // ドロワーメニュー内のリンク一覧
  const drawerLinks = document.querySelectorAll('.drawer-link');


  /* ================================================================
   * ドロワーメニューを「開く」処理
   * ================================================================ */
  function openDrawer() {

    /* --------------------------------------------
     * ② ドロワーを画面内にスライドさせる
     * -------------------------------------------- */
    // CSSで transform: translateX(110%) などで
    // 画面外に隠してある前提
    // → 0 にすると画面内に入る
    drawer.style.transform = 'translateX(0)';

    /* --------------------------------------------
     * ③ 背景（backdrop）を表示する
     * -------------------------------------------- */
    // hidden = false → display:none 状態を解除
    backdrop.hidden = false;

    // 透明度を 1 にして、暗い背景を表示
    backdrop.style.opacity = '1';

    /* --------------------------------------------
     * ④ アクセシビリティ用の属性を更新
     * -------------------------------------------- */

    // メニューが「見えている」状態だと伝える
    drawer.setAttribute('aria-hidden', 'false');

    // ハンバーガーボタンが「開いている」状態だと伝える
    hamburger.setAttribute('aria-expanded', 'true');
  }

  // Drawer（ドロワー）を閉じるときに行う処理
  function closeDrawer() {
    // 閉じるときは必ず「右方向（画面外の右）」へ戻す（+100%）
    drawer.style.transform = 'translateX(110%)'; // ← ここを -110%（左） から 100%右 に変更
    // ② 背景の黒い半透明（backdrop）を薄くしていく → フェードアウト
    backdrop.style.opacity = '0';
    // ③ フェードアウトの時間（0.2秒）後に 完全に非表示 にする // hidden = true → 要素が画面上から消える
    setTimeout(() => backdrop.hidden = true, 220);
    // ④ ARIA属性を更新して、スクリーンリーダーに「閉じたよ」と伝える　　　　（なくても見た目一緒）
    drawer.setAttribute('aria-hidden', 'true');
    // ⑤ ハンバーガーメニューの状態も閉じたことにする　　　　　　　　（　なくても見た目一緒）
    hamburger.setAttribute('aria-expanded', 'false');
  }

  /* ================================================================
  * ハンバーガーメニューの操作処理
  * ・開く／閉じるの切り替え
  * ・背景クリックで閉じる
  * ・メニュー内リンククリック時の処理
  * ================================================================ */


  /* ------------------------------------------------
   * ① ハンバーガーボタンをクリックしたとき
   * ------------------------------------------------ */
  hamburger.addEventListener('click', function () {

    /* --------------------------------------------
     * 現在メニューが開いているかを判定
     * -------------------------------------------- */
    // aria-expanded="true" → 開いている
    // aria-expanded="false" → 閉じている
    const expanded =
      hamburger.getAttribute('aria-expanded') === 'true';

    /* --------------------------------------------
     * 状態に応じて開閉を切り替える
     * -------------------------------------------- */
    if (expanded) {
      // すでに開いている → 閉じる
      closeDrawer();
    } else {
      // 閉じている → 開く
      openDrawer();
    }
  });


  /* ------------------------------------------------
   * ② 背景（半透明の黒）をクリックしたとき
   * ------------------------------------------------ */
  // ドロワー外をクリックしたら閉じる
  backdrop.addEventListener('click', closeDrawer);


  /* ------------------------------------------------
   * ③ ドロワーメニュー内のリンクをクリックしたとき
   * ------------------------------------------------ */
  drawerLinks.forEach(a =>
    a.addEventListener('click', function (e) {

      /* ------------------------------------------
       * ① まずドロワーを閉じる
       * ------------------------------------------ */
      // ページ遷移やスクロール前に閉じる
      closeDrawer();

      /* ------------------------------------------
       * ② リンク先（href）を取得
       * ------------------------------------------ */
      const href = this.getAttribute('href');

      /* ------------------------------------------
       * ③ ページ内リンク（#〜）の場合のみ処理
       * ------------------------------------------ */
      if (href && href.startsWith('#')) {

        // 通常のジャンプ（カクッと飛ぶ）を止める
        e.preventDefault();

        // 自作のスムーススクロール関数を使う
        scrollToId(href.substring(1));
        // ↑ "#section1" → "section1"
      }
    })
  );

  /* ================================================================
   * グローバルナビのリンクをスムーススクロールさせる処理
   * ================================================================ */

  // .nav-link クラスが付いたリンクをすべて取得
  document.querySelectorAll('.nav-link').forEach(a => {

    // 各リンクに「クリックされたとき」の処理を設定
    a.addEventListener('click', function (e) {

      /* ------------------------------------------------
       * ① リンク先（href属性）を取得
       * ------------------------------------------------ */
      // 例: href="#section3"
      const href = this.getAttribute('href');

      /* ------------------------------------------------
       * ② ページ内リンクかどうかを判定
       * ------------------------------------------------ */
      // ・href が存在する
      // ・「#」から始まっている（同じページ内の移動）
      if (href && href.startsWith('#')) {

        /* --------------------------------------------
         * ③ デフォルトのジャンプ動作を止める
         * -------------------------------------------- */
        // これをしないと「一瞬で飛ぶ」挙動になる
        e.preventDefault();

        /* --------------------------------------------
         * ④ スムーススクロール関数を呼び出す
         * -------------------------------------------- */
        // substring(1) → "#" を取り除く
        // "#section3" → "section3"
        scrollToId(href.substring(1));
      }
    });
  });

  // スムーススクロール（固定ヘッダー分をオフセット）
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.getElementById('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerHeight - 12; // 少し余白
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  /* ================================================================
   * IntersectionObserver を使ったフェードイン（reveal）演出
   * ================================================================ */

  /* ------------------------------------------------
   * ① フェードインさせたい要素をすべて取得
   * ------------------------------------------------ */
  // HTML例：<div class="reveal">...</div>
  const reveals = document.querySelectorAll('.reveal');


  /* ------------------------------------------------
   * ② IntersectionObserver を作成
   * ------------------------------------------------ */
  // IntersectionObserver：
  // 「要素が画面に入ったかどうか」を自動で監視してくれる仕組み
  const io = new IntersectionObserver(

    // 画面に入った／出たときに実行される関数
    entries => {

      // 監視している要素を1つずつチェック
      entries.forEach(entry => {

        /* ------------------------------------------
         * ③ 要素が画面内に入ったか判定
         * ------------------------------------------ */
        // isIntersecting === true
        // → 画面内に表示され始めた
        if (entry.isIntersecting) {

          // 表示用クラスを付与（CSSでフェードイン）
          entry.target.classList.add('is-visible');

          /* ----------------------------------------
           * ④ 1回表示したら監視を解除
           * ---------------------------------------- */
          // スクロールで戻っても再発火しない
          // → パフォーマンスも良くなる
          io.unobserve(entry.target);
        }
      });
    },

    /* ------------------------------------------------
     * ⑤ オプション設定
     * ------------------------------------------------ */
    {
      // 要素がどれくらい見えたら発火するか
      // 0.14 = 約14%見えた時点
      threshold: 0.14
    }
  );


  /* ------------------------------------------------
   * ⑥ 取得した要素をすべて監視対象に登録
   * ------------------------------------------------ */
  reveals.forEach(r => io.observe(r));



  /* ================================================================
   * シンプルスライダーの初期化
   * ================================================================ */

  // #featureSlider を対象にスライダーを起動
  initSlider('#featureSlider', {

    // 自動再生を有効にする
    autoplay: true,

    // 6秒ごとに次のスライドへ
    interval: 6000
  });

  /* ================================================================
 * ヒーローエリアのビデオ制御 ＆ フォーム送信処理
 * ・PCでは背景動画を再生
 * ・スマホでは動画を停止して負荷軽減
 * ・お問い合わせフォームのサンプル送信処理
 * ================================================================ */


  /* ================================================================
   * ヒーロービデオの表示・再生制御
   * ================================================================ */

  const heroVideo = document.getElementById('heroVideo');
  function handleHeroMedia() {
    if (window.matchMedia('(min-width:768px)').matches) {
      // PC: ビデオを表示して再生（ミュート）
      if (heroVideo && heroVideo.readyState >= 2) {
        heroVideo.play().catch(() => {/* 自動再生ブロックの可能性 */ });
      } else if (heroVideo) {
        // 読み込み待ちでもトライ
        heroVideo.play().catch(() => { });
      }
    } else {
      // モバイル: ビデオ停止（隠れている）
      if (heroVideo) {
        heroVideo.pause();
        heroVideo.currentTime = 0;
      }
    }
  }
  // 初期とリサイズでチェック
  handleHeroMedia();
  window.addEventListener('resize', debounce(handleHeroMedia, 220));

  // フォーム送信（サンプル）
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // 実際の送信処理はここで行う（Ajax 等）
      alert('送信しました（これはサンプルです）');
      contactForm.reset();
    });
  }

}); // DOMContentLoaded end

/* ================================================================
 * ユーティリティ関数：debounce（デバウンス）
 * ・処理の実行回数を減らすための仕組み
 * ・主に resize / scroll / input イベントで使う
 * ================================================================ */

/**
 * debounce 関数
 * @param {Function} fn   実行したい処理（関数）
 * @param {number} wait   何ミリ秒待ってから実行するか
 * @returns {Function}    実行を遅らせた新しい関数
 */
function debounce(fn, wait) {

  // タイマーIDを保存しておく変数
  // setTimeout の戻り値が入る
  let t;

  // 実際にイベントに登録する「新しい関数」を返す
  return function () {

    /* --------------------------------------------
     * ① すでにセットされているタイマーを消す
     * -------------------------------------------- */
    // 連続で呼ばれても、前の予約はキャンセルする
    clearTimeout(t);

    /* --------------------------------------------
     * ② 一定時間後に fn を実行する予約をする
     * -------------------------------------------- */
    t = setTimeout(() => {

      // fn を実行
      // apply(this, arguments) にすることで
      // this と引数をそのまま引き継ぐ
      fn.apply(this, arguments);

    }, wait);
  };
}

/* ================================================================
 * シンプルなスライダー（カルーセル）機能
 * ・左右ボタン
 * ・ドットナビ
 * ・自動再生（オプション）
 * ================================================================ */

/**
 * スライダーを初期化する関数
 * @param {string} selector - スライダー全体のCSSセレクタ（例：'#featureSlider'）
 * @param {object} opts - オプション設定（自動再生など）
 */
function initSlider(selector, opts = {}) {

  /* ------------------------------------------------
   * ① スライダー全体の要素を取得
   * ------------------------------------------------ */
  const root = document.querySelector(selector);

  // 指定したセレクタが存在しなければ、何もせず終了
  if (!root) return;


  /* ------------------------------------------------
   * ② スライド関連の要素を取得
   * ------------------------------------------------ */

  // スライドを横並びにしているラッパー要素
  const slidesWrap = root.querySelector('.slides');

  // 各スライド（.slide）を配列として取得
  // NodeList → Array に変換している
  const slides = Array.from(root.querySelectorAll('.slide'));

  // 左右の矢印ボタン
  const prevBtn = root.querySelector('.slider-btn.prev');
  const nextBtn = root.querySelector('.slider-btn.next');

  // ドットを表示するエリア
  // id="sliderDots" があれば優先、なければ .slider-dots
  const dotsWrap =
    root.querySelector('#sliderDots') ||
    root.querySelector('.slider-dots');


  /* ------------------------------------------------
   * ③ スライダーの状態を管理する変数
   * ------------------------------------------------ */

  // 今表示しているスライドの番号（0から始まる）
  let index = 0;

  // 自動再生用のタイマーIDを保存する変数
  let autoplayTimer = null;

  // スライドの総数
  const slideCount = slides.length;

  // オプションで autoplay が指定されているか
  // !! をつけることで true / false に変換
  const autoplay = !!opts.autoplay;

  // 自動再生の間隔（ミリ秒）
  // 指定がなければ 4000ms（4秒）
  const interval = opts.interval || 4000;


  /* ------------------------------------------------
   * ④ ドットナビゲーションを作成
   * ------------------------------------------------ */

  // ドットを表示するエリアが存在する場合のみ実行
  if (dotsWrap) {

    // スライドの数だけドットを作る
    for (let i = 0; i < slideCount; i++) {

      // <button> 要素を新しく作成
      const d = document.createElement('button');

      // ボタンとして使う
      d.type = 'button';

      // CSS用のクラスを付与
      d.className = 'slider-dot';

      // data-index 属性にスライド番号を保存
      // 例：data-index="0"
      d.dataset.index = i;

      /* ------------------------------------------
       * ドットをクリックしたときの処理
       * ------------------------------------------ */
      d.addEventListener('click', function () {

        // data-index を数値に変換して
        // その番号のスライドへ移動
        goTo(parseInt(this.dataset.index, 10));
      });

      // 作成したドットをHTMLに追加
      dotsWrap.appendChild(d);
    }
  }
  /* ------------------------------------------ */

  /* ================================================================
  * スライド位置を更新する関数
  * ・スライドを横に動かす
  * ・ドットの active 状態を更新する
  * ================================================================ */
  function update() {

    /* --------------------------------------------
     * ① スライド1枚分の横幅を取得
     * -------------------------------------------- */
    // getBoundingClientRect().width
    // → 実際に画面上で表示されている幅（px）
    const slideWidth = slides[0].getBoundingClientRect().width;

    /* --------------------------------------------
     * ② スライド同士の gap（CSSの gap）を取得
     * -------------------------------------------- */
    // getComputedStyle → 実際に適用されているCSSを取得
    // gap は文字列なので parseFloat で数値に変換
    const gap = parseFloat(getComputedStyle(slidesWrap).gap) || 0;

    /* --------------------------------------------
     * ③ どれだけ横にずらすか計算
     * -------------------------------------------- */
    // (スライド幅 + gap) × 現在のスライド番号
    const offset = (slideWidth + gap) * index;

    /* --------------------------------------------
     * ④ スライド全体を左に動かす
     * -------------------------------------------- */
    // translateX(-○px) によって
    // 次のスライドが画面内に来る
    slidesWrap.style.transform = `translateX(-${offset}px)`;


    /* --------------------------------------------
     * ⑤ ドットナビの active 切り替え
     * -------------------------------------------- */
    // ドットが存在する場合のみ処理
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    // 現在の index と同じ番号のドットだけ active にする
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }


  /* ================================================================
   * 指定した番号のスライドへ移動する関数
   * ================================================================ */
  function goTo(i) {

    /* --------------------------------------------
     * ⑥ スライド番号を安全に補正
     * -------------------------------------------- */
    // マイナスや範囲外でも正しい番号に直す
    index = ((i % slideCount) + slideCount) % slideCount;

    // 表示更新
    update();

    // 自動再生タイマーをリセット
    restartAutoplay();
  }


  /* ================================================================
   * 前・次へ移動する関数
   * ================================================================ */

  // 1つ前のスライドへ
  function prev() {
    goTo(index - 1);
  }

  // 1つ次のスライドへ
  function next() {
    goTo(index + 1);
  }


  /* ================================================================
   * 左右ボタンのクリック処理
   * ================================================================ */

  // 前へボタンがあればイベント登録
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // 次へボタンがあればイベント登録
  if (nextBtn) nextBtn.addEventListener('click', next);


  /* ================================================================
   * 自動再生（autoplay）処理
   * ================================================================ */

  /* 自動再生を開始する */
  function startAutoplay() {

    // autoplay が false の場合は何もしない
    if (!autoplay) return;

    // 二重起動防止のため、いったん停止
    stopAutoplay();

    // 一定時間ごとに next() を実行
    autoplayTimer = setInterval(() => {
      next();
    }, interval);
  }


  /* 自動再生を停止する */
  function stopAutoplay() {

    // タイマーが存在する場合のみ停止
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }


  /* 自動再生をリスタートする */
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }


  /* ================================================================
   * マウス操作時の制御（PC向け）
   * ================================================================ */

  // マウスがスライダーに乗ったら自動再生停止
  root.addEventListener('mouseenter', stopAutoplay);

  // マウスが離れたら自動再生再開
  root.addEventListener('mouseleave', startAutoplay);


  /* ================================================================
   * 初期化処理
   * ================================================================ */

  // 最初のスライドを表示
  update();

  // 自動再生を開始
  startAutoplay();

  // 画面サイズ変更時に再計算（debounceで負荷軽減）
  window.addEventListener('resize', debounce(update, 160));
}


/* ================================================================
 * 別の簡易スライドショー（.slideshow 用）
 * ================================================================ */

// スライド要素をすべて取得
const slides = document.querySelectorAll('.slideshow .slide');

// 現在表示中のスライド番号
let current = 0;

/* 次のスライドを表示する関数 */
function showNextSlide() {

  // 今表示中のスライドを非表示
  slides[current].classList.remove('active');

  // 次の番号へ（最後なら 0 に戻る）
  current = (current + 1) % slides.length;

  // 新しいスライドを表示
  slides[current].classList.add('active');
}

// 2.5秒ごとに自動切り替え
setInterval(showNextSlide, 2500); // 

/* ================================================================
 * raindrops.js（水面エフェクト）
 * ================================================================ */
$(function () {

  // フッターの水面エフェクトを初期化
  $('#raindrop-footer').raindrops({

    // 水面の色（白）
    color: "#ffffffff"

  });
});


// フェードイン
document.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.fadein');

  const onScroll = () => {
    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 要素が画面の80%位置に入ったら表示
      if (rect.top < windowHeight * 0.8) {
        el.classList.add('is-show');
      }
    });
  };

  window.addEventListener('scroll', onScroll);
  onScroll(); // 初期表示チェック
});


/* ================================================================
 *  Map Point Modal Control
 *  マップのピンをクリックしてモーダルを表示・閉じる処理
 * ================================================================ */


/* マップ上のピンをクリックしたときの処理 */
document.querySelectorAll('.map-point').forEach(pin => {
  pin.addEventListener('click', () => {

    const id = pin.dataset.popup;
    /* data-popup 属性から、開くモーダルのIDを取得 */

    document.getElementById(id).setAttribute('aria-hidden', 'false');
    /* 対応するモーダルを表示状態にする */

    document.body.style.overflow = 'hidden';
    /* モーダル表示中は背景スクロールを禁止 */
  });
});


/* モーダル自体のクリック判定（閉じる処理） */
document.querySelectorAll('.mymodal').forEach(modal => {
  modal.addEventListener('click', e => {

    if (
      e.target.classList.contains('mymodal') ||
      e.target.classList.contains('close')
    ) {
      /* 背景部分 or 閉じるボタンをクリックした場合 */

      modal.setAttribute('aria-hidden', 'true');
      /* モーダルを非表示に戻す */

      document.body.style.overflow = '';
      /* 背景スクロールを元に戻す */
    }
  });
});

/* ================================================================
 *  Scroll Fade-In Animation
 *  IntersectionObserver を使ったスクロール表示演出
 *  対象：.fade-spot
★★★★★★★★★★★★★★★★主にスマホの名所紹介★★★★★★★★★★★★
 * ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* HTMLの読み込み完了後に実行 */

  const spots = document.querySelectorAll('.fade-spot');
  /* フェードインさせたい要素をすべて取得 */

  const observer = new IntersectionObserver(
    (entries, observer) => {
      /* 監視対象が画面に入った／出たときに呼ばれる */

      entries.forEach(entry => {
        /* 複数要素をまとめてチェック */

        if (entry.isIntersecting) {
          /* 要素が画面内に入ったら */

          entry.target.classList.add('is-visible');
          /* 表示用クラスを付与（CSSでフェードイン） */

          observer.unobserve(entry.target);
          /* 一度表示したら監視を解除
             → スクロール戻しで再発火しない */
        }
      });
    },
    {
      threshold: 0.3
      /* 要素が30%見えたら発火 */
    }
  );

  spots.forEach(spot => observer.observe(spot));
  /* すべての .fade-spot を監視対象に登録 */
});




/* =====================================
   マウスの動きに合わせて
   カーソル位置に水滴エフェクトを出す処理
   ===================================== */
document.addEventListener("mousemove", (e) => {

  // 水滴用の要素（span）を新しく作成
  const drop = document.createElement("span");

  // CSSで定義した見た目・アニメーションを適用
  drop.className = "cursor-drop";

  // マウスの現在位置を取得し、水滴の表示位置に設定
  // clientX / clientY は「画面表示領域基準」なので
  // position: fixed と相性が良い
  drop.style.left = e.clientX + "px";
  drop.style.top = e.clientY + "px";

  // body直下に追加（画面全体に表示させるため）
  document.body.appendChild(drop);

  // アニメーションが終わる頃に要素を削除
  // 要素が溜まり続けるのを防ぐための後片付け
  setTimeout(() => drop.remove(), 1000);

});