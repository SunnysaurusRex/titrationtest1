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
   beforeEquivalence( acidM, acidV, titrantM, Ka, pka, spacing, equivalenceVolume);
   equivalencept( Ka, acidM, acidV, equivalenceVolume);
   afterEq( acidM, acidV, titrantM, equivalenceVolume, Ka, spacing);

   document.getElementById("image").src = "libraries/image.jpg";
   document.getElementById("badnews").className = "visible";
}

function initial( Ka, c ) {
	var x = parseFloat( initializeQuadratic( Ka, c) );
	var pH = (Math.log(x)/Math.log(10))*-1;
	addData(titrationCurve, 0, pH );
}
function HH( Ma, Va, Mb, Vb, pka ) {
	var Ma = new Fraction( Ma );
	var Va = new Fraction( Va );
	var Mb = new Fraction( Mb );
	var Vb = new Fraction( Vb );
	var beta = Fraction(Mb).mul(Vb);
	var acidMoles = Fraction(Ma).mul(Va);
	acidMoles = Fraction(acidMoles).sub(beta);
	var ratio =  Fraction(beta).div(acidMoles) ;
	var pH = pka + Math.log( Number( ratio ) )/Math.log(10);
   addData( titrationCurve, Vb, pH);
}
function beforeEquivalence( Ma, Va, Mb, K, pka, spacing, eq) {
   var addedVolume = new Fraction(spacing);
   var spacing = new Fraction(spacing);
   var Ma = new Fraction(Ma);
   var Va = new Fraction(Va);
   var Mb = new Fraction(Mb);
   var Ka = new Fraction(K);
   var apxBegin = HHconditional( Ma, Va, Mb );
   while( addedVolume <= apxBegin ) {
      acidicQuad( Ma, Va, Mb, addedVolume, Ka );
      addedVolume = addedVolume.add(spacing);
   }
   while( addedVolume < eq && addedVolume>apxBegin) {
      HH( Ma, Va, Mb, addedVolume, pka);
      addedVolume = addedVolume.add(spacing);
   }  
}
function equivalencept( K, analyteC, analyteV, equivalenceVolume) {
	var Kb = 1e-14/K;
	var conjC = analyteC*analyteV/(analyteV+equivalenceVolume);
	if( fivePercentRule( Kb, conjC) == 0 ) {
		var pOH = initalizeQuadratic( Kb, conjC);
	} else if ( fivePercentRule( Kb, conjC) == 1 ) {
		var pOH = ( Math.log( neglectX(Kb,conjC) )/Math.log(10) )*-1;
	}
	addData( titrationCurve, equivalenceVolume, 14-pOH);
}
function afterEq( Ma, Va, Mb, eq, K, spacing) {
   // kb = ('b'+x)x / ('a'-x); where a = conc of conj base, and b = excess hydroxide ions;
   var Vb = eq + spacing;
   while( Vb < 2*eq ) {
      var Kb = 1e-14/K;
      var a = (Ma*Va)/(Va+Vb);
      var b = Mb*(Vb-eq)/(Va+Vb);
      if( afterEquivalenceAPXcheck( Kb, a, b) == 0 ) {
         var n1 = algebra.parse( b+"x");
         var nume = n1.multiply("x");
         var constant = algebra.parse( Kb+"");
         var denom  = algebra.parse( a+"-x");
         var side = constant.multiply(denom);
         var quad = new Equation( nume, side);
         var roots = quad.solveFor( "x" );
         if( a - parseFloat(roots[0]) > 0 && a - parseFloat(roots[0]) < a ) {
            var change = parseFloat(roots[0]);  
         } else if( a - parseFloat(roots[1]) > 0 && a - parseFloat(roots[1]) < a ) {
            var change = parseFloat(roots[1]);
         }
         var OHconc = b + change;
         var pOH = (Math.log(OHconc)/Math.log(10))*-1;
      } else {
         var pOH = (Math.log(b)/Math.log(10))*-1;
      }
      addData(titrationCurve, Vb, 14 - pOH);
      Vb = Vb + spacing;
   }
}

function initializeQuadratic( K, c) {
	var K = new Fraction( K );
	var c = new Fraction( c );
	var power = Fraction(K).mul(K);
	var radicand = Fraction(power).add(Fraction(K).mul(c).mul(4) );
	return Fraction(K).neg().add( Fraction(radicand).pow(1/2)  ).div(2).toString() ;
}
function HHconditional( Ma, Va, Mb, ) {
   //log(ratio)> -1; Mb*Vb / Ma*Va = .1 ; 
   var boundary = Ma.mul(Va).div(Mb).div(10);
   return boundary;
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
var equilibriumConstants = {
   //monoprotic 
   acetic : {ka: 1.8e-5, pka: 4.75},
   nitrous : {ka: 5.6e-4, pka: 3.25},
   formic : {ka: 1.78e-4, pka: 3.750},
   benzoic : {ka: 6.3e-5, pka: 4.20},
   hydrofluoric : {ka: 6.8e-4, pka: 3.19}
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