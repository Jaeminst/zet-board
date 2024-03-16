const fs = require('fs');
const path = require('path');

const appNodeModulesPath = path.join(__dirname, '../dist/node_modules');
const srcNodeModulesPath = path.join(__dirname, '../../node_modules');

if (!fs.existsSync(srcNodeModulesPath) && fs.existsSync(appNodeModulesPath)) {
  fs.symlinkSync(appNodeModulesPath, srcNodeModulesPath, 'junction');
}
