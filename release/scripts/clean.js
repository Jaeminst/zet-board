const path = require('path');
const { rimrafSync } = require('rimraf');
const fs = require('fs');

const distPath = path.join(__dirname, '../dist');
const buildPath = path.join(__dirname, '../build');

const foldersToRemove = [
  distPath,
  buildPath,
];

foldersToRemove.forEach((folder) => {
  if (fs.existsSync(folder)) rimrafSync(folder);
});
