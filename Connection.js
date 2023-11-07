const net = require("net");
const os = require("os");

class Connection {
  netPrefix = null;
  ifaces = os.networkInterfaces();

  constructor() {
    this.netPrefix = this.getNetPrefix();
  }

  getNetPrefix() {
    const localIp = this.getLocalIpAddress();

    if (localIp) {
      const ipExploded = localIp.split(".");
      const prefix = ipExploded
        .filter(
          (netLevelId) =>
            ipExploded.indexOf(netLevelId) !== ipExploded.length - 1
        )
        .join(".");

      return prefix;
    }

    return null;
  }

  scanPort(ip, port, callback) {
    const socket = new net.Socket();
    socket.setTimeout(1000); // Connection Timeout

    socket.on("connect", () => {
      callback(ip);
      socket.destroy();
    });

    socket.on("timeout", () => {
      socket.destroy();
    });

    socket.on("error", (error) => {
      socket.destroy(error);
    });

    socket.connect(port, ip);
  }

  // Get the ip Address of the local machine to obtain the local network prefix
  getLocalIpAddress() {
    for (const iface in this.ifaces) {
      for (const ifaceInfo of this.ifaces[iface]) {
        if (ifaceInfo.family === "IPv4" && !ifaceInfo.internal) {
          return ifaceInfo.address;
        }
      }
    }
    return null;
  }

  startScan() {
    return new Promise((resolve, reject) => {
      for (let i = 1; i <= 255; i++) {
        try {
          const ipAddress = `${this.netPrefix}.${i}`;
          this.scanPort(ipAddress, 50051, resolve);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
    });
  }
}

module.exports = Connection;
