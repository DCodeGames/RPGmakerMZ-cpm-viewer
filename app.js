const core = new CPMCore();
const adapter = new WebAdapter(core);

const MAX_INLINE_LENGTH = 300;

document.getElementById('btn-select-project').onclick = async () => {
    const ok = await adapter.openProjectFolder();
    if (ok) {
        buildUI();
        core.render(document.getElementById('preview-container'));
    }
};

function buildUI() {
    const container = document.getElementById('var-inputs');
    if (!container) return;
    container.innerHTML = '';

    const viewHeader = document.createElement('div');
    viewHeader.className = 'view-header';
    viewHeader.innerText = '視圖調整 (不輸出腳本)';
    container.appendChild(viewHeader);

    createViewControl(container, "縮放", (val) => { core.viewScale = val; core.render(document.getElementById('preview-container')); }, core.viewScale, 0.1);
    createViewControl(container, "偏X", (val) => { core.viewX = val; core.render(document.getElementById('preview-container')); }, core.viewX, 10);
    createViewControl(container, "偏Y", (val) => { core.viewY = val; core.render(document.getElementById('preview-container')); }, core.viewY, 10);

    const divider = document.createElement('div');
    divider.className = 'ui-separator';
    container.appendChild(divider);

    // 建立變數清單
    core.uiOrder.forEach(item => {
        const id = item.id;
        const name = item.name || `變數_${id}`;

        const row = document.createElement('div');
        row.className = 'var-row';
        row.dataset.varId = id;

        row.innerHTML = `
            <div class="var-info-group">
                <input type="checkbox" class="var-chk" onchange="refreshScript()">
                <label class="var-label">${name} [${id}]</label>
            </div>
            <div class="var-action-group">
                <input type="number" id="input_var_${id}" class="var-num-input" value="${core.varStatus[id] || 0}" min="0" onchange="onVarInput(${id}, this.value)">
                <button type="button" class="var-step-btn" onclick="changeStep(${id}, -1)">-</button>
                <button type="button" class="var-step-btn" onclick="changeStep(${id}, 1)">+</button>
            </div>
        `;
        container.appendChild(row);
    });

    refreshScript();
}

function createViewControl(container, label, callback, defaultVal, step) {
    const row = document.createElement('div');
    row.className = 'view-control-row';
    row.innerHTML = `
        <label class="view-control-label">${label}</label>
        <input type="number" class="view-control-input" value="${defaultVal}" step="${step}">
    `;
    row.querySelector('input').onchange = (e) => callback(Number(e.target.value));
    container.appendChild(row);
}

window.changeStep = (id, step) => {
    const input = document.getElementById(`input_var_${id}`);
    if (!input) return;
    const nextVal = Math.max(0, (Number(input.value) || 0) + step);
    input.value = nextVal;
    onVarInput(id, nextVal);
};

window.onVarInput = (id, value) => {
    core.setVariable(id, value);
    core.render(document.getElementById('preview-container'));
    refreshScript();
};

window.refreshScript = () => {
    const selected = [];
    document.querySelectorAll('.var-row').forEach(row => {
        const chk = row.querySelector('.var-chk');
        if (chk && chk.checked) {
            selected.push(Number(row.dataset.varId));
        }
    });

    const scriptText = core.generateScriptString(selected);
    const codeArea = document.getElementById('js-code');
    const copyBtn = document.getElementById('copy-btn');

    if (codeArea) {
        codeArea.value = scriptText;
    }

    if (copyBtn) {
        if (scriptText.length > MAX_INLINE_LENGTH) {
            copyBtn.innerText = "下載指令檔案 (.txt)";
        } else {
            copyBtn.innerText = "複製腳本";
        }
    }
};

document.getElementById('copy-btn').onclick = () => {
    const codeArea = document.getElementById('js-code');
    if (!codeArea) return;
    const content = codeArea.value;

    if (content.length > MAX_INLINE_LENGTH) {
        downloadAsTxt(content, "D_cpmgv_Export.txt");
    } else {
        navigator.clipboard.writeText(content).then(() => {
            alert("已複製到剪貼簿！");
        }).catch(() => {
            codeArea.select();
            document.execCommand('copy');
            alert("已複製到剪貼簿！");
        });
    }
};

function downloadAsTxt(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
