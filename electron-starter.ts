const { app, BrowserWindow, ipcMain } = require("electron");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const PROTO_PATH = __dirname + "/client_comunication.proto";

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.ts"),
    },
  });

  // win.setFullScreen(true);
  win.loadURL("http://localhost:3000");
};

app.whenReady().then(() => {
  ipcMain.handle("get-data", async (event, params) => {
    try {
      var package = grpc.loadPackageDefinition(packageDef).datafiles;
      var client = new package.MoneyTransaction(
        `${params.remoteHost}:50051`,
        grpc.credentials.createInsecure()
      );

      return await new Promise((resolve, reject) => {
        client.MakeTransaction(params, (err, res) => {
          if (err != null) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    } catch (error) {
      console.error(`Error during gRPC call:`, error);
      return null;
    }
  });

  createWindow();
});
