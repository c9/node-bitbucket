
var pkg = require('./package.json');
var github = require('./github.json');
var inquirer = require('inquirer');
var semver = require('semver');
var fs = require('fs');

var Cluc = require('cluc');

var cleanUpFiles = [
  './.vagra*',
  './.travis*',
  './.giti*',
  './.esli*'
];
var jsdox = {
  'bitbucket/':'docs/'
};
var releaseTypes = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var revision = pkg.version;

releaseTypes.forEach(function(t, i){
  var r = semver.inc(revision, t);
  releaseTypes[i] = ("_         " + t).slice(t.length)+' => '+r;
});

inquirer.prompt([{
  type: 'list',
  name: 'release',
  message: 'Select a revision type?',
  choices: releaseTypes
}], function( answers ) {
  var releaseType = answers.release.match(/^\s*([a-z]+)\s*=>\s*(.+)$/i)[1];
  var revision = answers.release.match(/^\s*([a-z]+)\s*=>\s*(.+)$/i)[2];
  pkg.version = revision;
  //fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2)+'\n');


  var transport = new (Cluc.transports.process)();
  var line = (new Cluc(transport));

  var streamDisplay = function(cmd){
    return line.stream(cmd, function(){
      this.display();
    });
  };
  var streamOrDie = function(cmd){
    return line.stream(cmd, function(){
      this.display();
      this.dieOnError();
    });
  };
  var gitPush = function(cmd){
    cmd = 'git -c core.askpass=true push '+cmd+'';
    return line.stream(cmd, function(){
      this.display();
      this.warn(/fatal:/);
      this.answer(/^Username/i, github.username);
      this.answer(/^Password/i, github.password);
    });
  };
  var gitPull = function(cmd){
    cmd = 'git pull '+cmd+'';
    return line.stream(cmd, function(){
      this.display();
    });
  };
  var gitReset = function(cmd){
    cmd = 'git reset '+cmd+'';
    return line.stream(cmd, function(){
      this.display();
    });
  };
  var gitAdd = function(cmd){
    cmd = 'git -c core.excludes=.idea  add '+cmd+'';
    return line.stream(cmd, function(){
      this.display();
      this.answer(/^Username/i, github.username);
      this.answer(/^Password/i, github.password);
    });
  };
  var gitClone = function(cmd){
    cmd = 'git clone '+cmd+'';
    return line.stream(cmd, function(){
      this.display();
    });
  };
  var gitCheckout = function(cmd){
    cmd = 'git checkout '+cmd+'';
    return line.stream(cmd, function(){
      this.display();
    });
  };
  var gitStatus = function(){
    var cmd = 'git status';
    return line.stream(cmd, function(){
      this.display();
    });
  };
  var gitCommit = function(cmd){
    cmd = 'git -c core.excludes=.idea  commit -am "'+cmd.replace(/"/g,'\\"')+'"';
    return line.stream(cmd, function(){
      this.display();
      this.success(/\[([a-z0-9]+)\s+([a-z0-9]+)]/i,
      'branch: %s revision: %s');
      this.success(/([0-9]+)\s+file[^0-9]+([0-9]+)[^0-9]+([0-9]+)/i,
      'changed: %s new: %s deleted: %s');
      this.answer(/^Username/i, github.username);
      this.answer(/^Password/i, github.password);
    });
  };
  var jsDox = function(from, to){
    streamOrDie('jsdox --output '+to+' '+from);
  };
  var mocha = function(reporter, to){
    streamDisplay('mocha --reporter '+reporter+' > '+to, function(){
      this.spinUntil(null);
    });

  };
  var ensureFileContain = function(file, data){
    var c = fs.readFileSync(file);
    if((c+'').indexOf(data)==-1){
      c = c+''+data;
      fs.writeFileSync(file, c);
    }
  };
  if(!pkg.name){
    throw 'pkg.name is missing';
  }
  if(!pkg.repository){
    throw 'pkg.repository is missing';
  }
  ensureFileContain('.git/info/exclude', '\n.idea/\n');
  ensureFileContain('.git/info/exclude', '\ngithub.json/\n');
  gitAdd('-A');
  gitCommit('Publish '+releaseType+' '+revision);
  gitPush('git@github.com:'+github.username+'/'+pkg.name+'.git master');
  streamOrDie('mkdir -p /tmp/'+pkg.name);
  streamOrDie('cd /tmp/'+pkg.name);
  gitClone(pkg.repository.url+' .');
  gitCheckout('-b gh-pages');
  gitReset('--hard');
  gitPull('origin gh-pages');
  streamOrDie('rm -fr ./*');
  cleanUpFiles.forEach(function(projectPath){
    streamOrDie('rm -fr '+projectPath);
  });
  streamOrDie('ls -alh');
  gitCommit('cleanup');
  gitStatus();
  streamOrDie('cp '+__dirname+'/*md .');
  Object.keys(jsdox).forEach(function(projectPath){
    jsDox(__dirname+'/'+projectPath, jsdox[projectPath]);
  });
  streamOrDie('cd '+__dirname);
  mocha('markdown', '/tmp/'+pkg.name+'/docs/test.md');
  streamOrDie('cd /tmp/'+pkg.name);
  streamOrDie('ls -alh');
  gitAdd('-A');
  gitCommit('generate doc');
  gitPush('git@github.com:'+github.username+'/'+pkg.name+'.git gh-pages');
  streamOrDie('cd '+__dirname);
  //streamOrDie('npm publish');
  streamOrDie('rm -fr /tmp/'+pkg.name);

  transport.run(line, function(){
    console.log('All done');
  });
});


