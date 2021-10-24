/* cpm array used for calculations, source: https://www.reddit.com/r/TheSilphRoad/comments/jwjbw4/level_4550_expected_cpms_based/ */
var cpm = [0.0939999967813492,0.135137432089339,0.166397869586945,0.192650913155325,0.215732470154762,0.236572651424822,0.255720049142838,0.273530372106572,0.290249884128571,0.306057381389863,0.321087598800659,0.335445031996451,0.349212676286697,0.362457736609939,0.375235587358475,0.387592407713878,0.399567276239395,0.4111935532161,0.422500014305115,0.432926420512509,0.443107545375824,0.453059948165049,0.46279838681221,0.472336085311278,0.481684952974319,0.490855807179549,0.499858438968658,0.5087017489616,0.517393946647644,0.525942516110322,0.534354329109192,0.542635753803599,0.550792694091797,0.558830584490385,0.566754519939423,0.57456912814537,0.582278907299042,0.589887907888945,0.597400009632111,0.604823648665171,0.61215728521347,0.619404107958234,0.626567125320435,0.633649178748576,0.6406529545784,0.647580971386554,0.654435634613037,0.661219265805859,0.667934000492095,0.674581885647492,0.681164920330048,0.687684901255373,0.694143652915955,0.700542901033063,0.706884205341339,0.713169074873823,0.719399094581604,0.725575586915154,0.731700003147125,0.734741038550429,0.737769484519958,0.740785579737136,0.743789434432983,0.746781197247765,0.749761044979095,0.752729099732281,0.75568550825119,0.758630370209851,0.761563837528229,0.76448604959218,0.767397165298462,0.770297293677362,0.773186504840851,0.776064947064992,0.778932750225067,0.781790050767666,0.784636974334717,0.787473608513275,0.790300011634827,0.792803968023538,0.795300006866455,0.797803898371622,0.800300002098083,0.802803871877596,0.805299997329711,0.807803850847053,0.81029999256134,0.812803835179168,0.815299987792968,0.817803806620319,0.820299983024597,0.822803778631297,0.825299978256225,0.827803750922782,0.830299973487854,0.832803753381377,0.835300028324127,0.837803755931569,0.840300023555755,0.842803729,0.8453000188];

