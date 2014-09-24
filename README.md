Uptime JSON Metadata plugin
===========================

Adds a custom JSON metadata field to Uptime (https://github.com/fzaninotto/uptime) Check model.

Install the plugin via npm:

```sh
$ npm install uptime-json-meta
```
Enable it in config/[env].yaml :

```yaml
plugins:
  - uptime-json-meta
```

Customize the options in config/[env].yaml :

```yaml
jsonMetaPlugin:
  path: [customFieldName]
```
