/**
 * CPM 立繪預覽核心引擎 (純邏輯層，無環境依賴)
 * 支援「圖集切片模式」與「多層散圖資料夾模式」雙軌渲染
 */
class CPMCore {
    constructor() {
        this.layers = [];           // 從 plugins.js 解析出的圖層清單
        this.uiOrder = [];          // 面板變數排序清單 (項目為 { id, name })
        this.varNames = {};         // 變數名稱對應 { 41: "立繪組", 43: "backhair", ... }
        this.varStatus = {};        // 各變數當前數值
        
        // 視圖狀態
        this.viewScale = 0.5;
        this.viewX = 0;
        this.viewY = 0;

        // 回呼注入
        this.fileLoader = null; 
    }

    /**
     * 解析 RPG Maker MZ 的 js/plugins.js
     */
    parsePluginsJs(pluginsJsContent) {
        this.layers = [];
        this.uiOrder = [];
        this.varStatus = {};
        this.varNames = {};

        try {
            const getPlugins = new Function(`${pluginsJsContent}; return $plugins;`);
            const plugins = getPlugins();

            const cpm = (plugins || []).find(p => p.name === 'CharacterPictureManager');
            if (!cpm || !cpm.parameters) {
                console.warn("[CPMCore] 在 plugins.js 中找不到 CharacterPictureManager 的外掛設定");
                return false;
            }

            const rawList = JSON.parse(cpm.parameters['PictureList'] || '[]');
            const varIdSet = new Set();

            rawList.forEach(itemStr => {
                const item = JSON.parse(itemStr);
                const dynPath = item.DynamicFileName || '';
                const layerName = item.Name || '';
                
                if (dynPath) {
                    const matches = [...dynPath.matchAll(/{variable:(\d+)}/g)];
                    const variables = matches.map(m => Number(m[1]));
                    variables.forEach(v => varIdSet.add(v));

                    if (variables.length > 0) {
                        const targetVar = variables[variables.length - 1];
                        if (!this.varNames[targetVar] || this.varNames[targetVar].startsWith("變數_")) {
                            this.varNames[targetVar] = layerName || `變數_${targetVar}`;
                        }
                    }

                    this.layers.push({
                        actorId: item.ActorId,
                        name: layerName,
                        rawPath: dynPath,
                        variables: variables
                    });
                }
            });

            // 針對通用變數 41（若未自訂則設定為立繪組）
            if (varIdSet.has(41) && (!this.varNames[41] || this.varNames[41] === '變數_41')) {
                this.varNames[41] = "立繪組";
            }

            // 初始化變數數值，預設為 0
            varIdSet.forEach(vId => {
                this.varStatus[vId] = 0;
                if (!this.varNames[vId]) {
                    this.varNames[vId] = `變數_${vId}`;
                }
            });

            // 依變數編號排序產出 uiOrder 項目
            this.uiOrder = Array.from(varIdSet).sort((a, b) => a - b).map(id => ({
                id: id,
                name: this.varNames[id]
            }));

            return true;
        } catch (err) {
            console.error("[CPMCore] plugins.js 解析錯誤:", err);
            return false;
        }
    }

    setVariable(id, value) {
        this.varStatus[id] = Number(value);
    }

    findFrame(frames, frameKey) {
        if (!frames || !frameKey) return null;
        if (frames[frameKey]) return frames[frameKey];

        const hasExt = frameKey.toLowerCase().endsWith(".png");
        const altKey = hasExt ? frameKey.slice(0, -4) : `${frameKey}.png`;
        if (frames[altKey]) return frames[altKey];

        const baseKey = frameKey.split('/').pop();
        if (frames[baseKey]) return frames[baseKey];
        const altBaseKey = hasExt ? baseKey.slice(0, -4) : `${baseKey}.png`;
        if (frames[altBaseKey]) return frames[altBaseKey];

        return null;
    }

    async render(container) {
        if (!container) return;
        container.innerHTML = '';

        const viewport = document.createElement('div');
        viewport.style.cssText = `
            position: absolute;
            width: 100%; height: 100%;
            transform: scale(${this.viewScale}) translate(${this.viewX}px, ${this.viewY}px);
            transform-origin: top left;
        `;
        container.appendChild(viewport);

        for (const layer of this.layers) {
            let resolvedPath = layer.rawPath.replace(/{variable:(\d+)}/g, (_, vId) => {
                return this.varStatus[vId] || 0;
            });

            // 數值為 999 視為強制隱藏跳過
            const lastPart = resolvedPath.split('/').pop();
            if (lastPart.endsWith('_999') || lastPart === '999') {
                continue;
            }

            const normalized = resolvedPath.replace(/\\/g, '/');
            const slashIndex = normalized.indexOf('/');

            let rendered = false;

            // 軌道 A：嘗試圖集切片模式 (例如 cha100.json, cha200a.json)
            if (slashIndex !== -1 && this.fileLoader && this.fileLoader.getAtlas) {
                const rootName = normalized.substring(0, slashIndex);
                const frameKey = normalized.substring(slashIndex + 1);

                const atlas = await this.fileLoader.getAtlas(rootName);
                if (atlas && atlas.frames) {
                    const frameData = this.findFrame(atlas.frames, frameKey);
                    if (frameData) {
                        const f = frameData.frame;
                        const src = frameData.spriteSourceSize || { x: 0, y: 0 };

                        const canvas = document.createElement('canvas');
                        canvas.width = f.w;
                        canvas.height = f.h;
                        canvas.style.cssText = `position:absolute; left:${src.x}px; top:${src.y}px;`;

                        const targetSheetName = frameData._sheetName || (atlas.meta && atlas.meta.image ? atlas.meta.image.replace(/\\.png$/i, '') : rootName);
                        const img = await this.fileLoader.getImage(targetSheetName);

                        if (img) {
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
                            viewport.appendChild(canvas);
                            rendered = true;
                        }
                    }
                }
            }

            // 軌道 B：若未以圖集渲染，直接走散圖載入模式 (相容 cha0/hair/43_0.png 等多層子目錄)
            if (!rendered && this.fileLoader && this.fileLoader.getImage) {
                const img = await this.fileLoader.getImage(normalized);
                if (img) {
                    const imgEl = document.createElement('img');
                    imgEl.src = img.src;
                    imgEl.style.cssText = "position:absolute; left:0; top:0;";
                    viewport.appendChild(imgEl);
                }
            }
        }
    }

    generateScriptString(selectedIds) {
        const sortedIds = Array.from(selectedIds).sort((a, b) => a - b);
        const entries = sortedIds.map(id => `${id}:${this.varStatus[id] || 0}`).join(', ');
        return entries.length > 0 ? `D_cpmgv({${entries}});` : `D_cpmgv({});`;
    }
}

window.CPMCore = CPMCore;
