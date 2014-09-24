/**
 * Uptime JSON Metadata plugin
 *
 * Adds a custom JSON metadata field to Uptime Check model.
 *
 * Warning: It will set the 'strict' option to false on the metadata field.
 *
 * Installation
 * ------------
 * To enable the plugin, add its entry to the `plugins` key of the configuration:
 *
 * // in config/production.yaml
 * plugins:
 *  - uptime-json-meta
 *
 * Options
 * -------
 * -path: The path to use for the custom metadata field, defaults to 'meta':
 *
 * // in config/production.yaml
 * jsonMetaPlugin:
 *  path: customFieldName
 *
 * Usage
 * -----
 * Add the custom metadata field 'Metadata' textarea displayed in the check Edit page, in valid JSON format. For instance:
 *
 * {
 *  "customString": "foo",
 *  "customArray": [1,2,3]
 * }
 *
 */
var fs = require('fs');
var ejs = require('ejs');
var express = require('express');

var template = fs.readFileSync(__dirname + '/views/_detailsEdit.ejs', 'utf8');

exports.initWebApp = function(options) {

  var config = options.config.jsonMetaPlugin || {};
  config.path = config.path || 'meta';
  config.type = options.mongoose.Schema.Types.Mixed;
  config.options = {
    strict: false
  };

  function setMetadata(target, value) {
    target.set(config.path, value, config.type, config.options);
    target.markModified(config.path);
  }

  function getMetadata(target) {
    return target.get(config.path);
  }

  var dashboard = options.dashboard;

  dashboard.on('populateFromDirtyCheck', function(checkDocument, dirtyCheck, type) {
    var metadata = dirtyCheck[config.path] || '{}';
    try {
      setMetadata(checkDocument, JSON.parse(metadata));
    } catch (e) {
      throw new Error('Malformed Metadata for field ' + config.path + '. Invalid JSON: ' + metadata);
    }
  });

  dashboard.on('checkEdit', function(type, check, partial) {
    partial.push(ejs.render(template, {
      locals: {
        formFieldName: 'check[' + config.path + ']',
        formFieldValue: JSON.stringify(getMetadata(check), null, 2) || '{}'
      }
    }));
  });

  options.app.use(express.static(__dirname + '/public'));

};
