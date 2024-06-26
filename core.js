import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

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
    writeFile(filePath, jsonData, { spaces: 2 }, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
    });
  });
}

export function promptBuilder(name, message) {
  return {
    type: "input",
    name,
    message,
    validate: function (value) {
      return value ? true : "Please enter "+name;
    },
  };
}

