# RPG Maker MZ - CPM Atlas 開發套件與立繪檢視工具集

專為 **RPG Maker MZ** 立繪外掛 **CharacterPictureManager (CPM)** 打造的整合開發環境，包含圖集擴充引擎、線上可視化立繪預覽器，以及本機專案文本與腳本處理工具。

---

## 📌 專案導覽與快速入口

1. **CPM Atlas 核心擴充與範例專案（Demo & 說明書）**
   - **線上說明書與更新日誌**：[前往閱讀 ReadMe (繁中 / 日本語 / English)](https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/ReadMe.html)
   - **範例專案與外掛下載**：[前往 Releases 下載 CPM_Atlas_v0.60](https://github.com/DCodeGames/RPGmakerMZ-cpm-viewer/releases/tag/CPM_Atlas_v0.60)
2. **線上版立繪檢視工具（Web Viewer）**
   - **線上開啟（免安裝）**：[https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/](https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/)
3. **本地腳本與對白快速檢視雙工具（D_LoadTools）**
   - **工具包下載**：[前往 Releases 下載 D_LoadTools v0.5](https://github.com/DCodeGames/RPGmakerMZ-cpm-viewer/releases/tag/v0.5)

---

## 📖 各工具用途與使用方式

### 1. CPM Atlas 核心擴充引擎
* **用途**：解決傳統立繪大量空白透明像素佔用記憶體的問題，透過 TexturePacker / Aseprite 匯出的圖集與 JSON 進行裁切拼裝；同時提供多紋理自動聚合（`cha10a`、`cha10b`...）、水平鏡像翻轉座標自動還原、圖層獨立晃動（`DC_CPMshake`）與逐幀循環動畫（`DC_CPMframe` / `DC_CPMframeloop`）。
* **環境限制**：依賴 Node.js 檔案系統檢索圖集，**僅支援 Windows / macOS 桌面端（NW.js 環境）**，不支援手機端與純網頁版。詳細參數與限制請參閱 [線上說明書](https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/ReadMe.html)。

---

### 2. 線上版立繪檢視工具 (Web Viewer)
* **用途**：純前端離線運算工具，直接讀取本機 RPG Maker MZ 專案目錄並即時組裝立繪差分，支援同步渲染 TexturePacker 圖集切片與傳統多層子目錄散圖，調整完畢可直接匯出 `DCvar({...});` 變數控制腳本（**所有資料皆於本機記憶體運算，不會上傳至任何伺服器**）。
* **使用步驟**：
  1. 使用 **Chrome** 或 **Edge** 開啟 [立繪檢視器網頁](https://dcodegames.github.io/RPGmakerMZ-cpm-viewer/)。
  2. 點擊頂部 **「📁 選擇 RPG Maker 專案目錄」**，選取包含 `js/` 與 `img/` 的專案根目錄並允許檢視權限。
  3. 於左側控制面板調整各部位變數數值，右側畫布即時預覽組裝結果（支援畫布縮放與 X/Y 偏移視角調整）。
  4. 勾選需導出的變數項目，點擊下方 **「複製腳本」** 即可取得 `DCvar` 指令（超過字元限制時支援一鍵下載 `.txt`）。

---

### 3. 本地腳本與對白快速檢視雙工具 (D_LoadTools)
* **用途**：因涉及專案資料庫（`data/`）的檔案寫回，基於資料安全性獨立為本機桌面端管線工具：
  * **對白日誌處理工具 (Log Utility)**：讀取專案事件與對白文本，支援批次導出與寫回。
  * **腳本資料替換工具 (Script Utility)**：針對全地圖事件內的腳本指令進行批次檢視與安全替換。
* **注意事項**：
  * 目前為 `Pre-release` 測試版，執行任何涉及寫回專案的操作前，**請務必先行手動備份專案的 `data/` 資料夾**。
