const { contextBridge, ipcRenderer } = require("electron");
const Connection = require("./Connection");

const connection = new Connection();

contextBridge.exposeInMainWorld("myAPI", {
  getACCData: (params) => ipcRenderer.invoke("get-data", params),
  connectService: () => connection.startScan(),
});
