const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktopRag', {
  getConfig: () => ipcRenderer.invoke('app:getConfig'),
  saveConfig: (config) => ipcRenderer.invoke('app:saveConfig', config),
  openManual: () => ipcRenderer.invoke('app:openManual'),
  getRuntimeStatus: () => ipcRenderer.invoke('env:getRuntimeStatus'),
  setupRuntime: (options) => ipcRenderer.invoke('env:setupRuntime', options),
  addSource: (path) => ipcRenderer.invoke('data:addSource', path),
  removeSource: (path) => ipcRenderer.invoke('data:removeSource', path),
  pickSourceDirectory: () => ipcRenderer.invoke('data:pickSourceDirectory'),
  pickMarkdownFiles: () => ipcRenderer.invoke('data:pickMarkdownFiles'),
  importMarkdownFiles: (files) => ipcRenderer.invoke('data:importMarkdownFiles', files),
  listKnowledgeBases: () => ipcRenderer.invoke('data:listKnowledgeBases'),
  pickWorkspaceRoot: () => ipcRenderer.invoke('data:pickWorkspaceRoot'),
  createKnowledgeBase: (name) => ipcRenderer.invoke('data:createKnowledgeBase', name),
  selectKnowledgeBase: (name) => ipcRenderer.invoke('data:selectKnowledgeBase', name),
  renameKnowledgeBase: (currentName, newName) => ipcRenderer.invoke('data:renameKnowledgeBase', currentName, newName),
  unloadKnowledgeBase: () => ipcRenderer.invoke('data:unloadKnowledgeBase'),
  deleteKnowledgeBase: (name) => ipcRenderer.invoke('data:deleteKnowledgeBase', name),
  pickMarkdownDirectory: () => ipcRenderer.invoke('data:pickMarkdownDirectory'),
  importMarkdownFilesToKnowledgeBase: (name, files) => ipcRenderer.invoke('data:importMarkdownFilesToKnowledgeBase', name, files),
  importMarkdownDirectoryToKnowledgeBase: (name, sourceDir) => ipcRenderer.invoke('data:importMarkdownDirectoryToKnowledgeBase', name, sourceDir),
  doctor: () => ipcRenderer.invoke('rag:doctor'),
  index: () => ipcRenderer.invoke('rag:index'),
  ask: (question) => ipcRenderer.invoke('rag:ask', question),
  askStreamStart: (question) => ipcRenderer.invoke('rag:askStreamStart', question),
  askStreamCancel: (requestId) => ipcRenderer.invoke('rag:askStreamCancel', requestId),
  onAskStreamEvent: (cb) => {
    const handler = (_event, payload) => cb(payload)
    ipcRenderer.on('rag:ask-stream', handler)
    return () => ipcRenderer.removeListener('rag:ask-stream', handler)
  }
})
