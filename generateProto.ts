const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

fs.readFile("client_comunication_pb.js", (err, data) => {
  if (err == null) {
    console.log("The proto file has already been generated");
  } else if (err.code === "ENOENT") {
    // Path to file .proto
    const protoFilePath = path.join(__dirname, "client_comunication.proto");
    const plugin =
      "--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`";

    // Execute protoc command to generate the gRPC client
    exec(
      `protoc --proto_path=${__dirname} --js_out=import_style=commonjs,binary:${__dirname} --grpc_out=${__dirname} ${plugin} ${protoFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error during proto file generation: ${error}`);
          return;
        }
        console.log("Successfully generated:", stdout);
      }
    );
  }
});
