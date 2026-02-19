<template>
  <div class="app-shell">
    <header class="topbar">
      <h1>本地知识库助手</h1>
      <div class="top-actions">
        <div class="status" :class="doctor.ok ? 'ok' : 'warn'">{{ doctorText }}</div>
        <button class="btn secondary" :disabled="busyState.manual" @click="openManual">操作手册</button>
        <button class="btn" :disabled="busyState.doctor" @click="runDoctor">健康检查</button>
        <button class="btn secondary" @click="openPanel('config')">配置设置</button>
        <button class="btn secondary" @click="openPanel('kb')">知识库设置</button>
        <button class="btn secondary" @click="openPanel('feedback')">操作反馈</button>
      </div>
    </header>
    <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.text }}</div>

    <section class="panel guide">
      <h2>工作流向导（按顺序执行）</h2>
      <p class="muted">当前建议步骤：<strong>{{ currentStepText }}</strong></p>
      <div class="guide-progress">
        <div class="guide-progress-bar"><span :style="{ width: `${stepProgress}%` }"></span></div>
        <span class="guide-progress-text">完成度 {{ stepProgress }}%</span>
      </div>
      <p class="warn-text" v-if="workflowBlockerText">{{ workflowBlockerText }}</p>
      <div class="steps">
        <div class="step" :class="stepClass(1)">
          <span class="num">1</span>
          <div>
            <div class="step-title">保存配置</div>
            <div class="step-desc">右上角“配置设置”中确认 Ollama、模型、Python、工作目录和工作空间。</div>
          </div>
        </div>
        <div class="step" :class="stepClass(2)">
          <span class="num">2</span>
          <div>
            <div class="step-title">加载知识库</div>
            <div class="step-desc">右上角“知识库设置”中下拉选择知识库，或创建新知识库。</div>
          </div>
        </div>
        <div class="step" :class="stepClass(3)">
          <span class="num">3</span>
          <div>
            <div class="step-title">重建索引</div>
            <div class="step-desc">知识库变更后在“知识库设置”里执行重建索引。</div>
          </div>
        </div>
        <div class="step" :class="stepClass(4)">
          <span class="num">4</span>
          <div>
            <div class="step-title">发起提问</div>
            <div class="step-desc">在下方查询区提问，返回答案、来源片段与相似度分数。</div>
          </div>
        </div>
      </div>
      <div class="row">
        <button class="btn" @click="guideGoNext">{{ nextActionText }}</button>
        <button class="btn secondary" :disabled="busyState.config" @click="applyRecommendedConfig">一键填入推荐配置</button>
        <button class="btn secondary" :disabled="busyState.data" @click="useDemoSource">填入演示知识库创建参数</button>
        <button class="btn secondary" :disabled="busyState.ask" @click="fillExampleQuestion">填入示例问题</button>
      </div>
      <p class="muted inline">当前已加载知识库：<strong>{{ config.selectedKnowledgeBase || '无' }}</strong></p>
      <p class="muted inline">当前检索模板：<strong>{{ currentPresetName }}</strong></p>
      <p class="mono">{{ indexInfo }}</p>
      <p class="mono" v-if="indexParamsInfo">{{ indexParamsInfo }}</p>
    </section>

    <main class="grid grid-single">
      <section class="panel wide">
        <h2>查询区</h2>
        <p class="muted">索引完成后再提问，结果包含来源证据。</p>
        <div class="row">
          <textarea v-model="question" placeholder="请输入问题（例如：总结本地RAG流程）"></textarea>
        </div>
        <button class="btn" :disabled="busyState.ask || !canAsk" @click="ask">{{ busyState.ask ? '提问中...' : '开始提问' }}</button>
        <p class="warn-text" v-if="!canAsk">{{ askBlocker }}</p>
        <p class="muted inline" v-if="busyState.ask">生成中：{{ askElapsedSec }}s</p>
        <p class="muted inline" v-if="typingState.active">答案渲染进度：{{ typingState.progress }}%</p>

        <div class="answer" v-if="askResult">
          <p class="warn-text" v-if="knowledgeFallbackNotice">{{ knowledgeFallbackNotice }}</p>
          <h3>回答</h3>
          <div class="answer-markdown" v-html="renderedAnswer"></div>
          <h3>来源片段</h3>
          <ul class="list sources-list">
            <li v-for="d in askResult.sourceDetails || []" :key="d.source">
              <div class="source-head">
                <div class="source-meta">
                  <div class="source-file">{{ sourceFileName(d.source) }}</div>
                  <div class="source-path">{{ sourceDirName(d.source) }}</div>
                </div>
                <span class="score-badge">分数 {{ Number(d.score).toFixed(4) }}</span>
              </div>
              <div class="snippet snippet-markdown" v-html="renderSnippetSafe(d.snippet)"></div>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <div v-if="activePanel" class="modal-mask" @click.self="closePanel">
      <section class="modal-card panel">
        <div class="modal-head">
          <h2>{{ activePanelTitle }}</h2>
          <button class="btn small" @click="closePanel">关闭</button>
        </div>

        <div v-if="activePanel === 'config'">
          <p class="muted">新手建议先点“一键填入推荐配置”，再保存。</p>
          <div class="row row-gap">
            <button class="btn secondary" @click="expertMode = !expertMode">{{ expertMode ? '切换到新手模式' : '切换到专家模式' }}</button>
            <span class="muted inline">{{ expertMode ? '专家模式：可调检索/重排参数' : '新手模式：使用推荐默认值' }}</span>
          </div>
          <label>Ollama URL<input v-model="config.ollamaUrl" /></label>
          <label>向量后端
            <select v-model="config.vectorBackend">
              <option value="sqlite">SQLite（本地文件）</option>
              <option value="qdrant">Qdrant（外置向量库）</option>
            </select>
          </label>
          <label v-if="config.vectorBackend === 'qdrant'">Qdrant URL<input v-model="config.qdrantUrl" placeholder="http://127.0.0.1:6333" /></label>
          <label v-if="config.vectorBackend === 'qdrant'">Qdrant Collection<input v-model="config.qdrantCollection" placeholder="mdrag_chunks" /></label>
          <label v-if="config.vectorBackend === 'qdrant'">Qdrant API Key<input v-model="config.qdrantApiKey" type="password" placeholder="可选" /></label>
          <label>向量模型
            <select v-model="config.embeddingModel">
              <option v-for="m in modelOptions" :key="`emb-${m}`" :value="m">{{ m }}</option>
            </select>
          </label>
          <label>对话模型
            <select v-model="config.chatModel">
              <option v-for="m in modelOptions" :key="`chat-${m}`" :value="m">{{ m }}</option>
            </select>
          </label>
          <div class="row row-gap">
            <button class="btn secondary" :disabled="busyState.doctor" @click="runDoctor">刷新模型列表</button>
            <input v-model="customModel" placeholder="手动输入模型名，例如 qwen2.5-coder:3b" />
            <button class="btn secondary" :disabled="busyState.config" @click="useCustomModel">使用自定义模型</button>
          </div>
          <label>Python 可执行程序<input v-model="config.pythonExec" /></label>
          <label>RAG 工作目录<input v-model="config.mdragWorkdir" /></label>
          <label>索引数据库路径<input v-model="config.dbPath" /></label>
          <label>知识库工作空间目录（固定存放所有知识库）<input v-model="config.workspaceRoot" /></label>
          <div class="wizard">
            <h3>最小环境部署（安装包内置脚本）</h3>
            <p class="muted">{{ runtimeStatusText }}</p>
            <p class="mono" v-if="runtimeStatus.scriptPath">脚本路径：{{ runtimeStatus.scriptPath }}</p>
            <p class="mono" v-if="runtimeStatus.offlineScriptPath">离线脚本路径：{{ runtimeStatus.offlineScriptPath }}</p>
            <div class="row row-gap">
              <label class="radio"><input type="checkbox" v-model="runtimeOptions.offline" /> 离线部署模式（不联网）</label>
            </div>
            <label v-if="runtimeOptions.offline">离线资源目录
              <input v-model="runtimeOptions.assetRoot" placeholder="例如：D:\\offline-bundle\\offline-assets" />
            </label>
            <div class="row row-gap">
              <label class="radio"><input type="checkbox" v-model="runtimeOptions.installPython" /> 安装 Python</label>
              <label class="radio"><input type="checkbox" v-model="runtimeOptions.installDocker" /> 安装 Docker Desktop</label>
              <label class="radio"><input type="checkbox" v-model="runtimeOptions.installOllama" /> 安装 Ollama</label>
              <label class="radio"><input type="checkbox" v-model="runtimeOptions.startQdrant" /> 启动 Qdrant 容器</label>
              <label class="radio"><input type="checkbox" v-model="runtimeOptions.pullModel" /> {{ runtimeOptions.offline ? '可选：导入离线模型' : '可选：联网拉取模型' }}</label>
            </div>
            <label v-if="runtimeOptions.pullModel">模型名称<input v-model="runtimeOptions.modelName" placeholder="llama3.1:8b" /></label>
            <div class="row row-gap">
              <button class="btn secondary" :disabled="busyState.runtime" @click="refreshRuntimeStatus">刷新环境状态</button>
              <button class="btn" :disabled="busyState.runtime" @click="runRuntimeSetup">{{ busyState.runtime ? '部署中...' : '一键部署最小环境' }}</button>
            </div>
          </div>
          <label>界面配色方案
            <select v-model="config.uiTheme">
              <option v-for="t in themeOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </label>
          <div v-if="expertMode" class="wizard">
            <h3>检索与重排高级参数</h3>
            <p class="muted">推荐默认：`hybrid + token_overlap`。追求更高质量时可用 `llm_score`。</p>
            <ul class="warn-list" v-if="advancedWarnings.length">
              <li v-for="w in advancedWarnings" :key="w">{{ w }}</li>
            </ul>
            <label>检索策略
              <select v-model="config.retrievalStrategy">
                <option value="hybrid">hybrid（推荐）</option>
                <option value="dense">dense</option>
                <option value="sparse">sparse</option>
              </select>
            </label>
            <label>重排器
              <select v-model="config.reranker">
                <option value="token_overlap">token_overlap（推荐）</option>
                <option value="llm_score">llm_score（高质量，较慢）</option>
                <option value="none">none</option>
              </select>
            </label>
            <div class="row row-gap">
              <label class="field-inline">top_k
                <input type="number" min="1" max="20" v-model.number="config.topK" />
              </label>
              <label class="field-inline">chunk_size
                <input type="number" min="100" max="5000" step="50" v-model.number="config.chunkSize" />
              </label>
              <label class="field-inline">chunk_overlap
                <input type="number" min="0" max="2000" step="10" v-model.number="config.chunkOverlap" />
              </label>
              <label class="field-inline">rerank_top_n
                <input type="number" min="1" max="50" v-model.number="config.rerankTopN" />
              </label>
              <label class="field-inline">dense_candidate_multiplier
                <input type="number" min="1" max="20" v-model.number="config.denseCandidateMultiplier" />
              </label>
            </div>
            <div class="row row-gap">
              <label class="field-inline">rrf_k
                <input type="number" min="1" max="200" v-model.number="config.rrfK" />
              </label>
              <label class="field-inline">min_retrieval_score
                <input type="number" min="0" max="1" step="0.01" v-model.number="config.minRetrievalScore" />
              </label>
              <label class="field-inline">max_context_chars
                <input type="number" min="500" max="50000" step="100" v-model.number="config.maxContextChars" />
              </label>
            </div>
            <div class="row row-gap">
              <label class="field-inline">bm25_k1
                <input type="number" min="0.1" max="3" step="0.1" v-model.number="config.bm25K1" />
              </label>
              <label class="field-inline">bm25_b
                <input type="number" min="0" max="1" step="0.05" v-model.number="config.bm25B" />
              </label>
              <label class="field-inline">embed_timeout_sec
                <input type="number" min="10" max="1200" step="10" v-model.number="config.embedTimeoutSec" />
              </label>
              <label class="field-inline">chat_timeout_sec
                <input type="number" min="30" max="1200" step="10" v-model.number="config.chatTimeoutSec" />
              </label>
            </div>
            <div class="row row-gap">
              <button class="btn secondary" :disabled="busyState.config" @click="applyBalancedRetrievalPreset">平衡预设</button>
              <button class="btn secondary" :disabled="busyState.config" @click="applyHighAccuracyPreset">高精度预设</button>
            </div>
          </div>
          <div class="row row-gap">
            <button class="btn secondary" :disabled="busyState.data" @click="pickWorkspaceRoot">浏览工作空间</button>
            <button class="btn" :disabled="busyState.config" @click="saveConfig">保存配置</button>
          </div>
        </div>

        <div v-if="activePanel === 'kb'">
          <p class="muted">工作空间下拉选择知识库，可直接加载或卸载当前知识库。</p>
          <div class="wizard">
            <h3>场景化检索模板</h3>
            <p class="muted">根据使用场景一键应用参数，应用后记得点击“保存配置”。</p>
            <div class="row row-gap">
              <button class="btn secondary" :disabled="busyState.config" @click="applyScenarioPreset('docs')">文档问答（推荐）</button>
              <button class="btn secondary" :disabled="busyState.config" @click="applyScenarioPreset('code')">代码库问答</button>
              <button class="btn secondary" :disabled="busyState.config" @click="applyScenarioPreset('accuracy')">高精度慢速</button>
            </div>
          </div>
          <label>当前工作空间
            <div class="mono">{{ config.workspaceRoot || '未设置' }}</div>
          </label>
          <div class="row row-gap">
            <select v-model="selectedKb">
              <option value="">请选择知识库</option>
              <option v-for="name in kbOptions" :key="name" :value="name">{{ name }}</option>
            </select>
            <button class="btn" :disabled="busyState.data" @click="loadSelectedKnowledgeBase">加载知识库</button>
            <button class="btn secondary" :disabled="busyState.data" @click="unloadKnowledgeBase">卸载当前</button>
            <button class="btn small" :disabled="busyState.data || !selectedKb" @click="deleteSelectedKnowledgeBase">删除知识库</button>
          </div>
          <div class="row row-gap" v-if="selectedKbRecord">
            <div class="mono">记录ID：{{ selectedKbRecord.id }} | 文档数：{{ selectedKbRecord.docCount }} | 索引状态：{{ selectedKbRecord.indexStatus }}</div>
          </div>
          <div class="row row-gap">
            <input v-model="renameKbName" placeholder="输入新名称后重命名当前选中知识库" />
            <button class="btn secondary" :disabled="busyState.data || !selectedKb || !renameKbName.trim()" @click="renameSelectedKnowledgeBase">重命名</button>
          </div>
          <div class="row row-gap">
            <button class="btn secondary" :disabled="busyState.data" @click="refreshKnowledgeBases">刷新知识库列表</button>
            <span class="muted inline">当前已加载：{{ config.selectedKnowledgeBase || '无' }}</span>
          </div>
          <div class="wizard">
            <h3>历史知识库</h3>
            <div class="row row-gap">
              <input v-model="kbSearch" placeholder="搜索名称/ID/路径/状态" />
              <select v-model="kbSortKey">
                <option value="updatedAt">按更新时间</option>
                <option value="name">按名称</option>
                <option value="docCount">按文档数</option>
                <option value="indexStatus">按状态</option>
              </select>
              <select v-model="kbSortDir">
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
            <div class="kb-table-wrap">
              <table class="kb-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>文档</th>
                    <th>状态</th>
                    <th>最后索引</th>
                    <th>最后使用</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in filteredKbRecords"
                    :key="row.id"
                    :class="{ active: selectedKb === row.name }"
                    @click="selectKbRow(row.name)"
                  >
                    <td>
                      <div class="kb-cell-title">{{ row.name }}</div>
                      <div class="kb-cell-sub">{{ row.id }}</div>
                    </td>
                    <td>{{ row.docCount }}</td>
                    <td>{{ row.indexStatus || 'idle' }}</td>
                    <td>{{ formatTs(row.lastIndexedAt) }}</td>
                    <td>{{ formatTs(row.lastUsedAt) }}</td>
                  </tr>
                  <tr v-if="filteredKbRecords.length === 0">
                    <td colspan="5" class="kb-empty">暂无匹配知识库</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="wizard">
            <h3>创建知识库向导</h3>
            <p class="muted">只需三步：命名 -> 选择导入方式 -> 一键创建并加载。</p>
            <div class="wizard-steps">
              <span class="chip" :class="wizardStepClass('name')">A. 命名</span>
              <span class="chip" :class="wizardStepClass('source')">B. 选择导入源</span>
              <span class="chip" :class="wizardStepClass('create')">C. 创建并加载</span>
            </div>
            <label>步骤 A：知识库名称<input v-model="newKbName" placeholder="例如：project-notes" /></label>
            <label>步骤 B：导入方式</label>
            <div class="row row-gap">
              <label class="radio"><input type="radio" value="empty" v-model="createMode" /> 创建空知识库</label>
              <label class="radio"><input type="radio" value="files" v-model="createMode" /> 导入 Markdown 文件</label>
              <label class="radio"><input type="radio" value="directory" v-model="createMode" /> 导入 Markdown 目录</label>
            </div>
            <div class="row row-gap" v-if="createMode === 'files'">
              <button class="btn secondary" :disabled="busyState.data" @click="pickWizardFiles">选择 Markdown 文件</button>
              <span class="muted inline">已选 {{ wizardFiles.length }} 个文件</span>
            </div>
            <div class="row row-gap" v-if="createMode === 'directory'">
              <button class="btn secondary" :disabled="busyState.data" @click="pickWizardDirectory">选择 Markdown 根目录</button>
              <span class="muted inline">{{ wizardDirectory || '未选择目录' }}</span>
            </div>
            <div class="row row-gap">
              <button class="btn" :disabled="busyState.data" @click="createKnowledgeBaseWithGuide">步骤 C：创建并加载</button>
              <span class="mono">{{ kbBuildInfo }}</span>
            </div>
          </div>

          <button class="btn" :disabled="busyState.index || !canIndex" @click="rebuildIndex">{{ busyState.index ? '索引中...' : '3) 重建索引' }}</button>
          <p class="warn-text" v-if="!canIndex">{{ indexBlocker }}</p>
          <p class="mono">{{ indexInfo }}</p>
        </div>

        <div v-if="activePanel === 'feedback'">
          <div class="row row-gap">
            <p class="muted">每次点击都会在这里显示进行状态与结果。</p>
            <button class="btn secondary" @click="clearOperationLogs">清空反馈</button>
          </div>
          <div class="op-state" :class="operationState.type">{{ operationState.text }}</div>
          <ul class="ops-list">
            <li v-for="item in operationLogs" :key="item.id">
              <span class="ops-time">[{{ item.time }}]</span>
              <span class="ops-type" :class="item.type">{{ item.type }}</span>
              <span>{{ item.message }}</span>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <footer class="log">{{ log }}</footer>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const config = reactive({
  ollamaUrl: '',
  vectorBackend: 'qdrant',
  qdrantUrl: 'http://127.0.0.1:6333',
  qdrantApiKey: '',
  qdrantCollection: 'mdrag_chunks',
  embeddingModel: '',
  chatModel: '',
  pythonExec: '',
  mdragWorkdir: '',
  dbPath: '',
  workspaceRoot: '',
  selectedKnowledgeBase: '',
  selectedKnowledgeBaseId: '',
  knowledgeSources: [],
  retrievalStrategy: 'hybrid',
  chunkSize: 600,
  chunkOverlap: 120,
  denseCandidateMultiplier: 3,
  rrfK: 60,
  minRetrievalScore: 0,
  maxContextChars: 5000,
  bm25K1: 1.5,
  bm25B: 0.75,
  reranker: 'token_overlap',
  rerankTopN: 8,
  topK: 4,
  embedTimeoutSec: 60,
  chatTimeoutSec: 180,
  uiTheme: 'github-light',
  __meta: {
    lastSavedAt: ''
  }
})

