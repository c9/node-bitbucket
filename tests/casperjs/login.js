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

var counter = 0;

function screenshots(self,name,root)
{
	counter++;
	name = counter + '_' + name;
	if (!root) {
		root = '/vagrant/screenshots/login/'
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

casper.test.begin('login', 2, function suite(test) {
    casper.start("http://localhost/login", function() {
    	var self = this;
    	
	    casper.then(function() {
	    	casper.waitForSelector("form input[name='LoginForm[username]']", function() {
        	    screenshots(self,'login-screen-pre-fill');
	    		self.fillSelectors('form#login-form', {
        	        'input[name="LoginForm[username]"]' : 'russjohnson09@gmail.com',
        	        'input[name="LoginForm[password]"]' : 'Password!20',
        	    });
        	    screenshots(self,'login-screen-after-fill');
        		self.test.assertExists('button[name="login-button"]');
        	    self.click('button[name="login-button"]');
	    	});
	    });
	    

	    casper.then(function() {
	        casper.waitForSelector('div.site-user', function() {
		        self.test.assertExists('div.site-user');
        	    screenshots(self,'index-valid');
	    	});
		});
	    
	    casper.then(function() {
        	screenshots(self,'final');
		});
	    
    });

    casper.run(function() {
        test.done();
    });
});


casper.on('resource.error', function(resourceError) {
    console.log(resourceError);
    screenshots(self,'error');

});

casper.on('run.complete', function() {
    console.log(1);
});

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
    screenshots(self,'error');

});

casper.on("remote.message", function(msg) {
    this.echo("remote.message: " + msg, "ERROR");
});