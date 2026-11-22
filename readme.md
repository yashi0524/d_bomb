# 末日炸彈 v0.1

> 貓咪逃出殭屍列車的瀏覽器遊戲  
> 純前端 · 無需安裝 · 支援電腦與手機

🎮 **Play**: https://yashi0524.github.io/d_bomb/

---

## 檔案結構

| 檔案 | 說明 |
|---|---|
| `index.html` | 標題/選擇畫面（GitHub Pages 入口） |
| `game.html` | 遊戲頁面骨架（DOM），載入下列檔案（由 index.html 跳轉） |
| `scene.js` | 場景：地圖生成、戰爭迷霧/視線、玩家、鑰匙/手槍/出口、`GameScene` 核心 |
| `enemy.js` | 敵人：殭屍、火車、安全/追捕階段、被抓判定、射擊（以 mixin 擴充 `GameScene`） |
| `ui.js` + `ui.css` | UI：佈局、頂端列、小地圖、道具欄、虛擬搖桿/按鈕、`launch` / `resetGame` |
| `assets_v2.4.js` | 所有角色/物件貼圖（Canvas 2D 手繪） |

---

## 遊戲說明

- 用 **WASD**（或虛擬搖桿）移動貓咪
- 找到地圖上的 🔑 **鑰匙**，再抵達 **EXIT** 出口即過關
- 殭屍每回合從火車衝出，越來越多
- **F 鍵**（或 🚪 按鈕）：躲入附近衣櫃，最多 5 秒
- **空白鍵**（或 ⬆️ 按鈕）：跳躍，可閃過殭屍
- 撿到 🔫 **手槍**：1 發子彈，可擊退殭屍

### 解析度選擇

| 模式 | 尺寸 | 適合 |
|---|---|---|
| A | 800 × 480 | 電腦、iPad 橫向 |
| B | 400 × 640 | iPhone、iPad 直立 |

---

## 改版歷史

### v0.1
- 專案更名為「末日炸彈」，自 [z_train](https://github.com/yashi0524/z_train) v4.9 為基底
- 程式拆分為 `scene.js` / `enemy.js` / `ui.js` + `ui.css`

---

## 技術棧

- [Phaser 3.60](https://phaser.io/) — 遊戲引擎（Arcade Physics）
- Canvas 2D — 所有貼圖手繪（assets_v2.4.js）
- 純 HTML / CSS / JS，無後端，可直接 GitHub Pages 部署

---

*MIT License · yashi0524*
