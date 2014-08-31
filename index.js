/**
 * Created by dis on 2014/7/21.
 */
'use strict';

var path = require('path');
var fs = require('fs');
var vendorPath='vendor/bricksui';
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');


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

EmberCLIBricksUi.prototype.treeFor = function treeFor(name) {
  var treePath = path.join('node_modules', 'bricks-ui', name);
  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

/**
 * Ember Cli Hook For Vendor
 * @param type
 * @param workingTree
 */
EmberCLIBricksUi.prototype.postprocessTree = function postprocessTree(type, workingTree) {
  var assetsPath = path.join(__dirname, 'vendor', 'bricksui', 'assets');
  //hard code to destDir to assets/assets.
  return mergeTrees([
      workingTree,
      pickFiles(assetsPath, {
        srcDir: '/',
        files: ['**/*.*'],
        destDir: '/assets/assets'
      })
    ]
  );
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
};

module.exports = EmberCLIBricksUi;
