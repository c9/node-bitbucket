// googletesting.js

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

function screenshots(self,name)
{
	var tall = 1000;
	for (var key in viewports) {
		self.viewport(viewports[key].width,viewports[key].height);
		self.capture('/vagrant/screenshots/'+key+'/'+name+'.png',{
        	top: 0,
        	left: 0,
        	width: viewports[key].width,
        	height: viewports[key].height
        });
        if (viewports[key].include_tall) {
        	self.capture('/vagrant/screenshots/'+key+'/'+name+'2.png',{
            	top: 0,
            	left: 0,
            	width: viewports[key].width,
            	height: tall
            });
        }
        
        if (viewports[key].flips) {
        	self.viewport(viewports[key].height,viewports[key].width);
        	self.capture('/vagrant/screenshots/'+key+'/'+name+'_horizontal.png',{
            	top: 0,
            	left: 0,
            	width: viewports[key].height,
            	height: viewports[key].width
            });
        }
        if (viewports[key].include_tall) {
        	self.capture('/vagrant/screenshots/'+key+'/'+name+'_horizontal2.png',{
            	top: 0,
            	left: 0,
            	width: viewports[key].height,
            	height: tall
            });
        }
	}	
}

casper.test.begin('sow form displays errors', 5, function suite(test) {
    casper.start("http://localhost", function() {
    	var self = this;
    	
	    casper.then(function() {
	    	casper.waitForSelector("form input[name='SOW[title]']", function() {
        		self.fillSelectors('form#sow-form', {
        	        'input[name="SOW[title]"]' : 'title',
        	        'input[name="SOW[email]"]' : 'invalid',
        	    });
        		self.test.assertExists('button[name="sow-submit"]');
        	    self.click('button[name="sow-submit"]');
	    	});
	    });
	    
	    casper.then(function() {
	    	self.test.assertTextExists('blank');
    	    screenshots(self,'index');

	    });
	    
	    casper.then(function() {
	    	self.test.assertTextExists('blank');
    	    screenshots(self,'index');
    	    self.fillSelectors('form#sow-form', {
    	        'textarea[name="SOW[description]"]' : 'description',
    	    }, true);
	    });
	    
	    casper.then(function() {
	        self.test.assertTextExists('blank');
    	    screenshots(self,'index-invalidemail');
	    });
	    
	    casper.then(function() {
    		self.fillSelectors('form#sow-form', {
    	        'input[name="SOW[title]"]' : 'title',
    	        'input[name="SOW[email]"]' : 'email@test.com',
    	    });
    	    self.click('textarea[name="SOW[description]"]');

    	    screenshots(self,'index-valid-presubmit');

    	    self.click('button[name="sow-submit"]');
	    });

	    casper.then(function() {
	        casper.waitForSelector('.alert-success.alert.fade.in', function() {
		        self.test.assertExists('.alert-success.alert.fade.in');
        	    screenshots(self,'index-valid');
	    	});
		});
	    
    });

    casper.run(function() {
        test.done();
    });
});


casper.on('resource.error', function(resourceError) {
    console.log(resourceError);
});

casper.on('run.complete', function() {
    console.log(1);
});

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});

casper.on("remote.message", function(msg) {
    this.echo("remote.message: " + msg, "ERROR");
});