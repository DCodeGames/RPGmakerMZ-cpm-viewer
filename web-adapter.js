/**
 * Web 環境專屬配接器 (WebAdapter)
 * 負責 File System Access API 遞迴路徑搜尋與圖片/圖集快取
 */
class WebAdapter {
    constructor(core) {
        this.core = core;
        this.dirHandle = null;
        this.picturesDirHandle = null;
        
        // 紋理與 JSON 快取
        this.jsonCache = {};
        this.imageCache = {};

        // 自動將自身注入至核心引擎
        if (this.core) {
            this.core.fileLoader = this;
        }
    }

    /**
     * 開啟並授權專案目錄
     */
    async openProjectFolder() {
        try {
            if (window.showDirectoryPicker) {
                this.dirHandle = await window.showDirectoryPicker({ mode: 'read' });
            } else {
                alert("目前瀏覽器不支援 showDirectoryPicker，請改用 Chrome 或 Edge。");
                return false;
            }

            // 1. 取得 js/plugins.js 並解析
            const jsDir = await this.dirHandle.getDirectoryHandle('js');
            const pluginsFile = await jsDir.getFileHandle('plugins.js');
            const fileData = await pluginsFile.getFile();
            const text = await fileData.text();

            const parseOk = this.core.parsePluginsJs(text);
            if (!parseOk) {
                alert("解析 plugins.js 失敗，未找到 CPM 設定！");
                return false;
            }

            // 2. 定位 pictures 目錄 (優先尋找 img/pictures，其次根目錄 pictures)
            try {
                const imgDir = await this.dirHandle.getDirectoryHandle('img');
                this.picturesDirHandle = await imgDir.getDirectoryHandle('pictures');
            } catch (e) {
                try {
                    this.picturesDirHandle = await this.dirHandle.getDirectoryHandle('pictures');
                } catch (err) {
                    console.warn("[WebAdapter] 無法找到 img/pictures 或 pictures 資料夾:", err);
                }
            }

            // 清空舊快取
            this.jsonCache = {};
            this.imageCache = {};

            console.log("[WebAdapter] 專案載入成功！");
            return true;
        } catch (err) {
            if (err.name === 'AbortError') {
                return false;
            }
            console.error("[WebAdapter] 專案目錄讀取失敗:", err);
            alert("專案讀取失敗，請確認選擇的是 RPG Maker MZ 專案根目錄。");
            return false;
        }
    }

    /**
     * 內部輔助：逐層遍歷子目錄以取得實體 FileHandle
     * 支援路徑如: "cha0/hair/43_0.png"
     */
    async _resolveFileHandle(baseHandle, relativePath) {
        const parts = relativePath.replace(/\\/g, '/').split('/').filter(p => p.length > 0);
        let curr = baseHandle;
        for (let i = 0; i < parts.length - 1; i++) {
            curr = await curr.getDirectoryHandle(parts[i]);
        }
        return await curr.getFileHandle(parts[parts.length - 1]);
    }

    /**
     * 取得圖集 JSON (由 cpm-core 呼叫)
     */
    async getAtlas(rootName) {
        if (!this.picturesDirHandle) return null;
        if (this.jsonCache[rootName]) return this.jsonCache[rootName];

        const cleanName = rootName.replace(/\\.json$/i, '');
        const tryNames = [`${cleanName}.json`, cleanName];

        for (const name of tryNames) {
            try {
                const fileHandle = await this._resolveFileHandle(this.picturesDirHandle, name);
                const file = await fileHandle.getFile();
                const jsonText = await file.text();
                const json = JSON.parse(jsonText);
                this.jsonCache[rootName] = json;
                return json;
            } catch (e) {
                // 忽略未找到錯誤，繼續嘗試其他命名
            }
        }
        return null;
    }

    /**
     * 取得圖片紋理 (支援圖集圖檔與多層散圖路徑)
     */
    async getImage(imagePath) {
        if (!this.picturesDirHandle) return null;
        if (this.imageCache[imagePath]) return this.imageCache[imagePath];

        const cleanPath = imagePath.replace(/\\.png$/i, '');
        const tryPaths = [`${cleanPath}.png`, cleanPath];

        for (const p of tryPaths) {
            try {
                const fileHandle = await this._resolveFileHandle(this.picturesDirHandle, p);
                const file = await fileHandle.getFile();

                const img = await new Promise((resolve, reject) => {
                    const url = URL.createObjectURL(file);
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = (err) => reject(err);
                    image.src = url;
                });

                this.imageCache[imagePath] = img;
                return img;
            } catch (e) {
                // 忽略未找到錯誤
            }
        }
        return null;
    }
}

window.WebAdapter = WebAdapter;
