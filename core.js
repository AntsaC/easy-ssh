import pkg from "jsonfile";
const { readFile, writeFile } = pkg;
import { Client } from "ssh2";

const filePath = "./data.json";

export function newConnection(connection) {
  readFile(filePath, (err, jsonData) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    connection.createdAt = new Date();
    // Add the new user to the users array
    jsonData.push(connection);
    console.log(`Connection ${connection.name} created`);

    // Write the updated JSON data back to the file
    writeFile(filePath, jsonData, { spaces: 2, flag: 'a+' }, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
    });
  });
}

function findServerByName(name, jsonData) {
  return jsonData.find((server) => server.name === name);
}

export function connect(name) {
  readFile(filePath, (err, jsonData) => {
    const server = findServerByName(name, jsonData);
    if (server) {
      console.log('Connecting...')
      const conn = new Client();
      conn
        .on("ready", function () {
          conn.shell(function (err, stream) {
            if (err) throw err;

            process.stdin.setRawMode(true); // Allows capturing keypress events

            stream
              .on("close", function () {
                console.log("Disconnected");
                conn.end();
                process.exit();
              })
              .on("data", function (data) {
                process.stdout.write(data.toString()); // Output received from the shell
              });

            process.stdin.on("data", function (key) {
              if (key === "\u0003") {
                // Ctrl+C to quit
                conn.end();
              } else {
                stream.write(key); // Send keypresses to the shell
              }
            });
          });
        })
        .connect(server);
    } else {
      console.error(`Server ${name} not found`);
    }
  });
}

export function findAll() {
  return new Promise((resolve, reject) => {
    readFile(filePath, (err, jsonData) => {
      if (err) {
        reject(err);
      }
      resolve(jsonData);
    });
  })
}

export async function deleteServer(name) {
  let data = await findAll();
  data = data.filter(server => server.name != name);
  writeFile(filePath, data, { spaces: 2 }, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
  });
}

export function promptBuilder(name, message) {
  return {
    type: "input",
    name,
    message,
    validate: function (value) {
      return value ? true : "Please enter " + name;
    },
  };
}
