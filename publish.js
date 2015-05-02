
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
  streamDisplay('git-c core.excludes=.idea  add -A');
  streamDisplay('git-c core.excludes=.idea  commit -am "Publish '+releaseType+' '+revision+'"');
  streamDisplay('git push origin master');
  streamOrDie('mkdir -p /tmp/node-okbitbucket');
  streamOrDie('cd /tmp/node-okbitbucket');
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
  //streamDisplay('mocha --reporter markdown > /tmp/node-okbitbucket/docs/test.md');
  streamOrDie('cd /tmp/node-okbitbucket/');
  streamOrDie('ls -alh');
  streamOrDie('git add -A');
  streamOrDie('git commit -am "generate doc"');
  line.stream('git -c core.askpass=true push git@github.com:maboiteaspam/node-okbitbucket.git push gh-pages', function(){
    this.display();
    this.answer(/^Username/i, github.username);
    this.answer(/^Password/i, github.password);
  });
  streamOrDie('cd '+__dirname);
  streamOrDie('npm publish');

  transport.run(line, function(){
    console.log('All done');
  });
});


