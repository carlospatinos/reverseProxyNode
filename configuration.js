const fs   = require('fs');
const path = require('path');
const util = require('util');
const yaml = require('js-yaml');

class ConfigManager{
  constructor(configFile){
    this.configFile = configFile;

    try {
      // let filename = path.join(__dirname, configFile);
      let contents = fs.readFileSync(configFile, 'utf8');
      this.config  = yaml.safeLoad(contents);

    } catch (err) {
      console.log(err.stack || String(err));
    }

  }

  getConfig(){
    return this.config;
  }

  load(){
    let contents = fs.readFileSync(this.configFile, 'utf8');
    this.config  = yaml.safeLoad(contents);
  }

}

let configManager = new ConfigManager(__dirname + '/config/gw-app-config.yml');
let configuration = configManager.getConfig();
configuration.log.configFile = __dirname + "/" + configuration.log.configFile;

module.exports = configuration;