const doctor = reactive({ ok: false, models: [], raw: '' })
const customModel = ref('')
const question = ref('')
const askResult = ref(null)
const displayedAnswer = ref('')
const indexInfo = ref('')
const indexParamsInfo = ref('')
const kbBuildInfo = ref('')
const log = ref('就绪')
const indexBuilt = ref(false)
const busyState = reactive({
  manual: false,
  doctor: false,
  runtime: false,
  config: false,
  data: false,
  index: false,
  ask: false
})
const operationState = reactive({ type: 'idle', text: '等待操作' })
const operationLogs = ref([])
const configDirty = ref(false)
const configWatchReady = ref(false)
const suppressConfigWatch = ref(false)

const kbOptions = ref([])
const kbRecords = ref([])
const selectedKb = ref('')
const renameKbName = ref('')
const kbSearch = ref('')
const kbSortKey = ref('updatedAt')
const kbSortDir = ref('desc')
const newKbName = ref('')
const createMode = ref('empty')
const wizardFiles = ref([])
const wizardDirectory = ref('')

const activePanel = ref('')
const expertMode = ref(false)
const runtimeStatus = reactive({
  python: false,
  docker: false,
  ollama: false,
  qdrant: false,
  scriptPath: '',
  offlineScriptPath: ''
})
const runtimeOptions = reactive({
  offline: false,
  assetRoot: '',
  installPython: true,
  installDocker: true,
  installOllama: true,
  startQdrant: true,
  pullModel: false,
  modelName: 'llama3.1:8b'
})
const toast = reactive({ show: false, type: 'info', text: '' })
let toastTimer = null
const typingState = reactive({ active: false, progress: 0 })
let typingTimer = null
const askElapsedSec = ref(0)
let askElapsedTimer = null
let askStreamRequestId = ''
let askStreamUnsub = null

