//alert( "練習用に制作された架空のサイトです\n\nグラフィックセンター新潟" );
document.addEventListener("DOMContentLoaded", function () {

  // ===== オーバーレイ =====
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.65);
	backdrop-filter: blur(10px);
    z-index:99999;
    display:flex;
    align-items:center;
    justify-content:center;
  `;

  // ===== モーダル =====
  const modal = document.createElement("div");
  modal.style.cssText = `
    background:#fff;
    padding:28px 26px;
    margin:0 24px;
    border-radius:10px;
    max-width:420px;
    width:100%;
    text-align:center;
    font-family:system-ui, -apple-system, sans-serif;
    box-shadow:0 12px 30px rgba(0,0,0,.35);
  `;

  modal.innerHTML = `
    <p style="
      font-size:15px;
      line-height:1.7;
      margin-bottom:22px;
      color:#222;
    ">
      本サイトは<br>
      <span style="
        color:#c40000;
        font-size:18px;
        font-weight:700;
      ">
        練習用に制作された架空のサイト
      </span>
      です。<br><br>

      実在する企業・店舗とは関係ありません。<br>
      お問い合わせには対応しておりません。
      <br><br>
      グラフィックセンター新潟
    </p>

    <button id="trainingCloseBtn">理解しました</button>
  `;

  // ===== ボタン装飾 =====
  const btn = modal.querySelector("#trainingCloseBtn");
  btn.style.cssText = `
    padding:10px 22px;
    font-size:14px;
    font-weight:600;
    border:none;
    border-radius:999px;
    background:#222;
    color:#fff;
    cursor:pointer;
    box-shadow:0 4px 12px rgba(0,0,0,.25);
    transition:all .15s ease;
  `;

  btn.onmouseenter = () => btn.style.background = "#444";
  btn.onmouseleave = () => btn.style.background = "#222";
  btn.onmousedown  = () => btn.style.transform = "translateY(1px)";
  btn.onmouseup    = () => btn.style.transform = "translateY(0)";

  // ===== 閉じる処理 =====
  btn.addEventListener("click", () => {
    overlay.remove();
  });

  // Escキー無効
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") e.preventDefault();
  });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
});