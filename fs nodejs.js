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