function calculate(baseatk, basedef, basesta, floor, minLvl, maxLvl, invalid, league, mon) {
  if (perfTiming) {
    var calculateT0 = performance.now();
    if (!(mon)) { mon = "";}
  }
  /* returns sorted list of all (up to 4096) combinations indexed by statProd + CP */
  /*console.log("calculate: Received: baseatk="+baseatk+" basedef="+basedef+" basesta="+basesta+" league="+league+" floor="+floor+" minLvl="+minLvl);*/
  /* Each item stored by statProd.CP */
  /* Rank definition: { "12613615.1500": { "IVs": {"A":14, "D":14, "S":14, "star": "3*"}, "base": {"A":145, "D":105, "S":115}, "battle": {"A":145, "D":105, "S":115}, "L":25}, */
  var ranks = [], invalids = [];
  var maxAtk = {value:0,aIV:0,dIV:0,sIV:0,sp:0};
  var maxDef = {value:0,aIV:0,dIV:0,sIV:0,sp:0};
  var maxHP = {value:0,aIV:0,dIV:0,sIV:0,sp:0};
  var minAtk = {value:1000,aIV:0,dIV:0,sIV:0,sp:0};
  var minDef = {value:1000,aIV:0,dIV:0,sIV:0,sp:0};
  var minHP = {value:1000,aIV:0,dIV:0,sIV:0,sp:0};
  var minRankLvl = 100;
  var maxRankLvl = 0;
  var numRanks = 0;
  
  /* account for half-level CPMs (40-1)*2 = 78 */
  minLvl = Math.max(0, (minLvl - 1) * 2); /* use half-levels */
  maxLvl = Math.max(0, (maxLvl - 1) * 2); /* use half-levels */
  
  for(var atk=floor/1;atk<=15;atk++){
    for(var def=floor/1;def<=15;def++){
      for(var sta=floor/1;sta<=15;sta++){
        for( var level = maxLvl; level >= minLvl; level-- ) {
          var cp = Math.max(10, Math.floor((baseatk + atk) * Math.sqrt(basedef + def) * Math.sqrt(basesta + sta) * cpm[level] * cpm[level] / 10));
    		  if ((league) && (cp > league)) {
    		    if ((level == minLvl) && (invalid)) {
    		      invalids.push({"A":atk, "D":def, "S":sta, "cp":cp});
    		    }
    		    continue; /* keep searching for level */
    		  }
    		  
    		  var aSt = (baseatk + atk)*cpm[level];
    		  var dSt = (basedef + def)*cpm[level];
    		  var sSt = Math.floor((basesta + sta)*cpm[level]);
    		  var statProd = Math.round(aSt * dSt * sSt);
    		  /* update maxStats if necessary */
    		  if ((maxAtk.value < aSt) || ((maxAtk.sp < statProd) && (maxAtk.value <= aSt))) {
    		    maxAtk.value = aSt;maxAtk.aIV = atk;maxAtk.dIV = def;maxAtk.sIV = sta;maxAtk.sp = statProd;}
    		  if ((maxDef.value < dSt) || ((maxDef.sp < statProd) && (maxDef.value <= dSt))) {
    		    maxDef.value = dSt;maxDef.aIV = atk;maxDef.dIV = def;maxDef.sIV = sta;maxDef.sp = statProd;}
    		  if ((maxHP.value < sSt) || ((maxHP.sp < statProd) && (maxHP.value <= sSt))) {
    		    maxHP.value = sSt;maxHP.aIV = atk;maxHP.dIV = def;maxHP.sIV = sta;maxHP.sp = statProd;}
    		  if (level/1 > maxRankLvl/1) {maxRankLvl = level;}
    		  /* update minStats if necessary */
    		  if ((minAtk.value > aSt) || ((minAtk.sp < statProd) && (minAtk.value >= aSt))) {
    		    minAtk.value = aSt;minAtk.aIV = atk;minAtk.dIV = def;minAtk.sIV = sta;minAtk.sp = statProd;}
    		  if ((minDef.value > dSt) || ((minDef.sp < statProd) && (minDef.value >= dSt))) {
    		    minDef.value = dSt;minDef.aIV = atk;minDef.dIV = def;minDef.sIV = sta;minDef.sp = statProd;}
    		  if ((minHP.value > sSt) || ((minHP.sp < statProd) && (minHP.value >= sSt))) {
    		    minHP.value = sSt;minHP.aIV = atk;minHP.dIV = def;minHP.sIV = sta;minHP.sp = statProd;}
    		  if (level/1 < minRankLvl/1) {minRankLvl = level;}
    		  
    		  var IVsum = atk/1 + def/1 + sta/1;
    		  var Star = "NA";
          if (IVsum<23){Star="0*";}else if(IVsum<30){Star="1*";}else if (IVsum<37){Star="2*";}else if(IVsum<45){Star="3*";}else{Star="4*";}
    		  level = level/2 + 1;
    		  
    		  /* store as arrays to prevent hash collisions from dropping entires */
    		  /* Tie Breaking Order: 1)StatProd -> 2)AtkStat -> 3)HPval -> 4)finalCP -> 5)StaIV -> 6)ERROR */
    		  var newIndex = statProd+"."+Math.round(100000*aSt);
    		  if (!(newIndex in ranks)) {
    		    ranks[newIndex] = [{ "IVs": {"A":atk, "D":def, "S":sta, "star":Star}, "battle":{"A":aSt, "D":dSt, "S":sSt}, "L":level, "CP":cp}];
    		  } else {
    		    var i;
    		    var ranksLen = ranks[newIndex].length;
    		    for (i=0; i<ranksLen; i++) {
    		      if (sSt > ranks[newIndex][i].battle.S) {
    		        break;
    		      } else if (sSt == ranks[newIndex][i].battle.S) {
    		        if (cp > ranks[newIndex][i].CP) {
    		          break;
    		        } else if (cp == ranks[newIndex][i].CP) {
    		          if (sta > ranks[newIndex][i].IVs.S) {
    		            /*console.log("Used 5th tie breaker (Stamina IV) for newIndex("+newIndex+"):"+JSON.stringify(ranks[newIndex]));*/
    		            break;
    		          } else if (sta == ranks[newIndex][i].IVs.S) {
    		            console.log("Need 6th tie breaker for newIndex("+newIndex+"):"+JSON.stringify(ranks[newIndex]));
    		          }
    		        }
    		      }
    		    }
    		    ranks[newIndex].splice(i, 0, { "IVs": {"A":atk, "D":def, "S":sta, "star":Star}, "battle":{"A":aSt, "D":dSt, "S":sSt}, "L":level, "CP":cp});
    		  }
    		  numRanks = numRanks + 1;
    		  break; /* stop evaluating this IV combination */
        }
      }
    }
  }
  
  /* sort by statProd+CP before returning */
  if (perfTiming) {var calculateTb = performance.now();/*console.log("calculate: Building took "+(calculateTb-calculateT0).toFixed(1)+"ms");*/}
  const sorted = {};
  Object.keys(ranks).sort(function(a, b){return b-a;}).forEach(function(key) {sorted[key] = ranks[key];});
  if (perfTiming) {var calculateTs = performance.now();/*console.log("calculate: Sorting took "+(calculateTs-calculateTb).toFixed(1)+"ms");*/}
  
  /* add max stats to object */
  sorted.maxAtk = maxAtk;
  sorted.maxDef = maxDef;
  sorted.maxHP = maxHP;
  sorted.minAtk = minAtk;
  sorted.minDef = minDef;
  sorted.minHP = minHP;
  sorted.minLvl = 1+(minRankLvl/2);
  sorted.maxLvl = 1+(maxRankLvl/2);
  sorted.numRanks = numRanks;
  sorted.invalids = invalids;
  
  /* console.log("calculate output:"+JSON.stringify(sorted, null, 2)); */
  if (perfTiming) {var calculateT1 = performance.now();
  console.log(mon+" calculate: "+(calculateT1-calculateT0).toFixed(1)+"ms (Build "+(calculateTb-calculateT0).toFixed(1)+"ms + Sort "+(calculateTs-calculateTb).toFixed(1)+"ms) for "+numRanks+" ranks.");}
  return sorted;
}