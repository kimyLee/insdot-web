// export default '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="?3U;%e-F`beKTnGkyWPA">value</variable></variables><block type="setUp" id="hYtIewSkz:6WqAz~P5lt" x="90" y="50"></block><block type="procedures_defnoreturn" id=":1.cYyqLE85HpPfX8DcK" x="90" y="450"><mutation><arg name="value" varid="?3U;%e-F`beKTnGkyWPA"></arg></mutation><field name="NAME">When_JOYO_Read</field><comment pinned="false" h="80" w="160">Describe this function...</comment></block></xml>'

export default `
var number, value, currentQuestion, currentLight, inputCode, answer, i;

// Describe this function...
var test = { a: 123 };
print("init");
print("init1", JSON.stringify(test));
print("init2", test);
function getLock (number) {
  blePlayMusic("01do");
  if (number == 804) {
    answer = '5936';
  }
  if (number == 809) {
    answer = '8347';
  }
}

function listsRepeat (value, n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}

// Describe this function...
function showLightLength () {
  currentLight = listsRepeat(0, 12);
  var i_end = answer.length;
  var i_inc = 1;
  if (0 > i_end) {
    i_inc = -i_inc;
  }
  for (i = 0; i_inc >= 0 ? i <= i_end : i >= i_end; i += i_inc) {
    currentLight[(i - 1)] = 8912896;
  }
  bleSetLight({ colors: currentLight, bright: 1 });
}

// Describe this function...
function When_JOYO_Read (value) {
  print("When_JOYO_Read", value);

  if (value >= 801 || value <= 816) {
    getLock(value);
    currentQuestion = value;
  }
  if (value >= 300 && value <= 310) {
    inputCode = String(inputCode) + String(value - 300);
  }
  check();
}

// Describe this function...
function resetLock () {
  inputCode = '';
  sleepFn(1);
  showLightLength();
}

// Describe this function...
function check () {
  currentLight = listsRepeat(0, 12);
  var i_end2 = inputCode.length;
  var i_inc2 = 1;
  if (1 > i_end2) {
    i_inc2 = -i_inc2;
  }
  for (i = 1; i_inc2 >= 0 ? i <= i_end2 : i >= i_end2; i += i_inc2) {
    currentLight[(i - 1)] = 16777215;
  }
  print("inputCode");
  print("answer", JSON.stringify(answer));
  bleSetLight({ colors: currentLight, bright: 1 });
  blePlayMusic("mov5");
  sleepFn(1);
  if (inputCode.length == answer.length) {
    if (inputCode == answer) {
      blePlayMusic("gwin");
      inputCode = '';
    } else {
      blePlayMusic("olwh");
      resetLock();
    }
  }
}


function setUp () {
  currentQuestion = 0;
  answer = '';
  inputCode = '';
  blePlayMusic("olwh");
}

setUp();
`
