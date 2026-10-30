# RPG Maker MZ - CPM 立繪預覽工具 (Web 版)

專門為 **RPG Maker MZ** 的立繪外掛 **CharacterPictureManager (CPM)** 設計的純前端可視化立繪預覽與腳本產生器。

無需安裝任何桌面環境或後端伺服器，直接在瀏覽器選取本機專案目錄，即可即時組裝立繪並產生控制腳本。

---

## 🌐 線上使用

- **線上網址**：[https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/](https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/)
- **建議瀏覽器**：Google Chrome、Microsoft Edge 或相容 Chromium 並開放 File System Access API 的瀏覽器。

---

## ✨ 核心特色與功能

1. **直接讀取本機專案目錄**
   - 透過瀏覽器安全 API (`showDirectoryPicker`) 直接讀取本機 RPG Maker 專案根目錄。
   - 純本機記憶體即時繪製，**不消耗流量、不將任何遊戲資產或外掛程式碼上傳至伺服器**。

2. **自動解析 CPM 外掛設定**
   - 自動讀取 `js/plugins.js` 中 `CharacterPictureManager` 的設定與動態路徑（`DynamicFileName`）。
   - 自動提取 `{variable:XX}` 控制變數，並依外掛內定義之名稱建立對應面板清單。

3. **支援圖集切片與散圖目錄雙軌渲染**
   - **TexturePacker 圖集模式**：自動載入 `img/pictures/` 下的 `.json` 切片定義與圖集圖片。
   - **多層子目錄散圖模式**：自動遞迴讀取如 `pictures/cha0/hair/43_0.png` 結構的實體圖檔。

4. **即時視圖調整與腳本匯出**
   - 支援畫布縮放（Scale）、偏 X、偏 Y 視角調整。
   - 勾選需要的變數項目，自動產生 `DCvar({...});` 調用腳本。
   - 超過字元上限時，支援一鍵下載 `.txt` 檔案，方便快速匯入事件執行。

---

## 🚀 使用步驟

1. 使用 **Chrome** 或 **Edge** 開啟 [線上工具頁面](https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/)。
2. 點擊頂部的 **「📁 選擇 RPG Maker 專案目錄」**。
3. 選取包含 `js/` 與 `img/` 的 **RPG Maker 專案根目錄**，並在瀏覽器提示中確認「檢視權限」。
4. 於左側控制面板調整各部位變數數值（支援輸入或 `+` / `-` 按鈕調節），右側畫布即時渲染。
5. 勾選需導出的變數，於下方點擊 **「複製腳本」** 取得 `DCvar` 指令。

---

## 🛠️ 本地管線工具 (D_LoadTools) 下載與說明

立繪預覽工具已全面雲端化，若需執行**涉及專案資料庫寫回、對白 Log 處理與腳本替換**的工具，因安全考量保留為本機端工具執行。

👉 **[前往 Releases 下載 D_LoadTools 本機工具包 (7z)](https://github.com/DCodeGames/RPGmakerMZ-cpm-viewer/releases)**

### 📦 包含工具
* **對白日誌處理工具 (Log Utility)**：讀取專案事件與對白文本，支援批次導出與寫回。
* **腳本資料替換工具 (Script Utility)**：支援安全寫回與自動備份機制。

> **⚠️ 注意事項**：
> 1. 目前版本為 `Pre-release` 測試版，僅確認基本功能可正常運行，尚未進行大規模極限壓力測試。
> 2. 執行任何寫回專案的工具前，**請務必先行手動備份專案的 `data/` 資料夾**。
