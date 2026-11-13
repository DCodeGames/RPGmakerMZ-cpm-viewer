window.CHANGELOG_ENTRIES = window.CHANGELOG_ENTRIES || {};

window.CHANGELOG_ENTRIES["060"] = {
  tw: `
    <section>
      <h2>版本更新 v0.60 <span class="badge-ver">v0.60</span></h2>
      <div class="tip-box">
        <strong>Atlas 核心重構與演出機能擴充：</strong><br>
        本次更新重構了 <code>D_LogicCPM_Atlas</code> 渲染管線，解決命名衝突與翻轉座標偏移問題，並導入狀態機消除散裝圖片與圖集切換時的瞬間破圖；同時新增獨立圖層晃動（<code>D_LogicCPM_Shake</code>）與逐幀動畫系統（<code>D_LogicCPM_Frame</code>）。
      </div>
      <h3>更新項目列表：</h3>
      <ul>
        <li>
          <strong>D_LogicCPM_Atlas（核心架構與穩定性升級）：</strong>
          <ul>
            <li><strong>命名精確隔離：</strong> 解決 <code>cha10</code> 與 <code>cha1</code> 等前綴相似名稱互相命中的問題。</li>
            <li><strong>翻轉座標還原：</strong> 修正鏡像翻轉時的座標偏移問題，改以畫布尺寸動態計算基準點，無需手動補正偏移值（原測試外掛 <code>D_LogicCPM_AtlasFilp</code> 已整合併入）。</li>
            <li><strong>狀態機破圖防護：</strong> 引入三態狀態機（等待／鎖定／套用），防範散裝圖片與 Atlas 切片互相切換時因非同步載入導致的瞬間破圖。</li>
            <li><strong>基準點模式（<code>AtlasAnchorMode</code>）：</strong> 支援切換 <code>topleft</code> 與 <code>cpm</code> 模式；<code>cpm</code> 模式可在相同畫布下維持 Atlas 與散裝圖片的座標一致（註：由於兩者應用定位不同，刻意放大散裝圖畫布反而會造成效能負優化，建議兩者仍依各自規格定位初始座標）。</li>
            <li><strong>事件阻塞式預讀升級：</strong> 新增 <code>this.DC_CPMpreload(...)</code> 解譯器指令，直接使用原生 <code>ready</code> 狀態等待圖片載入完畢，確保演出時序不搶拍。</li>
            <li><strong>空白幀代碼擴充：</strong> 支援自訂預設空白幀代碼（如 <code>-1</code>、<code>999</code> 皆可使用），為避免與常規差分編號衝突，<strong>禁止設定為 <code>0</code> 與 <code>1</code></strong>。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Shake（新增圖層獨立晃動系統）：</strong>
          <ul>
            <li>突破原生單一演員僅能全體晃動的限制，支援透過圖層 <code>name</code> 進行單一或多圖層獨立晃動控制（<code>DC_CPMshake</code>）。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Frame（新增逐幀動畫系統）：</strong>
          <ul>
            <li>提供「事件阻塞式序列動畫（<code>this.DC_CPMframe</code>）」與「全域背景常駐循環（<code>DC_CPMframeloop</code> / <code>DC_CPMframestop</code>）」，支援順播（<code>fw</code>）與乒乓（<code>pp</code>）模式。</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>版本更新 v0.53 <span class="badge-ver">v0.53</span></h2>
      <div class="tip-box">
        <strong>D_LogicCPM 系列核心架構大更新：</strong><br>
        本次更新全面重構並統整了 <code>D_LogicCPM</code> 系列外掛的 API 命名規範，以「原生無底線（<code>DCsw</code> / <code>DCvar</code>）、外部擴充有底線（<code>DC_CPMxxx</code>）」進行明確區隔，使未來擴充與代碼維護更具辨識度。<br>
        ⚠️ <strong>舊專案升級提示：</strong> 若先前版本已大量使用舊版指令，請使用發行包內附的「事件代碼批次取代工具」進行全地圖 API 快速批次更名。
      </div>
      <h3>更新項目列表：</h3>
      <ul>
        <li>
          <strong>D_LogicCPM_Atlas（多紋理圖集支援）：</strong>
          <ul>
            <li>追加多圖檔自動聚合機能：單一角色支援拆分為 <code>cha10a</code>、<code>cha10b</code> 等多張圖集與 JSON，CPM 呼叫端依然維持統一 <code>cha10/部件名</code> 無感調用。</li>
            <li>預讀指令升級：<code>DC_CPMpreload("cha10")</code> 自動一次性載入該角色所有關聯圖集與紋理快取。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Quick 系列架構分家：</strong>
          <ul>
            <li>將巨集與設定檔獨立抽離為 <code>D_LogicCPM_QuickMacro.js</code>，讓設定庫與操作指令分層管理。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_QuickSet（指令體系全面更新）：</strong>
          <ul>
            <li>全面替換指令命名：RM 原生變數/開關相關全面採用無底線規範（<code>DCsw</code>、<code>DCvar</code>、<code>DCssw</code>、<code>DCfill</code>），提高與外部插件指令的辨識度。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Move（補間移動優化）：</strong>
          <ul>
            <li>移除原本的插件指令呼叫，全面統一採用 <code>DC_CPMmove(...)</code> 腳本呼叫輸入，提升事件執行效能與簡潔度。</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>版本更新 v0.52 <span class="badge-ver">v0.52</span></h2>
      <div class="tip-box">
        <strong>幽靈演員架構變更與棄用提醒：</strong><br>
        先前開發幽靈演員機能是基於性能考量，避免 CPM 掛載過多無效圖層產生資源浪費。但隨著後續引進了 <code>999</code> 快速短路代碼與空繪機制優化，即使主角身上掛載多個額外圖層清單也不再造成效能負擔。幽靈演員會在各層面帶來未知的副作用與衝突，因此<strong>不再建議使用此機能</strong>。若有額外圖層需求，建議直接掛在主角身上，並於初始化時送出 <code>999</code> 進行空繪即可。
      </div>
      <h3>主要改動機制：</h3>
      <ul>
        <li><strong>幽靈演員獨立化：</strong> 已將幽靈演員機制獨立抽離，並加入戰鬥時的隔離機能。</li>
        <li>
          <strong>新增外掛 <code>D_LogicCPM_FlipWatcher</code>（翻轉監聽）：</strong>
          <ul>
            <li><strong>運作原理：</strong> 監聽指定的翻轉開關，當開關開啟時自動疊加一組補正值。</li>
            <li><strong>當前狀態：</strong> 補正數值需透過視覺目視手動輸入，且不同圖片所需數值皆不同，目前僅供測試，尚非穩定可用狀態。</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>版本更新 v0.51 <span class="badge-ver">v0.51</span></h2>
      <ul>
        <li><strong>問題修正：</strong> 修正幽靈演員在特定情況下導致錯誤查找無限迴圈的問題。</li>
      </ul>
    </section>
  `,
  jp: `
    <section>
      <h2>アップデート履歴 v0.60 <span class="badge-ver">v0.60</span></h2>
      <div class="tip-box">
        <strong>Atlas コア刷新と演出機能の拡張：</strong><br>
        本バージョンでは <code>D_LogicCPM_Atlas</code> の描画パイプラインを再設計し、名前一致の競合や反転時の座標ズレを解消しました。また、ステートマシン導入により通常画像とアトラス切替時の一瞬の表示崩れを防止し、さらにレイヤー個別揺れ（<code>D_LogicCPM_Shake</code>）とコマ送りアニメーション（<code>D_LogicCPM_Frame</code>）を新規追加しています。
      </div>
      <h3>主な更新内容：</h3>
      <ul>
        <li>
          <strong>D_LogicCPM_Atlas（コア構造と安定性の向上）：</strong>
          <ul>
            <li><strong>名前の厳密分離：</strong> <code>cha10</code> と <code>cha1</code> など類似プレフィックスが誤って相互ヒットする問題を解消。</li>
            <li><strong>反転座標の自動復元：</strong> ミラー反転時の座標ズレを修正。キャンバス基準のピボット計算により手動補正値なしでその場反転が可能に（旧テスト用 <code>D_LogicCPM_AtlasFilp</code> は本体へ統合）。</li>
            <li><strong>ステートマシンによる表示崩れ防止：</strong> 3段階の状態管理を導入し、通常スライス画像とアトラス切替時の非同期読み込みによる一瞬の描画乱れを防止。</li>
            <li><strong>基準点モード（<code>AtlasAnchorMode</code>）：</strong> <code>topleft</code> と <code>cpm</code> モードの切替に対応。<code>cpm</code> モードでは同一キャンバスサイズ下でアトラスと通常画像の座標を一致させられます（※用途が異なるため通常画像のキャンバスを無理に拡大すると逆最適化になります。それぞれの仕様に合わせて初期座標を設定することを推奨します）。</li>
            <li><strong>待機型プリロードの強化：</strong> イベントコマンド用 <code>this.DC_CPMpreload(...)</code> を追加。ネイティブの <code>ready</code> 状態を直接待機し、演出タイミングのズレを確実に防止。</li>
            <li><strong>空白フレームコードの拡張：</strong> <code>-1</code> や <code>999</code> など任意の空白コード指定に対応（※通常の差分番号との競合を防ぐため、<strong><code>0</code> と <code>1</code> は設定不可</strong>）。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Shake（レイヤー個別揺れシステムの新規追加）：</strong>
          <ul>
            <li>アクター全体しか揺らせなかった標準仕様を拡張し、レイヤーの <code>name</code> 指定による単一・複数レイヤーの個別シェイクに対応（<code>DC_CPMshake</code>）。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Frame（コマ送りアニメーションシステムの新規追加）：</strong>
          <ul>
            <li>「イベント待機型アニメーション（<code>this.DC_CPMframe</code>）」と「グローバル背景ループ（<code>DC_CPMframeloop</code> / <code>DC_CPMframestop</code>）」を実装。順再生（<code>fw</code>）と往復再生（<code>pp</code>）をサポート。</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>アップデート履歴 v0.53 <span class="badge-ver">v0.53</span></h2>
      <div class="tip-box">
        <strong>D_LogicCPM シリーズ コアアーキテクチャの刷新：</strong><br>
        本バージョンでは、<code>D_LogicCPM</code> シリーズの API 命名規則を刷新しました。「ツクール標準系はアンダーバーなし（<code>DCsw</code> / <code>DCvar</code>）」「外部拡張プラグイン系はアンダーバーあり（<code>DC_CPMxxx</code>）」として明確に区別し、今後の機能追加における可読性と保守性を向上させています。<br>
        ⚠️ <strong>旧バージョンからの移行について：</strong> 既に旧 API をイベント内で多数使用されている場合は、同梱の「イベント一括置換ツール」を使用することで、マップ内のスクリプト名を一括で安全に移行できます。
      </div>
      <h3>主な更新内容：</h3>
      <ul>
        <li>
          <strong>D_LogicCPM_Atlas（マルチテクスチャ対応）：</strong>
          <ul>
            <li>複数アトラスの自動結合機能を追加：同一キャラの差分を <code>cha10a</code>、<code>cha10b</code> などの複数シートに分割可能に。CPM 側は従来通り <code>cha10/パーツ名</code> で透過的に指定できます。</li>
            <li>プリロード拡張：<code>DC_CPMpreload("cha10")</code> で関連する全テクスチャシートを一括先行読み込み。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Quick シリーズの分離：</strong>
          <ul>
            <li>マクロ・プリセット設定を <code>D_LogicCPM_QuickMacro.js</code> として独立分離し、設定管理と操作コマンドを分離。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_QuickSet（コマンド体系の全面刷新）：</strong>
          <ul>
            <li>全コマンドの命名規則を刷新：ツクール標準の変数・スイッチ操作はアンダーバーなし（<code>DCsw</code>、<code>DCvar</code>、<code>DCssw</code>、<code>DCfill</code>）に統一し、外部プラグインコマンドとの判別性を強化。</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Move（補間移動のスクリプト統一）：</strong>
          <ul>
            <li>プラグインコマンド呼び出しを廃止し、すべて <code>DC_CPMmove(...)</code> のスクリプト呼び出しに一本化。</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>アップデート履歴 v0.52 <span class="badge-ver">v0.52</span></h2>
      <div class="tip-box">
        <strong>ファントムアクター機能の変更と非推奨について：</strong><br>
        ファントムアクターは元々、CPM で無効なレイヤーを多数登録した際のメモリ消費を抑える目的で実装された機能でした。しかし、その後の <code>999</code> 短絡スキップ機能や空描画最適化の実装により、アクター本体に複数の追加レイヤーを登録しても負荷の問題は解消されました。ファントムアクターは予期せぬ不具合を引き起こすリスクがあるため、<strong>今後は使用を非推奨とします</strong>。追加レイヤーが必要な場合は直接メインアクターに設定し、初期化時に <code>999</code> を指定して空描画を行ってください。
      </div>
      <h3>主な変更内容：</h3>
      <ul>
        <li><strong>ファントムアクターの分離：</strong> 機構を独立化させ、戦闘時の隔離処理を追加しました。</li>
        <li>
          <strong>新規プラグイン <code>D_LogicCPM_FlipWatcher</code>（反転監視）：</strong>
          <ul>
            <li><strong>仕組み：</strong> 反転スイッチを監視し、ON になった際に座標の補正値を加算します。</li>
            <li><strong>現在の状態：</strong> 画像ごとに目視で手動数値を入力する必要があり、素材ごとに最適な値が異なるため、現時点ではテスト用の実験的機能となります。</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>アップデート履歴 v0.51 <span class="badge-ver">v0.51</span></h2>
      <ul>
        <li><strong>不具合修正：</strong> ファントムアクターによる検索エラーの無限ループ問題を修正しました。</li>
      </ul>
    </section>
  `,
  en: `
    <section>
      <h2>Changelog v0.60 <span class="badge-ver">v0.60</span></h2>
      <div class="tip-box">
        <strong>Atlas Core Overhaul &amp; New Animation Extensions:</strong><br>
        This update rebuilds the <code>D_LogicCPM_Atlas</code> rendering pipeline to resolve prefix name collisions and mirror flip coordinate offsets, introduces a state machine to eliminate visual glitches when switching between loose images and atlases, and adds independent layer shaking (<code>D_LogicCPM_Shake</code>) alongside a frame-by-frame animation engine (<code>D_LogicCPM_Frame</code>).
      </div>
      <h3>Key Updates:</h3>
      <ul>
        <li>
          <strong>D_LogicCPM_Atlas (Core Architecture &amp; Stability Upgrade):</strong>
          <ul>
            <li><strong>Exact Prefix Isolation:</strong> Resolved naming collision issues where similar prefixes like <code>cha10</code> and <code>cha1</code> falsely matched each other.</li>
            <li><strong>Mirror Flip Coordinate Restoration:</strong> Fixed coordinate shifting during horizontal flips by calculating pivot dynamically from canvas dimensions—no manual offset values required (legacy test plugin <code>D_LogicCPM_AtlasFilp</code> is now merged into core).</li>
            <li><strong>State-Machine Glitch Prevention:</strong> Introduced a 3-state pipeline (Pending / Locked / Applied) to prevent momentary visual tearing caused by async loading when swapping between loose files and atlas sheets.</li>
            <li><strong>Anchor Mode (<code>AtlasAnchorMode</code>):</strong> Supports switching between <code>topleft</code> and <code>cpm</code> modes. The <code>cpm</code> mode aligns atlas and loose image coordinates under identical canvas sizes (Note: because both serve different purposes, enlarging loose image canvases is counterproductive for performance; keep separate initial coordinates per asset type).</li>
            <li><strong>Blocking Preload Upgrade:</strong> Added interpreter command <code>this.DC_CPMpreload(...)</code> utilizing native image <code>ready</code> states to guarantee synchronized cutscene timing.</li>
            <li><strong>Blank Frame Code Expansion:</strong> Supports custom blank frame tokens such as <code>-1</code> and <code>999</code>. To prevent conflicts with regular variation indices, <strong><code>0</code> and <code>1</code> are prohibited</strong>.</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Shake (New Layer-Specific Shake System):</strong>
          <ul>
            <li>Overcomes the native limitation where an entire actor shakes together, enabling single or multi-layer independent shake control via CPM layer <code>name</code> (<code>DC_CPMshake</code>).</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Frame (New Frame-by-Frame Animation System):</strong>
          <ul>
            <li>Provides both event-blocking sequential animations (<code>this.DC_CPMframe</code>) and persistent global background loops (<code>DC_CPMframeloop</code> / <code>DC_CPMframestop</code>) with forward (<code>fw</code>) and ping-pong (<code>pp</code>) modes.</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>Changelog v0.53 <span class="badge-ver">v0.53</span></h2>
      <div class="tip-box">
        <strong>D_LogicCPM Core Architecture Overhaul:</strong><br>
        This update refactors the API naming conventions across the <code>D_LogicCPM</code> plugin suite. Commands targeting native RPG Maker variables/switches use clean names without underscores (<code>DCsw</code>, <code>DCvar</code>), while external plugin/CPM extensions use underscores (<code>DC_CPMxxx</code>), ensuring clear distinction and readability for future expansions.<br>
        ⚠️ <strong>Migration Notice:</strong> If your project already uses previous API calls, please use the bundled Event Batch Replace Tool to quickly and safely update all script calls across your maps.
      </div>
      <h3>Key Updates:</h3>
      <ul>
        <li>
          <strong>D_LogicCPM_Atlas (Multi-Texture Support):</strong>
          <ul>
            <li>Added automatic multi-sheet aggregation: Large sprite sheets can now be split into <code>cha10a</code>, <code>cha10b</code>, etc., while CPM calls remain unified as <code>cha10/part_path</code> with automatic texture resolution.</li>
            <li>Upgraded preloading: <code>DC_CPMpreload("cha10")</code> automatically loads all associated texture sheets into memory at once.</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Quick Decoupling:</strong>
          <ul>
            <li>Decoupled preset macro storage into a dedicated module <code>D_LogicCPM_QuickMacro.js</code> to cleanly separate configuration from runtime setters.</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_QuickSet (Complete Command Overhaul):</strong>
          <ul>
            <li>Replaced all commands with standardized naming: Native RM switches/variables use underscore-free names (<code>DCsw</code>, <code>DCvar</code>, <code>DCssw</code>, <code>DCfill</code>) for distinct separation from external plugin APIs.</li>
          </ul>
        </li>
        <li>
          <strong>D_LogicCPM_Move (Unified Script Calls):</strong>
          <ul>
            <li>Removed Plugin Command calls; unified entirely under the <code>DC_CPMmove(...)</code> script call interface for improved performance and editor brevity.</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>Changelog v0.52 <span class="badge-ver">v0.52</span></h2>
      <div class="tip-box">
        <strong>Phantom Actor Architecture Change &amp; Deprecation Notice:</strong><br>
        The phantom actor system was originally created to limit resource consumption caused by invalid layer attachments in CPM. However, thanks to the subsequent implementation of the <code>999</code> short-circuit check and dummy-draw optimizations, binding multiple layers directly to the main actor no longer causes noticeable overhead. Because phantom actors can introduce unpredictable side effects across various systems, <strong>their use is no longer recommended</strong>. If additional layers are needed, attach them directly to your main actor and initialize them with <code>999</code> to execute a blank dummy draw.
      </div>
      <h3>Key Changes:</h3>
      <ul>
        <li><strong>Phantom Actor Isolation:</strong> Decoupled phantom actor logic into a standalone structure and added runtime battle isolation.</li>
        <li>
          <strong>New Plugin <code>D_LogicCPM_FlipWatcher</code>:</strong>
          <ul>
            <li><strong>Mechanism:</strong> Monitors designated flip switches and applies an offset value when enabled.</li>
            <li><strong>Current Status:</strong> Requires manual visual adjustment per graphic, as offset values vary by asset. This is currently an experimental test build and not yet ready for production use.</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2>Changelog v0.51 <span class="badge-ver">v0.51</span></h2>
      <ul>
        <li><strong>Bug Fix:</strong> Resolved an infinite error lookup loop caused by phantom actors.</li>
      </ul>
    </section>
  `
};
