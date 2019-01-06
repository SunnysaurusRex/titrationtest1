function specific() {
	var initialM = document.getElementById("strongacidconcentration").value;
	initialM = parseFloat(initialM);
	var initialV = document.getElementById("strongacidvolume").value;
	initialV = parseFloat(initialV);
	var titrant = document.getElementById("strongbaseconcentration").value; 
	titrant = parseFloat(titrant);
	var addedvolume = document.getElementById("addedtitrantvolume").value;
	addedvolume = parseFloat(addedvolume);	
	//alert("calculating . . .  l o l");
	var Hmoles, Hconc, pH;
	var equivalencevolume = parseFloat(initialM*initialV/titrant);
	var endtitration = equivalencevolume*2;

	if( boundcheck(addedvolume,equivalencevolume) == 0 ) {
		var pH = acidic( initialM, initialV, titrant, equivalencevolume, addedvolume);
		pageOutput(pH);
	} else if( boundcheck(addedvolume,equivalencevolume) == 1 ) {
		var pH = eqpt();
		pageOutput(pH);	
	} else if( boundcheck(addedvolume,equivalencevolume) == 2 ) {
		var pH = basic( initialV, titrant, equivalencevolume, addedvolume);
		pageOutput(pH);
	}

	function acidic( initialM, initialV, titrant, equivalencevolume, addedvolume) {
		var totalvolume = initialV + addedvolume;
		var Hmoles = (initialM*initialV) - titrant*addedvolume;
		var Hconc = Hmoles/totalvolume;
		pH = ( Math.log( Hconc )/Math.log(10) ) * -1;   
		return pH;
	}
	function eqpt() {
		var Hconc = 1e-7;
		pH = ( Math.log( Hconc )/Math.log(10) ) * -1;   
		return pH;
	}
	function basic( initialV, titrant, equivalencevolume, addedvolume) {
		var totalvolume = initialV + addedvolume;
		var molbase = titrant*(addedvolume-equivalencevolume)/1000;
		var baseconc = molbase/totalvolume*1000;
		pH  = 14 + ( Math.log( baseconc )/Math.log(10) );
		return pH;
	}
	function precise(x) { //javascript can't store floats properly
  		return Number.parseFloat(x).toPrecision(3);
	}
	function boundcheck( addedvolume, equivalencevolume )  {
		while ( 0<addedvolume && addedvolume<equivalencevolume ) {
			return 0;
		}
		while( addedvolume == equivalencevolume ) {
			return 1;
		}
		while( equivalencevolume<addedvolume && addedvolume<=2*equivalencevolume ) {
			return 2;
		}
	}
	function printResult(pH) {
		document.write( 'pH =	'+pH );
	}
	function pageOutput(pH) {
		document.getElementById("pHoutput").innerHTML = pH;
		window.alert(pH);
		document.getElementById("image").src = "https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/35270238_1783045888426275_7040341182223745024_n.jpg?_nc_cat=108&_nc_ht=scontent-lga3-1.xx&oh=c4c6290a9b1df9ee5d0b76aec984d034&oe=5C9466DA"; 
		document.getElementById("mus").src = "music2.mp3";
	}
}

function test()  {
	alert("l o l");
	var initialM = document.getElementById("strongacidconcentration").value ;
	document.write("l o l"+"	"+initialM);
}

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
   type: 'line',
   data: {
         labels: [ "volume added (mL)"],
         xAxisID: "volume",
         yAxisID: "pH",
         datasets: [
			{
            label: 'pH',
				fill: false,
				lineTension: .01,
            backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
               'rgba(255,99,132,1)',
              	'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
              	'rgba(75, 192, 192, 1)',
              	'rgba(153, 102, 255, 1)',
              	'rgba(255, 159, 64, 1)'
				],
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
            borderWidth: 1,
            pointBorderColor:"",
            pointBackgroundColor: "",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "",
            pointHoverBorderColor: "",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            //pointStyle: ,
            //pointRotation: ,
            showLine: true,
				data: [ ],
			}
         ]
   },
   options: {
      showLines: true,
      scales: {
         yAxes: [{
            ticks: {
               beginAtZero:true
            }
         }],
         xAxes: [{
            ticks: {
               beginAtZero:true
            }
         }]
      }
   }
});

