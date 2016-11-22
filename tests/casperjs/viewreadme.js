
var viewports = {
		iphone_five: { 
			width: 320,
			height: 568,
			flips: true,
			include_tall: true
		},
		main: {
			width: 1920,
			height: 1080
		}
}

var defaultroot = '/vagrant/screenshots/readme/';

var counter = 0;

function screenshots(self,name,root)
{
	counter++;
	name = counter + '_' + name;
	if (!root) {
		root = defaultroot;
	}
	var tall = 1000;
	for (var key in viewports) {
		self.viewport(viewports[key].width,viewports[key].height);
		self.capture(root+key+'/'+name+'.png',{
        	top: 0,
        	left: 0,
        	width: viewports[key].width,
        	height: viewports[key].height
        });
        if (viewports[key].include_tall) {
        	self.capture(root+key+'/'+name+'2.png',{
            	top: 0,
            	left: 0,
            	width: viewports[key].width,
            	height: tall
            });
        }
        
        if (viewports[key].flips) {
        	self.viewport(viewports[key].height,viewports[key].width);
        	self.capture(root+key+'/'+name+'_horizontal.png',{
            	top: 0,
            	left: 0,
            	width: viewports[key].height,
            	height: viewports[key].width
            });
        }
        if (viewports[key].include_tall) {
        	self.capture(root+key+'/'+name+'_horizontal2.png',{
            	top: 0,
            	left: 0,
            	width: viewports[key].height,
            	height: tall
            });
        }
	}	
}

casper.test.begin('login',4, function suite(test) {
    casper.start("http://localhost/docs/README.md", function(response) {
    	var self = this;
        self.test.assertUrlMatches("http://localhost/docs/README.md","Readme");
        self.test.assertEquals(response.status,200);
    	
	    casper.then(function() {
		    screenshots(self,'readme');
	    });
        
	    casper.thenOpen('http://localhost/docs/changelog.md',function() {
	        self.test.assertUrlMatches("http://localhost/docs/changelog.md","Readme");
	        self.test.assertEquals(response.status,200)
	    });
	    
	    casper.then(function() {
		    screenshots(self,'changelog');
	    });
    });
  
    
    casper.run(function() {
        test.done();
    });
});