const configReady = computed(() => {
  return !!(
    config.ollamaUrl &&
    config.embeddingModel &&
    config.chatModel &&
    config.pythonExec &&
    config.mdragWorkdir &&
    config.dbPath &&
    config.workspaceRoot
  )
})
const step1Done = computed(() => !!(config.__meta?.lastSavedAt && configReady.value && !configDirty.value))
const step2Done = computed(() => !!(config.selectedKnowledgeBase && Array.isArray(config.knowledgeSources) && config.knowledgeSources.length > 0))

const doctorText = computed(() => (doctor.ok ? `Ollama 正常（${doctor.models.length} 个模型）` : 'Ollama 未检查'))
const selectedKbRecord = computed(() => kbRecords.value.find((x) => x.name === selectedKb.value) || null)
const runtimeStatusText = computed(() => {
  const ok = runtimeStatus.python && runtimeStatus.docker && runtimeStatus.ollama && runtimeStatus.qdrant
  if (ok) return '最小运行环境就绪（Python/Docker/Ollama/Qdrant）'
  const miss = []
  if (!runtimeStatus.python) miss.push('Python')
  if (!runtimeStatus.docker) miss.push('Docker')
  if (!runtimeStatus.ollama) miss.push('Ollama')
  if (!runtimeStatus.qdrant) miss.push('Qdrant')
  return `最小运行环境未就绪：${miss.join('、')}`
})
const filteredKbRecords = computed(() => {
  const key = String(kbSortKey.value || 'updatedAt')
  const dir = kbSortDir.value === 'asc' ? 1 : -1
  const q = String(kbSearch.value || '').trim().toLowerCase()
  const rows = kbRecords.value.filter((x) => {
    if (!q) return true
    const fields = [x.name, x.id, x.path, x.indexStatus].map((v) => String(v || '').toLowerCase())
    return fields.some((v) => v.includes(q))
  })
  rows.sort((a, b) => {
    const av = String(a?.[key] || '')
    const bv = String(b?.[key] || '')
    if (key === 'docCount') return (Number(a?.docCount || 0) - Number(b?.docCount || 0)) * dir
    return av.localeCompare(bv, 'zh-Hans-CN') * dir
  })
  return rows
})
const themeOptions = [
  { value: 'github-light', label: 'GitHub Light（默认）' },
  { value: 'github-dark', label: 'GitHub Dark（深色）' },
  { value: 'atlassian-light', label: 'Atlassian 企业蓝' },
  { value: 'azure-light', label: 'Azure 商务蓝' },
  { value: 'notion-neutral', label: 'Notion 中性灰' },
  { value: 'ibm-contrast', label: 'IBM 高对比' },
  { value: 'slate-dark', label: 'Slate Graphite（深色）' }
]
const modelOptions = computed(() => {
  const local = Array.isArray(doctor.models) ? doctor.models.filter(Boolean) : []
  if (local.length > 0) return local
  const fallback = []
  if (config.embeddingModel) fallback.push(config.embeddingModel)
  if (config.chatModel) fallback.push(config.chatModel)
  return Array.from(new Set(fallback))
})
const renderedAnswer = computed(() => renderMarkdownSafe(displayedAnswer.value || ''))
const activePanelTitle = computed(() => {
  if (activePanel.value === 'config') return '配置设置'
  if (activePanel.value === 'kb') return '知识库设置'
  if (activePanel.value === 'feedback') return '操作反馈'
  return ''
})
const currentStepText = computed(() => {
  if (!step1Done.value) return '步骤 1：先保存配置（右上角 配置设置）'
  if (!step2Done.value) return '步骤 2：在下拉框加载知识库（右上角 知识库设置）'
  if (!indexBuilt.value) return '步骤 3：重建索引（右上角 知识库设置）'
  if (!askResult.value) return '步骤 4：发起提问'
  return '全部完成，可继续提问或更新知识库'
})
const stepProgress = computed(() => {
  let done = 0
  if (step1Done.value) done += 1
  if (step2Done.value) done += 1
  if (indexBuilt.value) done += 1
  if (askResult.value) done += 1
  return done * 25
})
const nextActionText = computed(() => {
  if (!step1Done.value) return '下一步：打开配置设置'
  if (!step2Done.value) return '下一步：打开知识库设置'
  if (!indexBuilt.value) return '下一步：重建索引'
  if (!question.value.trim()) return '下一步：填入示例问题'
  if (!askResult.value) return '下一步：开始提问'
  return '已完成，可继续提问'
})
const currentPresetName = computed(() => {
  const strategy = String(config.retrievalStrategy || '').toLowerCase()
  const reranker = String(config.reranker || '').toLowerCase()
  const topK = Number(config.topK || 0)
  if (strategy === 'hybrid' && reranker === 'token_overlap' && topK === 4) return '文档问答（推荐）'
  if (strategy === 'hybrid' && reranker === 'token_overlap' && topK >= 6) return '代码库问答'
  if (strategy === 'hybrid' && reranker === 'llm_score') return '高精度慢速'
  return '自定义'
})
const missingConfigFields = computed(() => {
  const missing = []
  if (!config.ollamaUrl) missing.push('Ollama URL')
  if (!config.embeddingModel) missing.push('向量模型')
  if (!config.chatModel) missing.push('对话模型')
  if (!config.pythonExec) missing.push('Python')
  if (!config.mdragWorkdir) missing.push('RAG 工作目录')
  if (!config.dbPath) missing.push('索引数据库路径')
  if (!config.workspaceRoot) missing.push('知识库工作空间')
  if (config.vectorBackend === 'qdrant' && !config.qdrantUrl) missing.push('Qdrant URL')
  if (config.vectorBackend === 'qdrant' && !config.qdrantCollection) missing.push('Qdrant Collection')
  return missing
})
const canIndex = computed(() => {
  return missingConfigFields.value.length === 0 && step2Done.value
})
const canAsk = computed(() => {
  return canIndex.value && indexBuilt.value && !!question.value.trim()
})
const indexBlocker = computed(() => {
  if (missingConfigFields.value.length > 0) return `请先补全配置：${missingConfigFields.value.join('、')}`
  if (!step2Done.value) return '请先加载知识库（右上角 知识库设置）'
  return ''
})
const askBlocker = computed(() => {
  if (!canIndex.value) return indexBlocker.value
  if (!indexBuilt.value) return '请先重建索引，再提问'
  if (!question.value.trim()) return '请先输入问题'
  return ''
})
const workflowBlockerText = computed(() => {
  if (missingConfigFields.value.length > 0) return `当前阻塞：配置未完成（${missingConfigFields.value.join('、')}）`
  if (!step2Done.value) return '当前阻塞：尚未加载知识库'
  if (!indexBuilt.value) return '当前阻塞：尚未重建索引'
  return ''
})
const advancedWarnings = computed(() => {
  const warnings = []
  if (Number(config.chunkOverlap) >= Number(config.chunkSize)) warnings.push('chunk_overlap 不应大于等于 chunk_size，建议 overlap 为 chunk 的 10%~30%。')
  if (Number(config.rerankTopN) < Number(config.topK)) warnings.push('rerank_top_n 小于 top_k，可能导致重排无效。')
  if (Number(config.maxContextChars) < 1500) warnings.push('max_context_chars 过小，回答可能上下文不足。')
  if (String(config.reranker) === 'llm_score' && Number(config.chatTimeoutSec) < 120) warnings.push('llm_score 模式建议 chat_timeout_sec >= 120，避免超时。')
  return warnings
})
const knowledgeFallbackNotice = computed(() => {
  const mode = askResult.value?.retrieval?.fallback_mode
  if (mode === 'model_only') {
    return '未检索到合适知识库片段，当前回答来自模型直答（非知识库证据回答）。'
  }
  return ''
})

