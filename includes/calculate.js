function calculate(baseatk, basedef, basesta, floor, minLvl, maxLvl, invalid, league) {
  if (perfTiming) {var calculateT0 = performance.now();}
  /* returns sorted list of all (up to 4096) combinations indexed by statProd + CP */
  console.log("calculate: Received: baseatk="+baseatk+" basedef="+basedef+" basesta="+basesta+" league="+league+" floor="+floor+" minLvl="+minLvl);
  /* Each item stored by statProd.CP */
  /* Rank definition: { "12613615.1500": { "IVs": {"A":14, "D":14, "S":14, "star": "3*"}, "base": {"A":145, "D":105, "S":115}, "battle": {"A":145, "D":105, "S":115}, "L":25}, */
  var ranks = [], invalids = [];
  var maxAtk = {value:0,aIV:0,dIV:0,sIV:0,sp:0};
  var maxDef = {value:0,aIV:0,dIV:0,sIV:0,sp:0};
  var maxHP = {value:0,aIV:0,dIV:0,sIV:0,sp:0};
  var minAtk = {value:1000,aIV:0,dIV:0,sIV:0,sp:0};
  var minDef = {value:1000,aIV:0,dIV:0,sIV:0,sp:0};
  var minHP = {value:1000,aIV:0,dIV:0,sIV:0,sp:0};
  var numRanks = 0;
  /* account for half-level CPMs (40-1)*2 = 78 */
  minLvl = Math.max(0, (minLvl - 1) * 2); /* use half-levels */
  maxLvl = Math.max(0, (maxLvl - 1) * 2); /* use half-levels */

  /* cpm array used for calculations, source: https://www.reddit.com/r/TheSilphRoad/comments/eco7qc/exact_cpms_for_all_half_levels_between_level_40_45/ */
  var cpm = [0.0939999967813492, 0.1351374320893390, 0.1663978695869450, 0.1926509131553250, 0.2157324701547620, 0.2365726514248220, 0.2557200491428380, 0.2735303721065720, 0.2902498841285710, 0.3060573813898630, 0.3210875988006590, 0.3354450319964510, 0.3492126762866970, 0.3624577366099390, 0.3752355873584750, 0.3875924077138780, 0.3995672762393950, 0.4111935532161000, 0.4225000143051150, 0.4329264205125090, 0.4431075453758240, 0.4530599481650490, 0.4627983868122100, 0.4723360853112780, 0.4816849529743190, 0.4908558071795490, 0.4998584389686580, 0.5087017489616000, 0.5173939466476440, 0.5259425161103220, 0.5343543291091920, 0.5426357538035990, 0.5507926940917970, 0.5588305844903850, 0.5667545199394230, 0.5745691281453700, 0.5822789072990420, 0.5898879078889450, 0.5974000096321110, 0.6048236486651710, 0.6121572852134700, 0.6194041079582340, 0.6265671253204350, 0.6336491787485760, 0.6406529545784000, 0.6475809713865540, 0.6544356346130370, 0.6612192658058590, 0.6679340004920950, 0.6745818856474920, 0.6811649203300480, 0.6876849012553730, 0.6941436529159550, 0.7005429010330630, 0.7068842053413390, 0.7131690748738230, 0.7193990945816040, 0.7255755869151540, 0.7317000031471250, 0.7347410385504290, 0.7377694845199580, 0.7407855797371360, 0.7437894344329830, 0.7467811972477650, 0.7497610449790950, 0.7527290997322810, 0.7556855082511900, 0.7586303702098510, 0.7615638375282290, 0.7644860495921800, 0.7673971652984620, 0.7702972936773620, 0.7731865048408510, 0.7760649470649920, 0.7789327502250670, 0.7817900507676660, 0.7846369743347170, 0.7874736085132750, 0.7903000116348270, 0.792803968023538, 0.7953000068664551, 0.7978038983716224, 0.8003000020980835, 0.8028038718775964, 0.8052999973297119, 0.8078038508470536, 0.8102999925613403, 0.812803835179168, 0.8152999877929688];
  
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
    		  /* update minStats if necessary */
    		  if ((minAtk.value > aSt) || ((minAtk.sp < statProd) && (minAtk.value >= aSt))) {
    		    minAtk.value = aSt;minAtk.aIV = atk;minAtk.dIV = def;minAtk.sIV = sta;minAtk.sp = statProd;}
    		  if ((minDef.value > dSt) || ((minDef.sp < statProd) && (minDef.value >= dSt))) {
    		    minDef.value = dSt;minDef.aIV = atk;minDef.dIV = def;minDef.sIV = sta;minDef.sp = statProd;}
    		  if ((minHP.value > sSt) || ((minHP.sp < statProd) && (minHP.value >= sSt))) {
    		    minHP.value = sSt;minHP.aIV = atk;minHP.dIV = def;minHP.sIV = sta;minHP.sp = statProd;}
    		  
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
  if (perfTiming) {var calculateTb = performance.now();
  console.log("calculate: Building took "+(calculateTb-calculateT0).toFixed(1)+"ms");}
  const sorted = {};
  Object.keys(ranks).sort(function(a, b){return b-a;}).forEach(function(key) {sorted[key] = ranks[key];});
  if (perfTiming) {var calculateTs = performance.now();
  console.log("calculate: Sorting took "+(calculateTs-calculateTb).toFixed(1)+"ms");}
  
  /* add max stats to object */
  sorted.maxAtk = maxAtk;
  sorted.maxDef = maxDef;
  sorted.maxHP = maxHP;
  sorted.minAtk = minAtk;
  sorted.minDef = minDef;
  sorted.minHP = minHP;
  sorted.numRanks = numRanks;
  sorted.invalids = invalids;
  
  /* console.log("calculate output:"+JSON.stringify(sorted, null, 2)); */
  if (perfTiming) {var calculateT1 = performance.now();
  console.log("calculate: Execution took "+(calculateT1-calculateT0).toFixed(1)+"ms");}
  return sorted;
}