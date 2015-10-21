'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({

  _tpl: function(from, to) {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), this.props, {
      interpolate: /<%=([\s\S]+?)%>/g
    });
  },
  _mkdirp: function(dir) {
    mkdirp.sync(this.destinationPath(dir));
  },
  _ucfirst: function(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1);
  },
  _mkprompt: function(message, name, type) {
    if (!type) type = 'string';
    return { type: type, message: message, name: name, default: this.defaults[name] };
  },

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.option('appname', {
      "type": String
    })
    this.defaults = JSON.parse(fs.readFileSync(this.templatePath('yo-rc-defaults.json')));
    this.defaults.appname = this.appname;

  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the priceless ' + chalk.red('CoffeeMake') + ' generator!'
    ));

    var prompts = [
      this._mkprompt('App Name', 'appname'),
      this._mkprompt('Description', 'description'),
      this._mkprompt('License', 'license'),
      this._mkprompt('Your real name', 'realname'),
      this._mkprompt('Your E-Mail', 'email'),
      this._mkprompt('Repository Base URL', 'repo_base'),
      this._mkprompt('Repository User', 'repo_user'),
      this._mkprompt('Prefer Global?', 'preferGlobal', 'boolean'),
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.AppName = this._ucfirst(props.appname);
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      console.log(this);
      this._mkdirp('src/lib');
      this._tpl('src/lib/_daemon.coffee', 'src/lib/'+this.props.AppName+'Daemon.coffee');
      this._mkdirp('src/man');
      this._tpl('src/man/_.1.md', 'src/man/'+this.props.appname+'.1.md');
      this._mkdirp('src/bin');
      this._tpl('src/bin/_.js', 'src/bin/'+this.props.appname+'.js');
      this._mkdirp('etc');
      this._mkdirp('builtin');
      this._tpl('builtin/_.yml', 'builtin/'+this.props.appname+'.yml');
      this._tpl('builtin/_.yml', 'etc/'+this.props.appname+'.yml');
      this._tpl('_package.json', 'package.json');
      this._tpl('Makefile', 'Makefile');
      this._tpl('LICENSE.' + this.props.license, 'LICENSE');
    },

    projectfiles: function () {
      this._tpl('editorconfig', '.editorconfig');
    }
  },

  install: function () {
    this.installDependencies();
  }
});