function openPanel(name) {
  activePanel.value = name
}

function guideGoNext() {
  if (!step1Done.value) {
    openPanel('config')
    return
  }
  if (!step2Done.value) {
    openPanel('kb')
    return
  }
  if (!indexBuilt.value) {
    openPanel('kb')
    return
  }
  if (!question.value.trim()) {
    fillExampleQuestion()
    return
  }
  if (!askResult.value && canAsk.value) {
    ask()
    return
  }
}

function closePanel() {
  activePanel.value = ''
}

function wizardStepClass(step) {
  const hasName = !!newKbName.value.trim()
  const sourceReady = createMode.value === 'empty' || (createMode.value === 'files' && wizardFiles.value.length > 0) || (createMode.value === 'directory' && !!wizardDirectory.value)
  if (step === 'name') return hasName ? 'done' : 'current'
  if (step === 'source') return sourceReady ? 'done' : (hasName ? 'current' : 'todo')
  if (step === 'create') return 'todo'
  return 'todo'
}

async function refreshConfig() {
  const cfg = await window.desktopRag.getConfig()
  applyConfigFromSystem(cfg)
  selectedKb.value = cfg.selectedKnowledgeBase || ''
  configWatchReady.value = true
  pushOp('成功', '已加载本地配置')
}

async function refreshKnowledgeBases() {
  if (!window.desktopRag || typeof window.desktopRag.listKnowledgeBases !== 'function') {
    endAction(false, '当前客户端版本过旧，请重启应用后重试（缺少知识库列表接口）')
    return
  }
  beginAction('正在刷新知识库列表...', 'data')
  try {
    const res = await window.desktopRag.listKnowledgeBases()
    if (!res.ok) throw new Error('刷新知识库列表失败')
    kbRecords.value = Array.isArray(res.records) ? res.records : []
    kbOptions.value = kbRecords.value.map((x) => x.name)
    selectedKb.value = config.selectedKnowledgeBase || res.selectedKnowledgeBase || ''
    endAction(true, `已刷新知识库列表，共 ${kbOptions.value.length} 个`, 'data')
  } catch (err) {
    endAction(false, `刷新知识库列表失败：${err.message}`, 'data')
  }
}

