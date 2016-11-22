<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \frontend\models\ResetPasswordForm */

$this->title = 'Example Sleep Report';
$this->params['breadcrumbs'][] = $this->title;

?>

<script src="/js/plotly.min.js"></script>



<script>
function loadSleepJson(sleepJson) {

	var sleep = sleepJson.sleep;


	var x = [];
	var y = [];
	var y2 = [];
	sleep.forEach(function(val,key) {
	    x.push(val.dateOfSleep);
	    var hoursAsleep = val.minutesAsleep/60;
	    var hoursInBed = val.timeInBed/60;
	    y.push(hoursAsleep);
	    y2.push(hoursInBed);
	});

	var trace = {
	        x: x,
	        y: y, 
	        name: 'Time asleep',
	        type: 'scatter'
	      };

	var trace2 = {
	        x: x,
	        y: y2, 
	        name: 'Time in bed',
	        type: 'scatter'
	      };

	console.log(trace);

	var layout = {
	        title: 'Montly Sleep Report', 
	        yaxis: {
	          title: 'Time (Hours)',
	        }, 
	        xaxis: {
		        title: "Date"
	        },
	        showlegend: true
	      };
	      
	Plotly.newPlot('test-plot', [trace,trace2], layout);
	
}
</script>


<script>
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
		var sleepJson = JSON.parse(this.responseText);
		console.log(sleepJson);
		loadSleepJson(sleepJson);
        
      }
    };
    xhttp.open("GET", "/examples/fitbit/users/me/sleep/2016-09-01/2016-09-30", true);
    xhttp.send();
  </script>


<div class="graphs">

<div id="test-plot"></div>

<div id="test-plot2"></div>

</div>




<script>

</script>