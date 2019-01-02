function specificCalculate() {
var initialM = document.getElementByName("strongacidconcentration");
var initialV = document.getElementByName("strongacidvolume");
var titrant = document.getElementByName("strongbaseconcentration"); 
var addedvolume = document.getElementByName("addedtitrantvolume");

console.log('analyte concentration: '+initialM+" M");
console.log('analyte volume: '+initialV+" mL");
console.log('titrant concentration: '+titrant+" M");
console.log('volume added: '+addedvolume+" mL\n");

var Hmoles, Hconc, pH;
var equivalencevolume = parseFloat(initialM*initialV/titrant);
var endtitration = equivalencevolume*2;

console.log( 'addedvolume 		pH')
if( boundcheck(addedvolume,equivalencevolume) == 0 ) {
	acidic( initialM, initialV, titrant, equivalencevolume, addedvolume);
} else if( boundcheck(addedvolume,equivalencevolume) == 1 ) {
	eqpt( equivalencevolume );
} else if( boundcheck(addedvolume,equivalencevolume) == 2 ) {
	basic( initialV, titrant, equivalencevolume, addedvolume);
}
}
function acidic( initialM, initialV, titrant, equivalencevolume, addedvolume)
{
	var totalvolume = initialV + addedvolume;
	var Hmoles = (initialM*initialV) - titrant*addedvolume;
	var Hconc = Hmoles/totalvolume;
	pH = ( Math.log( Hconc )/Math.log(10) ) * -1;   
	console.log( precise(addedvolume) +'		'+ pH );
	return;
}
function eqpt( equivalencevolume )
{
	var Hconc = 1e-7;
	pH = ( Math.log( Hconc )/Math.log(10) ) * -1;   
	console.log( equivalencevolume +'		'+ pH );
	return;
}
function basic( initialV, titrant, equivalencevolume, addedvolume)
{
	var totalvolume = initialV + addedvolume;
	var molbase = titrant*(addedvolume-equivalencevolume)/1000;
	var baseconc = molbase/totalvolume*1000;
	pH  = 14 + ( Math.log( baseconc )/Math.log(10) );
	console.log( precise(addedvolume) +'		'+ pH );
	return;
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

function test() {
	alert("l o l");
	var initialM = document.getElementById("strongacidconcentration");
	var initialV = document.getElementById("strongacidvolume");
	var titrant = document.getElementById("strongbaseconcentration"); 
	var addedvolume = document.getElementById("addedtitrantvolume");
	alert(initialM);
}
