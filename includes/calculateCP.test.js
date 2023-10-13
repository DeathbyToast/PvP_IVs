// didn't import/export since modules don't work on some browsers
// https://caniuse.com/es6-module
function calculateCP(baseatk, basedef, basesta, atkIV, defIV, staIV, level) {
  const index = Math.round((level - 1) * 2);
  const cp = Math.max(10, Math.floor((baseatk + atkIV) * Math.sqrt(basedef + defIV) * Math.sqrt(basesta + staIV) * cpm[index] * cpm[index] / 10));
  return cp;
} 

function testCalculateCP() {
  const haunterCPs = [
    1178, 1206, 1234, 1262, 1290, 1318, 1346, 1374, 1402, 1430, 1458, 1486,
    1514, 1542, 1570, 1598, 1626, 1654, 1683, 1697, 1711, 1725, 1739,
  ];

  const diglettCPs = [367, 376, 386, 396, 405];

  const staryuCPs = [
    16, 33, 51, 68, 86, 103, 121, 138, 156, 173, 191, 208, 225, 243, 260, 278,
    295, 313, 330, 347, 363, 380, 396, 413, 429, 446, 462, 479, 495, 512, 529,
    545, 562, 578, 595, 611, 628, 644, 661, 677, 694, 710, 727, 743, 760, 777,
    793, 810, 826, 843, 859, 876, 892, 909, 925, 942, 958, 975, 991, 1000, 1008,
    1016, 1025, 1033, 1041, 1049, 1058, 1066, 1074, 1082, 1091,
  ]; //495 is level 15

  const magikarpCPs = [61, 66, 70, 74, 78, 82, 86, 90, 94, 98, 102, 106, 109, 113, 117, 121, 125, 129, 133, 137, 141, 145, 149, 153, 157, 160, 164, 168, 172, 176, 180, 184,
    188, 192, 196, 200, 204, 208, 212, 215, 219, 223, 227, 231, 235, 237, 239, 241, 243, 245, 247, 249, 251, 253, 255, 257, 259, 261, 263, 265, 266, 268, 270, 272, 274,
    276, 278, 280, 281, 283, 285, 287, 288, 290, 292, 294, 296, 297, 299, 301, 303, 305, 306, 308, 310]; // 276 is lvl 40.5

  const pidgeottoCPs = [
    305, 323, 341, 358, 375, 392, 409, 426, 443, 460, 477, 495, 512, 529, 546,
    563, 580, 597, 614, 631, 648, 665, 682, 699, 716, 733, 750, 768, 785, 802,
    819, 836, 853, 870, 887, 904, 921, 938, 955, 972, 989, 1007, 1024, 1032,
    1041, 1049, 1058, 1066, 1075, 1083, 1092, 1100, 1109, 1117, 1126, 1135,
    1143, 1152, 1160, 1169, 1177, 1186, 1194, 1202, 1209, 1217, 1225, 1232,
    1240, 1248, 1255, 1263, 1271, 1279,
  ]; // level 9 onward

  const torchicCPs = [890, 906, 921, 937, 945, 953, 960, 968, 976, 984, 992, 1000, 1007, 1015, 1023, 1031, 1039, 1046, 1054, 1062, 1070, 1078, 1085, 1093,
    1100, 1107, 1114, 1121, 1128, 1135, 1142, 1149, 1156, 1164, 1171, 1178, 1185, 1192, 1200, 1207, 1214, 1221, 1229, 1236];// 1100 is level 40.5

  const treeckoCPs = [827, 842, 857, 872, 887, 902, 910, 917, 925, 932, 940, 947, 955, 962, 970, 977, 985, 992, 1000, 1008, 1015, 1023, 1030, 1038, 1045, 1053,
    1059, 1066, 1073, 1079, 1086, 1093, 1100, 1107, 1113, 1120, 1127, 1134, 1141, 1148, 1155, 1162, 1169, 1176, 1183, 1190];

  const beldumCPs = [906, 913, 920, 927, 934, 941, 948, 955, 962, 969, 976,
    982, 989, 995, 1001, 1007, 1014]; // 982 is level 40.5

  const elgyemCPs = [19, 40, 61, 82, 103, 124, 145, 165]; // 593 CP is lvl 15

  const meltanCPs = [15, 31, 47, 63, 79, 95, 111, 127, 144, 160, 176, 192, 208,
    224, 240, 256, 273, 289, 305, 320, 335, 350, 366, 381, 396, 411, 427, 442,
    457, 473, 488, 503, 518, 534, 549, 564, 579]; // 549 is lvl 18

  function testHundoCpArray(baseatk, basedef, basesta, startingLevel, cpArray) {
    for (let i = 0; i < cpArray.length; i++) {
      console.assert(calculateCP(baseatk, basedef, basesta, 15, 15, 15, startingLevel + i * 0.5) === cpArray[i]);
    }
  }

  function testCPs(baseatk, basedef, basesta, atkIV, defIV, staIV, startingLevel, cpArray) {
    for (let i = 0; i < cpArray.length; i++) {
      console.assert(calculateCP(baseatk, basedef, basesta, atkIV, defIV, staIV, startingLevel + i * 0.5) === cpArray[i]);
    }
  }

  const HAUNTER_BASE_ATK = 223;
  const HAUNTER_BASE_DEF = 107;
  const HAUNTER_BASE_STA = 128;
  const HAUNTER_STARTING_LEVEL = 21;
  testHundoCpArray(HAUNTER_BASE_ATK, HAUNTER_BASE_DEF, HAUNTER_BASE_STA, HAUNTER_STARTING_LEVEL, haunterCPs);

  const DIGLETT_STARTING_LEVEL = 19;
  testHundoCpArray(109, 78, 67, DIGLETT_STARTING_LEVEL, diglettCPs);

  const STARYU_STARTING_LEVEL = 1;
  testHundoCpArray(137, 112, 102, STARYU_STARTING_LEVEL, staryuCPs);

  const MAGIKARP_STARTING_LEVEL = 8;
  testHundoCpArray(29, 85, 85, MAGIKARP_STARTING_LEVEL, magikarpCPs);

  const PIDGEOTTO_BASE_ATK = 117;
  const PIDGEOTTO_BASE_DEF = 105;
  const PIDGEOTTO_BASE_STA = 160;
  const PIDGEOTTO_STARTING_LEVEL = 9;
  testHundoCpArray(PIDGEOTTO_BASE_ATK, PIDGEOTTO_BASE_DEF, PIDGEOTTO_BASE_STA, PIDGEOTTO_STARTING_LEVEL, pidgeottoCPs);

  const TREECKO_STARTING_LEVEL = 27.5;
  testHundoCpArray(124, 94, 120, TREECKO_STARTING_LEVEL, treeckoCPs);

  const TORCHIC_STARTING_LEVEL = 28.5;
  testHundoCpArray(130, 87, 128, TORCHIC_STARTING_LEVEL, torchicCPs);

  const BELDUM_STARTING_LEVEL = 35;
  testHundoCpArray(96, 132, 120, BELDUM_STARTING_LEVEL, beldumCPs);

  testHundoCpArray(148, 100, 146, 1, elgyemCPs);

  testHundoCpArray(118, 99, 130, 1, meltanCPs);

}

testCalculateCP();
