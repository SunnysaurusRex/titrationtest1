function calculateValues() {   
	var initialM = document.getElementById("strongacidconcentration").value;
	initialM = parseFloat(initialM);
	var initialV = document.getElementById("strongacidvolume").value;
	initialV = parseFloat(initialV);
	var titrant = document.getElementById("strongbaseconcentration").value; 
	titrant = parseFloat(titrant);
	var pointsPerRegion = document.getElementById("pointsPerRegion").value;
	pointsPerRegion = parseInt(pointsPerRegion);	
	var equivalencevolume = parseFloat(initialM*initialV/titrant);
   var endtitration = equivalencevolume*2;
   var spacing = equivalencevolume/pointsPerRegion;

   removeDatalol();

   beforeEq( initialM, initialV, titrant, equivalencevolume, spacing);
   eqpt(equivalencevolume);
   afterEq( initialV, titrant, equivalencevolume, spacing, endtitration );
   document.getElementById("image").src = "https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/35270238_1783045888426275_7040341182223745024_n.jpg?_nc_cat=108&_nc_ht=scontent-lga3-1.xx&oh=c4c6290a9b1df9ee5d0b76aec984d034&oe=5C9466DA";
}

function beforeEq( initialM, initialV, titrant, equivalencevolume, spacing) {
   var addedvolume = 0, i;
   while( addedvolume < equivalencevolume ) {
      var pH = acidic( initialM, initialV, titrant, addedvolume);
      addData( titrationCurve, addedvolume, pH);
      addedvolume = addedvolume+spacing;
   }   
}
function eqpt(equivalencevolume) {
   var Hconc = 1e-7;
   var pH = ( Math.log( Hconc )/Math.log(10) ) * -1;   
   addData( titrationCurve, equivalencevolume, pH);
}
function afterEq( initialV, titrant, equivalencevolume, spacing, endtitration) {
   var addedvolume = equivalencevolume + spacing;
   while ( addedvolume <= endtitration ) {
      var pH = basic( initialV, titrant, equivalencevolume, addedvolume);
      addData( titrationCurve, addedvolume, pH);
      addedvolume = addedvolume+spacing;
   }
}
function addData( chart, label, dataArray ) {
   chart.data.datasets.forEach((dataset) => {
      chart.data.labels.push(label);
      dataset.data.push( dataArray);
      chart.update();
   })
}
function removeData(chart) {
   chart.data.labels.pop();
   chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
   });
   chart.update();
}
function removeDatalo(chart) {
   while(chart.data.labels.length != 0) {
      removeData(chart);
   }
}
function removeDatalol() {
   removeDatalo(titrationCurve);
}
function acidic( initialM, initialV, titrant, addedvolume) {
   var totalvolume = initialV + addedvolume;
   var Hmoles = (initialM*initialV) - titrant*addedvolume;
   var Hconc = Hmoles/totalvolume;
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