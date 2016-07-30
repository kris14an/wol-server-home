var grunt = require('grunt');
var appInfo = require('./package.json');

require('load-grunt-tasks')(grunt);

grunt.initConfig({
	shell: {
	    options: {
	        stderr: false
	    },
	    target: {
	        command: 'bower install'
	    }
	},
	copy: {
		'bower-soruces': {
			files: [
				{
					expand: true, 
					cwd: 'bower_components/bootstrap-material-design/dist/',
					src: '**', 
					dest: 'static/css/bmd'
				},
				{
					expand: true, 
					cwd: 'bower_components/angular/',
					src: 'angular.min.js', 
					dest: 'static/js/angular'
				},
				{
					expand: true, 
					cwd: 'bower_components/bootstrap/dist/',
					src: '**', 
					dest: 'static/css/boo'
				},
				{
					expand: true, 
					cwd: 'bower_components/jquery/dist/',
					src: '**', 
					dest: 'static/js/jq'
				}
			]
		},
		'dist-sources': {
			files: [
				{
					expand: true, 
					cwd: 'install/',
					src: ['wol-server-service', 'install.sh'], 
					dest: 'dist/'
				}
			]
		}
	},
	clean: {
		bowerComponents: ['bower_components/', 'static/css/bmd', 'static/js/angular', 'static/css/boo', 'static/js/jq'],
		dist: ['dist/']
	},
	compress: {
		'build-package': {
			options: {
				archive: 'dist/wol-server-' + appInfo.version + '.zip'
			},
			files: [
			  	{
			  		src: ['src/**/*', 
						  	'node_modules/**/*', 
						  	'static/**/*', 
						  	'server.js', 
						  	'package.json']
			  	}
			]
		}
	}
});

grunt.registerTask('default', ['shell', 'copy:bower-soruces']);

grunt.registerTask('production', ['default', 
									'copy:dist-sources', 
									'compress:build-package']);
