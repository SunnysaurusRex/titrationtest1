function calculateValues() {   
	var acidM = document.getElementById("acidC").value;
	acidM = parseFloat(acidM);
	var acidV = document.getElementById("acidV").value;
	acidV = parseFloat(acidV);
	var titrantM = document.getElementById("baseC").value; 
	titrantM = parseFloat(titrantM);
	var pointsPerRegion = document.getElementById("pointsPerRegion").value;
	pointsPerRegion = parseInt(pointsPerRegion);	
	var equivalenceVolume = parseFloat(acidM*acidV/titrantM);
   var endtitration = equivalenceVolume*2;
   var spacing = equivalenceVolume/pointsPerRegion;
   var form = document.getElementById("inputForm");
	var selectedAcid = form.elements["acidOptions"];
	var acidName = selectedAcid.value;
	var Ka = equilibriumConstants[acidName].ka;
	var pka = equilibriumConstants[acidName].pka;
	console.log( Ka, pka);

   removeDatalol();

	initial( Ka, acidM );
	beforeEquivalence( acidM, acidV, titrantM, equivalenceVolume, Ka, spacing, pka );
	equivalencepH( Ka, acidM, acidV, equivalenceVolume );
	afterEquivalence( acidM, acidV, titrantM, equivalenceVolume, Ka, spacing );	

   document.getElementById("image").src = "https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/35270238_1783045888426275_7040341182223745024_n.jpg?_nc_cat=108&_nc_ht=scontent-lga3-1.xx&oh=c4c6290a9b1df9ee5d0b76aec984d034&oe=5C9466DA";
}
var equilibriumConstants = {
   //monoprotic 
   acetic : {ka: 1.8e-5, pka: 4.75},
   nitrous : {ka: 5.6e-4, pka: 3.25},
   formic : {ka: 1.78e-4, pka: 3.750},
   benzoic : {ka: 6.3e-5, pka: 4.20}
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

function initial( Ka, c ) {
	var x = parseFloat( initializeQuadratic( Ka, c) );
	var pH = (Math.log(x)/Math.log(10))*-1;
	addData(titrationCurve, 0, pH );
}
function HH( ratio, Vb, pka ) {
	var pH = pka + Math.log( Number( ratio ) )/Math.log(10);
	addData( titrationCurve, Vb, pH);
	console.log("HH");
}
function beforeEquivalence( Ma, Va, Mb, eq, K, spacing, pka ) {
	var Vb = new Fraction( spacing ) ;
	var pka = new Fraction( pka );
	while( Vb < eq ) {  
		var Ma = new Fraction( Ma );
		var Va = new Fraction( Va );
		var Mb = new Fraction( Mb );
		var eq = new Fraction( eq ); 
		var Ka = new Fraction( K );
		var spacing = new Fraction( spacing );
		
		console.log(Vb.toString());
		var beta = Fraction(Mb).mul(Vb);
		var acidMoles = Fraction(Ma).mul(Va);
		acidMoles = Fraction(acidMoles).sub(beta);
		var ratio =  Fraction(beta).div(acidMoles) ;
		if( HHconditions(ratio) == 1 ) {
			HH( ratio, Vb, pka );
		} else {
			acidicQuad( Ma, Va, Mb, Vb, Ka );
		}
		Vb = Fraction(Vb).add(spacing);
	}	
}
function acidicQuad( Ma, Va, Mb, Vb, Ka ) {
	var totalV = Fraction(Va).add(Vb);
	var molesHydrox = Fraction(Mb).mul(Vb);
	var initialA = Fraction(Ma).mul(Va).sub(molesHydrox).div(totalV);
	var conjB = Fraction(molesHydrox).div(totalV);
	var b = Fraction(Ka).add(conjB);
	var c = Fraction(Ka).mul(initialA).neg();
	var x = parseFloat( Fraction( quadraticFormula( 1, b, c, initialA) ).toString() );
	//console.log(x);
	var pH = (Math.log( x )/Math.log(10))*-1;
	var addedVolume = parseFloat( Vb.toString() );
	addData( titrationCurve, addedVolume, pH );
}
function equivalencepH( K, Ma, Va, equivalenceVolume) {
	var Kw = new Fraction( 1e-14 );
	var Ka = new Fraction( K );
	var Kb = Fraction(Kw).div(Ka);
	var eq = new Fraction( equivalenceVolume );
	var Ma = new Fraction( Ma );
	var Va = new Fraction( Va );
	var totalV = Fraction(Va).add(eq);
	var molesConj = Fraction(Ma).mul(Va);
	var Mconj = Fraction(molesConj).div( totalV );
	var xOH = parseFloat( initializeQuadratic( Kb, Mconj) );
	var xOH = (Math.log(xOH)/Math.log(10))*-1;
	console.log( xOH);
	addData( titrationCurve, equivalenceVolume, 14 - xOH);
}
function afterEquivalence( Ma, Va, Mb, eq, K, spacing ) {
	var Vb = new Fraction( eq + spacing);
	var spacing =  new Fraction( spacing );
	var eq = new Fraction( eq );
	while( Vb <= eq.mul(2) ) {
		var Ma = new Fraction( Ma );
		var Va = new Fraction( Va );
		var Mb = new Fraction( Mb );
		var Kw = new Fraction( 1e-14 );
		var Ka = new Fraction( K );
		// Kb = (b+x)x / (a-x); 0 = x^2 +(b+Kb)x - (kb)a;
		var Kb = Fraction(Kw).div(Ka);
		var intialAa = Fraction(Ma).mul(Va).div( Fraction(Va).add(Vb) );
		var excessOHb = Fraction(Vb).sub(eq).mul(Mb).div( Fraction(Va).add(Vb) );
		var b = Fraction(Kb).add(excessOHb);
		var c = Fraction(Kb).mul(intialAa).neg();
		var x = quadraticFormula( 1, b, c, intialAa ) ;
		var totalHydrox = Fraction(excessOHb).add(x).toString();
		var pOH = (Math.log( parseFloat(totalHydrox) )/Math.log(10))*-1;
		addData( titrationCurve, Vb, 14-pOH);
		Vb = Vb.add(spacing);
	}	
}
function initializeQuadratic( K, c) {
	var K = new Fraction( K );
	var c = new Fraction( c );
	var power = Fraction(K).mul(K);
	var radicand = Fraction(power).add(Fraction(K).mul(c).mul(4) );
	return Fraction(K).neg().add( Fraction(radicand).pow(1/2)  ).div(2).toString() ;
}

function quadraticFormula( a, b, c, conc ) {
	//x = [-b +/- sqrt(b^2 -4ac ) ]/ 2a 
	var a = new Fraction( a );
	var b = new Fraction( b );
	var c = new Fraction( c );
	var conc = new Fraction( conc );
	var powerTerm = Fraction(b).pow(2);
	var fourAC = Fraction(a).mul(c).mul(4);
	var radicand = Fraction(powerTerm).sub(fourAC);
	var root1 = Fraction(b).neg().add( Fraction( radicand.pow(1/2) ) ).div(2) ;
	var root2 = Fraction(b).neg().sub( Fraction( radicand.pow(1/2) ) ).div(2) ;
	//console.log( parseFloat(root1.toString()) );
	//console.log( parseFloat(root2.toString()));
	var reject = rootReject( conc, root1, root2 );
	if( reject == 1 ) {
		return root1;
	} else if( reject == 2 ) {
		return root2;
	}
}
function rootReject( c, x1, x2 ) {
	if( Fraction(c).sub(x1) > 0 && Fraction(c).sub(x1) < c ) {
		return 1;
	} else if ( Fraction(c).sub(x2) > 0 && Fraction(c).sub(x2) < c ) {
		return 2;
	} else {
		return "wtf";
	}
}
function HHconditions( ratio ) {
	var log = Math.log( parseFloat( ratio.toString() ) )/Math.log(10);
	console.log("log"+log);

	if( log>-1 && log<1 ) {
		return 1;
	} else {
		return 0;
	}
}








function fivePercentRule( K, c ) {
	var roundCheck = Math.pow( K*c, 1/2) / c;
	if( roundCheck*1000 <= 50 ) {
		return 1;
	} else {
		return 0;
	}
}
function neglectX( K, c) {
	var x = Math.pow( K*c, 1/2);
	return x; 
}
function afterEquivalenceAPXcheck( K, conjugate, excess ) {
	// K = (b+c)c / (a-c) ; K = b*c / a; c = K*a/b
	if( conjugate > K*100 ) {
		var c = K*conjugate/excess;
		return 1;
	} else {
		return 0;
	}
}