Chokidar = require 'chokidar'
YAML     = require 'yamljs'
Extend   = require 'node.extend'
Fs       = require 'fs'

class Config
	@BUILTIN_CONFIG = "#{__dirname}/../builtin/<%= package %>.yml"
	@ETC_CONFIG = "/etc/<%= package %>.yml"
	@HOME_CONFIG = "#{process.env.HOME}/.config/<%= package %>.yml"

	contstructor: (opts)
		@chokidarOpts or= opts.chokidar
		@withDefault or= []
		@chokidarOpts or= { persistent: true }
		@reloadConfig () -> console.log "Reloaded config"
		@watch()

	onChange: (cb) ->
		@reloadConfig cb

	watch: ->
		@watcher = Chokidar.watch HOME_CONFIG, {
			persistent: true
		}
		@watcher.on 'change', @onChange

	unwatch: ->
		@watcher.unwatch HOME_CONFIG
		@watcher.close()
		@watcher = null

	reloadConfig: (cb) ->
		@config = YAML.load(BUILTIN_CONFIG)
		for path in [ETC_CONFIG, HOME_CONFIG]
			if Fs.existsSync path
				console.log "Merging config from #{path}"
				@config = Extend(true, @config, YAML.load(path))
			for withDefault @withDefault
				for k,v of @config[withDefault]
					continue if k is '_default'
					_defaultClone = Extend true, {}, @config[withDefault]._default
					@config[withDefault][k] = Extend(true, _defaultClone, v)
		cb()

module.config
