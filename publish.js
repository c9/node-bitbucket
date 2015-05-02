
var pkg = require('./package.json');
var github = require('./github.json');
var inquirer = require('inquirer');
var semver = require('semver');
var fs = require('fs');

var Cluc = require('cluc');


var revision = pkg.version;
var releaseTypes = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];

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
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2)+'\n');


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
      this.answer(/^Username/i, github.username);
      this.answer(/^Password/i, github.password);
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
  var gitCommit = function(cmd){
    cmd = 'git -c core.excludes=.idea  commit -am "'+cmd.replace(/"/g,'\\"')+'"';
    return line.stream(cmd, function(){
      this.display();
      this.answer(/^Username/i, github.username);
      this.answer(/^Password/i, github.password);
    });
  };
  var c = fs.readFileSync('.git/info/exclude');
  if((c+'').indexOf('.idea/')==-1){
    c = c+'\n'+'.idea/\n';
    fs.writeFileSync('.git/info/exclude', c);
  }
  gitAdd('-A');
  gitCommit('Publish '+releaseType+' '+revision);
  gitPush('origin master');
  streamOrDie('mkdir -p /tmp/'+pkg.name);
  streamOrDie('cd /tmp/'+pkg.name);
  streamDisplay('git clone '+pkg.repository.url+' .');
  streamDisplay('git checkout gh-pages');
  streamDisplay('git reset --hard');
  streamDisplay('git pull origin gh-pages');
  streamOrDie('rm -fr ./*');
  streamOrDie('rm -fr ./.travis*');
  streamOrDie('rm -fr ./.giti*');
  streamOrDie('rm -fr ./.esli*');
  streamOrDie('ls -alh');
  streamDisplay('git commit -am cleanup');
  streamDisplay('git status');
  streamOrDie('cp '+__dirname+'/*md .');
  streamOrDie('jsdox --output docs/ '+__dirname+'/bitbucket/');
  streamOrDie('cd '+__dirname);
  streamDisplay('mocha --reporter markdown > /tmp/'+pkg.name+'/docs/test.md');
  streamOrDie('cd /tmp/'+pkg.name);
  streamOrDie('ls -alh');
  gitAdd('-A');
  gitCommit('generate doc');
  gitPush('git@github.com:'+github.username+'/'+pkg.name+'.git gh-pages');
  streamOrDie('cd '+__dirname);
  streamOrDie('npm publish');
  streamOrDie('rm -fr /tmp/'+pkg.name);

  transport.run(line, function(){
    console.log('All done');
  });
});