async function saveConfig() {
  beginAction('正在保存配置...', 'config')
  try {
    const res = await window.desktopRag.saveConfig({ ...config })
    if (!res.ok) throw new Error('保存配置失败')
    applyConfigFromSystem(res.config)
    await refreshKnowledgeBases()
    endAction(true, '配置保存成功', 'config')
    log.value = '配置已保存'
  } catch (err) {
    endAction(false, `配置保存失败：${err.message}`, 'config')
    log.value = `配置保存失败：${err.message}`
  }
}

async function loadSelectedKnowledgeBase() {
  if (!selectedKb.value) {
    endAction(false, '请先在下拉框选择知识库')
    return
  }
  beginAction(`正在加载知识库：${selectedKb.value}`, 'data')
  try {
    const res = await window.desktopRag.selectKnowledgeBase(selectedKb.value)
    if (!res.ok) throw new Error(res.error || '加载知识库失败')
    applyConfigFromSystem(res.config)
    selectedKb.value = res.selectedKnowledgeBase || selectedKb.value
    renameKbName.value = ''
    await refreshKnowledgeBases()
    indexBuilt.value = false
    endAction(true, `知识库已加载：${selectedKb.value}（请重建索引）`, 'data')
  } catch (err) {
    endAction(false, `加载知识库失败：${err.message}`, 'data')
  }
}

async function unloadKnowledgeBase() {
  beginAction('正在卸载当前知识库...', 'data')
  try {
    const res = await window.desktopRag.unloadKnowledgeBase()
    if (!res.ok) throw new Error('卸载失败')
    applyConfigFromSystem(res.config)
    selectedKb.value = ''
    renameKbName.value = ''
    indexBuilt.value = false
    await refreshKnowledgeBases()
    endAction(true, '已卸载当前知识库', 'data')
  } catch (err) {
    endAction(false, `卸载失败：${err.message}`, 'data')
  }
}

async function deleteSelectedKnowledgeBase() {
  if (!selectedKb.value) {
    endAction(false, '请先选择要删除的知识库')
    return
  }
  beginAction(`正在删除知识库：${selectedKb.value}`, 'data')
  try {
    const res = await window.desktopRag.deleteKnowledgeBase(selectedKb.value)
    if (!res.ok) throw new Error(res.error || '删除失败')
    kbRecords.value = Array.isArray(res.records) ? res.records : []
    kbOptions.value = kbRecords.value.map((x) => x.name)
    if (config.selectedKnowledgeBase === selectedKb.value) {
      config.selectedKnowledgeBase = ''
      config.selectedKnowledgeBaseId = ''
      config.knowledgeSources = []
      selectedKb.value = ''
      indexBuilt.value = false
    }
    endAction(true, '知识库删除成功', 'data')
  } catch (err) {
    endAction(false, `删除知识库失败：${err.message}`, 'data')
  }
}

async function renameSelectedKnowledgeBase() {
  const nextName = renameKbName.value.trim()
  if (!selectedKb.value || !nextName) {
    endAction(false, '请先选择知识库并输入新名称')
    return
  }
  beginAction(`正在重命名知识库：${selectedKb.value} -> ${nextName}`, 'data')
  try {
    const res = await window.desktopRag.renameKnowledgeBase(selectedKb.value, nextName)
    if (!res.ok) throw new Error(res.error || '重命名失败')
    kbRecords.value = Array.isArray(res.list) ? res.list : []
    kbOptions.value = kbRecords.value.map((x) => x.name)
    if (config.selectedKnowledgeBase === selectedKb.value && res.record) {
      config.selectedKnowledgeBase = res.record.name
      config.selectedKnowledgeBaseId = res.record.id
      config.knowledgeSources = [res.record.path]
      selectedKb.value = res.record.name
    } else {
      selectedKb.value = nextName
    }
    renameKbName.value = ''
    endAction(true, '知识库重命名成功', 'data')
  } catch (err) {
    endAction(false, `重命名知识库失败：${err.message}`, 'data')
  }
}

async function pickWorkspaceRoot() {
  if (!window.desktopRag || typeof window.desktopRag.pickWorkspaceRoot !== 'function') {
    endAction(false, '当前客户端版本过旧，请重启应用后重试（缺少工作空间选择接口）')
    return
  }
  beginAction('正在选择知识库工作空间...', 'data')
  try {
    const picked = await window.desktopRag.pickWorkspaceRoot()
    if (!picked.ok) {
      endAction(false, '已取消选择工作空间', 'data')
      return
    }
    config.workspaceRoot = picked.path
    configDirty.value = true
    endAction(true, `已选择工作空间：${picked.path}，请保存配置`, 'data')
  } catch (err) {
    endAction(false, `选择工作空间失败：${err.message}`, 'data')
  }
}

async function pickWizardFiles() {
  if (!window.desktopRag || typeof window.desktopRag.pickMarkdownFiles !== 'function') {
    endAction(false, '当前客户端版本过旧，请重启应用后重试（缺少文件选择接口）')
    return
  }
  beginAction('正在选择 Markdown 文件...', 'data')
  try {
    const picked = await window.desktopRag.pickMarkdownFiles()
    if (!picked.ok) {
      endAction(false, '已取消选择 Markdown 文件', 'data')
      return
    }
    wizardFiles.value = picked.files || []
    kbBuildInfo.value = `已选择 ${wizardFiles.value.length} 个 Markdown 文件`
    endAction(true, 'Markdown 文件选择成功', 'data')
  } catch (err) {
    endAction(false, `选择文件失败：${err.message}`, 'data')
  }
}

async function pickWizardDirectory() {
  if (!window.desktopRag || typeof window.desktopRag.pickMarkdownDirectory !== 'function') {
    endAction(false, '当前客户端版本过旧，请重启应用后重试（缺少目录选择接口）')
    return
  }
  beginAction('正在选择 Markdown 根目录...', 'data')
  try {
    const picked = await window.desktopRag.pickMarkdownDirectory()
    if (!picked.ok) {
      endAction(false, '已取消选择 Markdown 根目录', 'data')
      return
    }
    wizardDirectory.value = picked.path || ''
    kbBuildInfo.value = `已选择目录：${wizardDirectory.value}`
    endAction(true, 'Markdown 根目录选择成功', 'data')
  } catch (err) {
    endAction(false, `选择目录失败：${err.message}`, 'data')
  }
}

