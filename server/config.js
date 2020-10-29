const fs = require('fs');

const config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8"));


exports.getParam = (paramname) => {
    return config[paramname];
}

exports.getConfig = () => {
    return config;
}

exports.setConfig = (paramname, value, callback = undefined) => {
    this.getConfig()[paramname] = value;
    console.log(this.getConfig());
    fs.writeFile(__dirname + "/config.json", JSON.stringify(this.getConfig()), callback == undefined ? () => {} : callback);
}