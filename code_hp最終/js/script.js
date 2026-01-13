// ハンバーガーメニュー開閉
const menuBtn = document.getElementById('menu-btn');
const navUl = document.querySelector('.nav ul');

menuBtn.addEventListener('click', () => {
    navUl.classList.toggle('active');
    menuBtn.classList.toggle('active'); // ここを追加
});
// スライダー要素と左右ボタンを取得
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

// 左ボタンをクリックしたとき
prevBtn.addEventListener('click', () => {
    slider.scrollBy({
        left: -slider.offsetWidth,
        behavior: 'smooth'
    });
});

// 右ボタンをクリックしたとき
nextBtn.addEventListener('click', () => {
    slider.scrollBy({
        left: slider.offsetWidth,
        behavior: 'smooth'
    });
});