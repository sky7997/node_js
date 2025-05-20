// the difference between these two .txt and .json structures are we use stringify,parse in .json file type 
//and in update operation in .json type we directly update remaining all same.
//root map
backend
  demo.txt
  server.js

//server.js
//for demo.txt file operations with asyc,await
const fs = require('fs').promises; // .promises for async,await operations
async function fileOperations() {
  try {
    //if u want access system file
    //const filePath = 'C:\\Users\\PC\\Desktop\\normal use\\ads.txt'; //copy address from right-click properties add file name at end, make \ to \\
    // Write file
    //await fs.writeFile(filePath, "new data"); // 
    //console.log('File Written Successfully');

    // Write file
    await fs.writeFile('./demo.txt', "new data"); // adds text "new data"
    console.log('File Written Successfully');

    // Read file
    const fileData = await fs.readFile('./demo.txt', 'utf-8');
    console.log('File Content:\n', fileData);

    // Append to file
    await fs.appendFile('./demo.txt', '\nAppended Content'); // \n to write new data on new line
    console.log('Content Appended Successfully');

    // Delete file
    await fs.unlink('./demo.txt');
    console.log('File Deleted Successfully');
    
  } catch (err) {
    console.log('Error:', err);
  }
}

fileOperations();
...............................................................................................................
// fs with json file
//we use .json instead of .js because .js has code while .json has only data
//root map
backend
  data.json //we use .json instead of .js because .js has code while .json has only data
  server.js
//data.json
{
  "name": "John",
  "age": 30,
  "email": "john@example.com",
  "location": "New York"
}
//server.js
const fs = require('fs').promises; 
async function fileOperations() {
  try {
    // Read and parse JSON data
    const fileContent = await fs.readFile('./data.json', 'utf-8');
    //When you use 'utf-8' with fs.readFile, it tells Node.js to read the file as a text string, not as raw bytes (Buffer).
    const jsonData = JSON.parse(fileContent); //converts json string into js object
    console.log('Read JSON:', jsonData);

    // Append new key-value to the object
    jsonData.location = 'New York';

    // Write updated JSON back to file
    await fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2)); // converts js object to json string
    //null: the replacer (optional). null means "don't filter anything; include all keys".
    //2: the space argument (also optional). It defines how many spaces to use for indentation in the output.
    console.log('JSON File Updated Successfully');

    // Delete the file
    await fs.unlink('./data.json');
    console.log('JSON File Deleted Successfully');

  } catch (err) {
    console.error('Error:', err);
  }
}

fileOperations();
.....................................................................................
//Q.write a function in node js to read a JSON file from the filesystem and return its contents as a javaScript object

const fs = require('fs').promises; 
async function fileOperations() {
  try {
    // Read and parse JSON data
    const fileContent = await fs.readFile('./data.json', 'utf-8');
    const jsonData = JSON.parse(fileContent);
    console.log('Read JSON:', jsonData);
   
  } catch (err) {
    console.error('Error:', err);
  }
}

fileOperations();