async function createKnowledgeBaseWithGuide() {
  const name = newKbName.value.trim()
  if (!name) {
    endAction(false, '请先输入知识库名称')
    return
  }
  if (createMode.value === 'files' && wizardFiles.value.length === 0) {
    endAction(false, '请选择要导入的 Markdown 文件')
    return
  }
  if (createMode.value === 'directory' && !wizardDirectory.value) {
    endAction(false, '请选择要导入的 Markdown 根目录')
    return
  }

  beginAction(`正在创建知识库：${name}`, 'data')
  try {
    const created = await window.desktopRag.createKnowledgeBase(name)
    if (!created.ok) throw new Error(created.error || '创建知识库失败')
    const finalName = created.created.name

    if (createMode.value === 'files') {
      const imported = await window.desktopRag.importMarkdownFilesToKnowledgeBase(finalName, wizardFiles.value)
      if (!imported.ok) throw new Error(imported.error || '导入 Markdown 文件失败')
      kbBuildInfo.value = `知识库 ${finalName} 已创建，导入文件 ${imported.imported} 个`
    }

    if (createMode.value === 'directory') {
      const imported = await window.desktopRag.importMarkdownDirectoryToKnowledgeBase(finalName, wizardDirectory.value)
      if (!imported.ok) throw new Error(imported.error || '导入 Markdown 目录失败')
      kbBuildInfo.value = `知识库 ${finalName} 已创建，目录扫描 ${imported.scanned} 个，导入 ${imported.imported} 个`
    }

    if (createMode.value === 'empty') {
      kbBuildInfo.value = `知识库 ${finalName} 已创建（空库）`
    }

    const loaded = await window.desktopRag.selectKnowledgeBase(finalName)
    if (!loaded.ok) throw new Error(loaded.error || '加载新知识库失败')
    applyConfigFromSystem(loaded.config)
    selectedKb.value = finalName
    kbRecords.value = Array.isArray(created.records) ? created.records : kbRecords.value
    kbOptions.value = kbRecords.value.map((x) => x.name)
    indexBuilt.value = false

    wizardFiles.value = []
    wizardDirectory.value = ''
    newKbName.value = finalName

    endAction(true, `知识库创建并加载成功：${finalName}（请重建索引）`, 'data')
  } catch (err) {
    endAction(false, `创建知识库失败：${err.message}`, 'data')
  }
}

async function runDoctor() {
  beginAction('正在执行健康检查...', 'doctor')
  try {
    const res = await window.desktopRag.doctor()
    Object.assign(doctor, res)
    if (!res.ok) throw new Error('Ollama 不可用或配置不正确')
    const qdrantText = res.qdrant ? `；Qdrant=${res.qdrant.ok ? '正常' : `异常(${res.qdrant.detail})`}` : ''
    endAction(true, `健康检查通过，检测到 ${res.models.length} 个模型${qdrantText}`, 'doctor')
    log.value = '健康检查通过'
  } catch (err) {
    endAction(false, `健康检查失败：${err.message}`, 'doctor')
    log.value = `健康检查失败：${err.message}`
  }
}

async function refreshRuntimeStatus() {
  beginAction('正在检测最小运行环境状态...', 'runtime')
  try {
    const res = await window.desktopRag.getRuntimeStatus()
    if (!res.ok) throw new Error(res.error || '环境状态检测失败')
    runtimeStatus.python = !!res.python
    runtimeStatus.docker = !!res.docker
    runtimeStatus.ollama = !!res.ollama
    runtimeStatus.qdrant = !!res.qdrant
    runtimeStatus.scriptPath = String(res.scriptPath || '')
    runtimeStatus.offlineScriptPath = String(res.offlineScriptPath || '')
    if (!runtimeOptions.assetRoot && runtimeStatus.offlineScriptPath) {
      runtimeOptions.assetRoot = deriveOfflineAssetRoot(runtimeStatus.offlineScriptPath)
    }
    endAction(true, runtimeStatusText.value, 'runtime')
  } catch (err) {
    endAction(false, `环境状态检测失败：${err.message}`, 'runtime')
  }
}

async function runRuntimeSetup() {
  beginAction('正在执行最小环境一键部署（可能需要几分钟）...', 'runtime')
  try {
    const res = await window.desktopRag.setupRuntime({
      offline: !!runtimeOptions.offline,
      assetRoot: String(runtimeOptions.assetRoot || ''),
      installPython: !!runtimeOptions.installPython,
      installDocker: !!runtimeOptions.installDocker,
      installOllama: !!runtimeOptions.installOllama,
      startQdrant: !!runtimeOptions.startQdrant,
      pullModel: !!runtimeOptions.pullModel,
      modelName: String(runtimeOptions.modelName || 'llama3.1:8b')
    })
    if (!res.ok) {
      const detail = (res.stderr || res.stdout || res.error || 'unknown error').slice(0, 600)
      throw new Error(detail)
    }
    config.vectorBackend = 'qdrant'
    config.qdrantUrl = config.qdrantUrl || 'http://127.0.0.1:6333'
    config.qdrantCollection = config.qdrantCollection || 'mdrag_chunks'
    configDirty.value = true
    await refreshRuntimeStatus()
    endAction(true, '最小环境部署完成，已切换默认后端为 Qdrant，请保存配置', 'runtime')
  } catch (err) {
    endAction(false, `最小环境部署失败：${err.message}`, 'runtime')
  }
}

async function rebuildIndex() {
  beginAction('正在重建索引...', 'index')
  try {
    const res = await window.desktopRag.index()
    indexInfo.value = `成功=${res.ok} 合并文件数=${res.mergedFiles} 索引块数=${res.indexedChunks}`
    if (res.vectorConfig) {
      indexInfo.value += ` 向量后端=${res.vectorConfig.vectorBackend} kb_id=${res.vectorConfig.kbId}`
    }
    if (res.retrievalConfig) {
      const c = res.retrievalConfig
      indexParamsInfo.value = `索引参数：chunk_size=${c.chunkSize} chunk_overlap=${c.chunkOverlap} strategy=${c.retrievalStrategy} reranker=${c.reranker} top_k=${c.topK} rerank_top_n=${c.rerankTopN} max_context_chars=${c.maxContextChars} embed_timeout_sec=${c.embedTimeoutSec} chat_timeout_sec=${c.chatTimeoutSec}`
    } else {
      indexParamsInfo.value = ''
    }
    indexBuilt.value = !!res.ok
    if (!res.ok) throw new Error(res.raw || '索引构建失败')
    endAction(true, `索引重建完成，索引块数=${res.indexedChunks}`, 'index')
    log.value = '索引重建完成'
  } catch (err) {
    endAction(false, `索引失败：${err.message}`, 'index')
    log.value = `索引失败：${err.message}`
  }
}

async function ask() {
  if (!question.value.trim()) {
    endAction(false, '请输入问题后再提问')
    return
  }
  beginAction('正在向本地模型提问...', 'ask')
  askElapsedSec.value = 0
  displayedAnswer.value = ''
  typingState.active = true
  typingState.progress = 0
  if (askElapsedTimer) clearInterval(askElapsedTimer)
  askElapsedTimer = setInterval(() => {
    askElapsedSec.value += 1
  }, 1000)
  try {
    const canStream = window.desktopRag && typeof window.desktopRag.askStreamStart === 'function' && typeof window.desktopRag.onAskStreamEvent === 'function'
    if (!canStream) {
      const res = await window.desktopRag.ask(question.value.trim())
      if (!res.ok) throw new Error(res.error || '未知错误')
      askResult.value = res.result
      startTypewriter(res.result?.answer || '')
      endAction(true, `提问完成，返回来源数=${res.result.sourceDetails?.length || 0}`, 'ask')
      log.value = '提问完成'
      return
    }

    const done = await askWithStream(question.value.trim())
    if (!done.ok) throw new Error(done.error || '流式提问失败')
    endAction(true, `提问完成，返回来源数=${done.result?.sourceDetails?.length || 0}`, 'ask')
    log.value = '提问完成'
  } catch (err) {
    typingState.active = false
    endAction(false, `提问失败：${err.message}`, 'ask')
    log.value = `提问失败：${err.message}`
  } finally {
    if (askElapsedTimer) {
      clearInterval(askElapsedTimer)
      askElapsedTimer = null
    }
  }
}

function applyRecommendedConfig() {
  config.ollamaUrl = 'http://127.0.0.1:11434'
  config.vectorBackend = 'qdrant'
  config.qdrantUrl = 'http://127.0.0.1:6333'
  config.qdrantApiKey = ''
  config.qdrantCollection = 'mdrag_chunks'
  config.embeddingModel = 'llama3.1:8b'
  config.chatModel = 'llama3.1:8b'
  config.pythonExec = 'python'
  if (!config.mdragWorkdir) config.mdragWorkdir = 'rag-core'
  if (!config.dbPath) {
    config.dbPath = `${config.mdragWorkdir}\\index.db`
  }
  if (!config.workspaceRoot) {
    config.workspaceRoot = `${config.mdragWorkdir}\\knowledge_bases`
  }
  applyBalancedRetrievalPreset()
  configDirty.value = true
  log.value = '已填入推荐配置，请点击“保存配置”'
}

