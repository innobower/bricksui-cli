/**
 * Created by dis on 2014/7/21.
 */
'use strict';

var path = require('path');
var fs = require('fs');
var walkSync = require('walk-sync');
var vendorPath='vendor/bricksui';



function EmberCLIBricksUi(project) {
  this.project = project;
  this.name = 'Ember CLI Bricks Ui';
}

/**
 * 根据文件名称判断是否是一个文件，判断依据为是含有拓展名
 * @param filename
 * @returns {boolean}
 */
function isFile(filename) {
  return path.extname(filename).length > 0;
}

/**
 * 拼接相对路径
 * @param path
 * @returns {string|*}
 */
function concatPath(filePath){
  return path.join(vendorPath,filePath);
}


function unwatchedTree(dir) {
  return {
    read: function () {
      return dir;
    },
    cleanup: function () {
    }
  };
}

/**
 * 复制assets内容
 * @param app
 * @param assets
 */
function copyAssetsRecursive(app, assets) {
  var base = path.join(__dirname, assets),
    paths = walkSync(base);

  paths.forEach(function (filePath) {
    var dirName = 'assets/'+path.dirname(filePath);

    if (!isFile(filePath)) return;
    app.import(path.join(assets, filePath), { destDir: dirName});
  });
}

EmberCLIBricksUi.prototype.treeFor = function treeFor(name) {
  var treePath = path.join('node_modules', 'bricks-ui', name);
  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIBricksUi.prototype.included = function included(app) {
  var emberCLIVersion = app.project.emberCLIVersion();
  if (emberCLIVersion < '0.0.41') {
    throw new Error('bricks-ui requires ember-cli version 0.0.41 or greater.\n');
  }

  //import css files
  app.import(concatPath('bricksui.vendor.css'));

  //import javascript files
  app.import(concatPath('bricksui.vendor.js'));
  app.import(concatPath('bricksui.js'));

  //import vendor files
  copyAssetsRecursive(app,vendorPath);
};

module.exports = EmberCLIBricksUi;