function applyBalancedRetrievalPreset() {
  config.retrievalStrategy = 'hybrid'
  config.reranker = 'token_overlap'
  config.topK = 4
  config.chunkSize = 600
  config.chunkOverlap = 120
  config.denseCandidateMultiplier = 3
  config.rrfK = 60
  config.minRetrievalScore = 0
  config.maxContextChars = 5000
  config.bm25K1 = 1.5
  config.bm25B = 0.75
  config.rerankTopN = 8
  config.embedTimeoutSec = 60
  config.chatTimeoutSec = 180
  configDirty.value = true
  pushOp('成功', '已应用平衡预设（hybrid + token_overlap）')
}

function applyHighAccuracyPreset() {
  config.retrievalStrategy = 'hybrid'
  config.reranker = 'llm_score'
  config.topK = 4
  config.chunkSize = 600
  config.chunkOverlap = 120
  config.denseCandidateMultiplier = 4
  config.rrfK = 60
  config.minRetrievalScore = 0
  config.maxContextChars = 7000
  config.bm25K1 = 1.7
  config.bm25B = 0.75
  config.rerankTopN = 6
  config.embedTimeoutSec = 90
  config.chatTimeoutSec = 240
  configDirty.value = true
  pushOp('成功', '已应用高精度预设（hybrid + llm_score）')
}

function applyScenarioPreset(kind) {
  if (kind === 'docs') {
    applyBalancedRetrievalPreset()
    config.topK = 4
    config.maxContextChars = 5000
    pushOp('成功', '已应用模板：文档问答（推荐）')
    log.value = '模板已应用：文档问答，请保存配置'
    return
  }
  if (kind === 'code') {
    config.retrievalStrategy = 'hybrid'
    config.reranker = 'token_overlap'
    config.topK = 6
    config.chunkSize = 500
    config.chunkOverlap = 100
    config.denseCandidateMultiplier = 4
    config.rrfK = 60
    config.minRetrievalScore = 0
    config.maxContextChars = 8000
    config.bm25K1 = 1.9
    config.bm25B = 0.7
    config.rerankTopN = 10
    config.embedTimeoutSec = 90
    config.chatTimeoutSec = 240
    configDirty.value = true
    pushOp('成功', '已应用模板：代码库问答')
    log.value = '模板已应用：代码库问答，请保存配置'
    return
  }
  applyHighAccuracyPreset()
  pushOp('成功', '已应用模板：高精度慢速')
  log.value = '模板已应用：高精度慢速，请保存配置'
}

function useDemoSource() {
  newKbName.value = 'demo-kb'
  createMode.value = 'directory'
  wizardDirectory.value = joinWinPath(config.mdragWorkdir || 'rag-core', 'knowledge')
  kbBuildInfo.value = '已填入演示库创建参数，点击“步骤 C：创建并加载”'
  pushOp('成功', '已填入演示知识库创建参数')
}

function fillExampleQuestion() {
  question.value = '请总结本地RAG完整流程，并列出数据加卸载能力。'
  log.value = '已填入示例问题'
  pushOp('成功', '已填入示例问题')
}

function useCustomModel() {
  const name = customModel.value.trim()
  if (!name) {
    endAction(false, '请先输入自定义模型名')
    return
  }
  config.embeddingModel = name
  config.chatModel = name
  configDirty.value = true
  pushOp('成功', `已设置自定义模型：${name}`)
  log.value = `已设置模型：${name}，请保存配置`
}

async function openManual() {
  beginAction('正在打开操作手册...', 'manual')
  try {
    const res = await window.desktopRag.openManual()
    if (!res.ok) throw new Error('无法打开手册窗口')
    endAction(true, '操作手册已在新窗口打开', 'manual')
  } catch (err) {
    endAction(false, `打开手册失败：${err.message}`, 'manual')
  }
}

function stepClass(step) {
  if (step === 1) return step1Done.value ? 'done' : 'current'
  if (step === 2) return step2Done.value ? 'done' : (step1Done.value ? 'current' : 'todo')
  if (step === 3) return indexBuilt.value ? 'done' : (step1Done.value && step2Done.value ? 'current' : 'todo')
  if (step === 4) return askResult.value ? 'done' : (indexBuilt.value ? 'current' : 'todo')
  return 'todo'
}

onMounted(async () => {
  await refreshConfig()
  await refreshKnowledgeBases()
  await refreshRuntimeStatus()
  await runDoctor()
  if (!window.desktopRag || typeof window.desktopRag.listKnowledgeBases !== 'function') {
    pushOp('提示', '检测到预加载接口未更新，请完全退出并重新启动应用')
  }
})

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
  if (typingTimer) clearInterval(typingTimer)
  if (askElapsedTimer) clearInterval(askElapsedTimer)
  if (askStreamUnsub) {
    askStreamUnsub()
    askStreamUnsub = null
  }
  if (askStreamRequestId && window.desktopRag && typeof window.desktopRag.askStreamCancel === 'function') {
    window.desktopRag.askStreamCancel(askStreamRequestId)
  }
})

watch(createMode, () => {
  kbBuildInfo.value = ''
})

watch(
  () => config.uiTheme,
  (theme) => {
    applyUiTheme(theme)
  }
)

watch(
  () => [
    config.ollamaUrl,
    config.vectorBackend,
    config.qdrantUrl,
    config.qdrantApiKey,
    config.qdrantCollection,
    config.embeddingModel,
    config.chatModel,
    config.pythonExec,
    config.mdragWorkdir,
    config.dbPath,
    config.workspaceRoot,
    config.selectedKnowledgeBase,
    config.selectedKnowledgeBaseId,
    config.retrievalStrategy,
    config.chunkSize,
    config.chunkOverlap,
    config.denseCandidateMultiplier,
    config.rrfK,
    config.minRetrievalScore,
    config.maxContextChars,
    config.bm25K1,
    config.bm25B,
    config.reranker,
    config.rerankTopN,
    config.topK,
    config.embedTimeoutSec,
    config.chatTimeoutSec,
    config.uiTheme,
    JSON.stringify(config.knowledgeSources || [])
  ],
  () => {
    if (!configWatchReady.value) return
    if (suppressConfigWatch.value) return
    configDirty.value = true
  }
)

function applyConfigFromSystem(nextCfg) {
  suppressConfigWatch.value = true
  Object.assign(config, nextCfg || {})
  applyUiTheme(config.uiTheme)
  configDirty.value = false
  setTimeout(() => {
    suppressConfigWatch.value = false
  }, 0)
}

function applyUiTheme(theme) {
  const allow = new Set(['github-light', 'github-dark', 'atlassian-light', 'azure-light', 'notion-neutral', 'ibm-contrast', 'slate-dark'])
  const val = allow.has(String(theme || '')) ? theme : 'github-light'
  document.documentElement.setAttribute('data-theme', val)
}

function nowText() {
  const d = new Date()
  return d.toLocaleTimeString()
}

function pushOp(type, message) {
  operationLogs.value = [{ id: `${Date.now()}-${Math.random()}`, time: nowText(), type, message }, ...operationLogs.value].slice(0, 18)
}

function beginAction(text, kind = '') {
  if (kind && Object.prototype.hasOwnProperty.call(busyState, kind)) busyState[kind] = true
  operationState.type = 'info'
  operationState.text = text
  pushOp('开始', text)
  showToast('info', text)
}

function endAction(ok, text, kind = '') {
  if (kind && Object.prototype.hasOwnProperty.call(busyState, kind)) busyState[kind] = false
  operationState.type = ok ? 'success' : 'error'
  operationState.text = text
  pushOp(ok ? '成功' : '失败', text)
  showToast(ok ? 'success' : 'error', text)
}

function clearOperationLogs() {
  operationLogs.value = []
  operationState.type = 'idle'
  operationState.text = '反馈已清空'
  showToast('info', '操作反馈已清空')
}

function showToast(type, text) {
  toast.type = type
  toast.text = text
  toast.show = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.show = false
  }, type === 'error' ? 5000 : 2600)
}

function startTypewriter(fullText) {
  const text = String(fullText || '')
  displayedAnswer.value = ''
  typingState.active = true
  typingState.progress = 0
  if (typingTimer) clearInterval(typingTimer)
  if (!text) {
    typingState.active = false
    typingState.progress = 100
    return
  }
  const total = text.length
  const step = total > 1200 ? 18 : total > 400 ? 10 : 4
  let i = 0
  typingTimer = setInterval(() => {
    i = Math.min(i + step, total)
    displayedAnswer.value = text.slice(0, i)
    typingState.progress = Math.min(100, Math.floor((i / total) * 100))
    if (i >= total) {
      clearInterval(typingTimer)
      typingTimer = null
      typingState.active = false
      typingState.progress = 100
    }
  }, 24)
}

async function askWithStream(q) {
  return new Promise(async (resolve) => {
    let settled = false
    const cleanup = () => {
      if (askStreamUnsub) {
        askStreamUnsub()
        askStreamUnsub = null
      }
      askStreamRequestId = ''
    }
    const finish = (payload) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(payload)
    }

    askStreamUnsub = window.desktopRag.onAskStreamEvent((evt) => {
      if (!evt || evt.requestId !== askStreamRequestId) return
      if (evt.event === 'meta') {
        askResult.value = {
          question: q,
          answer: '',
          sources: evt.data?.sources || [],
          scores: evt.data?.scores || [],
          sourceDetails: [],
          retrieval: evt.data?.retrieval || {}
        }
        return
      }
      if (evt.event === 'delta') {
        const delta = String(evt.data?.text || '')
        displayedAnswer.value += delta
        askResult.value = { ...(askResult.value || {}), answer: displayedAnswer.value }
        typingState.active = true
        typingState.progress = Math.min(99, typingState.progress + 1)
        return
      }
      if (evt.event === 'replace') {
        displayedAnswer.value = String(evt.data?.text || '')
        askResult.value = { ...(askResult.value || {}), answer: displayedAnswer.value }
        return
      }
      if (evt.event === 'done') {
        askResult.value = evt.data || askResult.value
        displayedAnswer.value = askResult.value?.answer || displayedAnswer.value
        typingState.active = false
        typingState.progress = 100
        finish({ ok: true, result: askResult.value })
        return
      }
      if (evt.event === 'exit' && evt.data && evt.data.ok === false) {
        typingState.active = false
        finish({ ok: false, error: evt.data.error || 'stream exited with error' })
        return
      }
      if (evt.event === 'exit' && evt.data && evt.data.ok === true) {
        typingState.active = false
        typingState.progress = 100
        finish({ ok: true, result: askResult.value })
      }
    })

    try {
      const started = await window.desktopRag.askStreamStart(q)
      if (!started || !started.ok || !started.requestId) {
        cleanup()
        finish({ ok: false, error: '无法启动流式提问' })
        return
      }
      askStreamRequestId = started.requestId
    } catch (err) {
      cleanup()
      finish({ ok: false, error: err.message || String(err) })
    }
  })
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarkdownSafe(md) {
  try {
    const text = String(md || '').replace(/\r\n/g, '\n')
    if (!text.trim()) return '<p>（无内容）</p>'

    const lines = text.split('\n')
    let html = ''
    let inList = false
    let listType = 'ul'
    let inCode = false
    let codeBuffer = []

    for (let raw of lines) {
      const line = raw.trim()
      if (line.startsWith('```')) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>'
          inList = false
        }
        if (!inCode) {
          inCode = true
          codeBuffer = []
        } else {
          html += `<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`
          inCode = false
          codeBuffer = []
        }
        continue
      }

      if (inCode) {
        codeBuffer.push(raw)
        continue
      }

      if (!line) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>'
          inList = false
        }
        html += '<br/>'
        continue
      }

      if (line.startsWith('### ')) {
        if (inList) { html += listType === 'ol' ? '</ol>' : '</ul>'; inList = false }
        html += `<h3>${inlineMd(escapeHtml(line.slice(4)))}</h3>`
        continue
      }
      if (line.startsWith('## ')) {
        if (inList) { html += listType === 'ol' ? '</ol>' : '</ul>'; inList = false }
        html += `<h2>${inlineMd(escapeHtml(line.slice(3)))}</h2>`
        continue
      }
      if (line.startsWith('# ')) {
        if (inList) { html += listType === 'ol' ? '</ol>' : '</ul>'; inList = false }
        html += `<h1>${inlineMd(escapeHtml(line.slice(2)))}</h1>`
        continue
      }
      if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        const nextListType = /^\d+\.\s+/.test(line) ? 'ol' : 'ul'
        if (!inList || listType !== nextListType) {
          if (inList) html += listType === 'ol' ? '</ol>' : '</ul>'
          listType = nextListType
          html += listType === 'ol' ? '<ol>' : '<ul>'
          inList = true
        }
        const body = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')
        html += `<li>${inlineMd(escapeHtml(body))}</li>`
        continue
      }
      if (line.startsWith('> ')) {
        if (inList) {
          html += listType === 'ol' ? '</ol>' : '</ul>'
          inList = false
        }
        html += `<blockquote>${inlineMd(escapeHtml(line.slice(2)))}</blockquote>`
        continue
      }

      if (inList) {
        html += listType === 'ol' ? '</ol>' : '</ul>'
        inList = false
      }
      html += `<p>${inlineMd(escapeHtml(line))}</p>`
    }

    if (inCode) html += `<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`
    if (inList) html += listType === 'ol' ? '</ol>' : '</ul>'
    return html
  } catch {
    return `<pre>${escapeHtml(md || '')}</pre>`
  }
}

function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`)
}

function renderSnippetSafe(text) {
  const src = String(text || '')
  if (!src.trim()) return '<p>（空片段）</p>'
  return renderMarkdownSafe(src)
}

function sourceFileName(fullPath) {
  const p = String(fullPath || '')
  const idx = Math.max(p.lastIndexOf('\\'), p.lastIndexOf('/'))
  return idx >= 0 ? p.slice(idx + 1) : p
}

function sourceDirName(fullPath) {
  const p = String(fullPath || '')
  const idx = Math.max(p.lastIndexOf('\\'), p.lastIndexOf('/'))
  return idx >= 0 ? p.slice(0, idx) : ''
}

function sanitizeUrl(url) {
  const val = String(url || '').trim()
  if (/^https?:\/\//i.test(val)) return escapeHtml(val)
  return '#'
}

function selectKbRow(name) {
  selectedKb.value = String(name || '')
}

function formatTs(value) {
  const v = String(value || '').trim()
  if (!v) return '-'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleString()
}

function deriveOfflineAssetRoot(scriptPath) {
  const s = String(scriptPath || '')
  if (!s) return ''
  const normalized = s.replace(/\//g, '\\')
  const marker = '\\installer\\windows\\'
  const idx = normalized.toLowerCase().indexOf(marker)
  if (idx < 0) return ''
  return `${normalized.slice(0, idx)}\\offline-assets`
}

function joinWinPath(base, leaf) {
  const b = String(base || '').replace(/[\\/]+$/, '')
  const l = String(leaf || '').replace(/^[\\/]+/, '')
  if (!b) return l
  if (!l) return b
  return `${b}\\${l}`
}
</script>
