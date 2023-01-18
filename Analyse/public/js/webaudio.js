// Source:
//https://github.com/takispig/db-meter

var refresh_rate = 500;
var stream;
var offset = 30;
var average = 0;
var mindestDatenProAufnahme = 50;
var anzahlDatenProAufnahme = 50;

//Testarray for offest
var testarray = [30, 25, 20, 25, 10, -10, -10, -15, -20, -30];

const db = document.getElementById("db");
var con;
var con;
let durchschn = document.getElementById("ausg");
let maxim = document.getElementById("maxima");

messungButton = document.getElementById("messung");
messungStoppenButton = document.getElementById("messungStoppen");
var nameDiv = document.getElementById("NameDiv");
var osbDiv = document.getElementById("OpenSenseBoxDiv");

nameDiv.value = "";
osbDiv.value = "";

messungButton.disabled = true;
messungStoppenButton.disabled = true;

messungButton.addEventListener("click", startMessung);
messungStoppenButton.addEventListener("click", stoppMessung);

nameDiv.addEventListener("change", function () {
  if (osbDiv.value == "" || nameDiv.value == "" || pos == undefined) {
    messungButton.disabled = true;
  } else {
    messungButton.disabled = false;
  }
});
osbDiv.addEventListener("change", function () {
  if (osbDiv.value == "" || nameDiv.value == "" || pos == undefined) {
    messungButton.disabled = true;
  } else {
    messungButton.disabled = false;
  }
});

var mindestDatenProAufnahme = 50;

function startMessung() {
  messungStoppenButton.disabled = false;
  var newName = document.getElementById("NameDiv").value;
  var osbID = document.getElementById("OpenSenseBoxDiv").value;
  anzahlDatenProAufnahme = anzahlDatenProAufnahme + 100;

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      const context = new AudioContext();
      con = context;
      // Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream which may
      // come from the local computer microphone or other sources.
      const source = context.createMediaStreamSource(stream);
      // creates a ScriptProcessorNode used for direct audio processing
      const processor = context.createScriptProcessor(2048, 1, 1);
      // reates an AnalyserNode, which can be used to expose audio time and frequency data and create data visualizations
      const analyser = context.createAnalyser();

      // A double value representing the averaging constant with the last analysis frame —
      // basically, it makes the transition between values over time smoother.
      analyser.smoothingTimeConstant = 0.8;
      // An unsigned long value representing the size of the FFT (Fast Fourier Transform)
      // to be used to determine the frequency domain.
      analyser.fftSize = 256;

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(context.destination);

      processor.onaudioprocess = () => {
        var data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        var values = 0;

        for (var i = 0; i < data.length; i++) {
          //if (data[i]>130) data[i]=130;
          values += data[i];
        }

        average = 20 * Math.log10(values / data.length);
        if (isFinite(average)) {

          db.innerText = average;
          //Klonen der Aufnahmestruktur aus modell.js
          let a = Object.assign({}, aufnahme);
          a.lat = pos[0];
          a.lon = pos[1];
          a.value = average;
          a.boxName = newName;
          a.boxId = osbID;
          modell.push(a);
        }
      };
      const analyserNode = context.createAnalyser();
      source.connect(analyserNode);
      const pcmData = new Float32Array(analyserNode.fftSize);
      const onFrame = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) {
          sumSquares += amplitude * amplitude;
        }
        volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
        window.requestAnimationFrame(onFrame);
      };

      window.requestAnimationFrame(onFrame);

    });

  // update the volume every refresh_rate m.seconds
  var updateDb = function () {
    window.clearInterval(interval);

    var volume = Math.round(modell.reduce((a, b) => a + b) / modell.length);
    //var volume = Math.round(Math.max.apply(null, aufnahme));
    if (!isFinite(volume)) volume = 0; // we don't want/need negative decibels in that case
    db.innerText = volume;
    aufnahme = []; // clear previous values

    interval = window.setInterval(updateDb, refresh_rate);
  };
  var interval = window.setInterval(updateDb, refresh_rate);
}

// change update rate

function changeUpdateRate() {
  refresh_rate = Number(document.getElementById("refresh_rate").value);
  document.getElementById("refresh_value").innerText = refresh_rate;
  intervalId = window.setInterval(function () {
    updateDb;
  }, refresh_rate);
}

// stopping measurment
function stoppMessung() {

  messungStoppenButton.disabled = true;
  if (modell.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log(modell);
    var summe = 0;
    for (let i = 0; i < modell.length; i++) {
      summe = summe + modell[i].value;
    }
    durchschn.innerHTML =
      "<br>Messung erfolgreich!<br>" +
      "Gemessener Durchschnitt:<br><b>" +
      Math.round(summe / modell.length) +
      "</b> dB";
    messungButton.textContent = "Neue Messung";
  }

  if (aufnahme.length > mindestDatenProAufnahme) {
    con.suspend();
    console.log(aufnahme);
  }
}

document.getElementById("hinzufuegen").addEventListener("click", function () {
  getValues();
});

function getValues() {
  // Daten einlesen
  var newName = document.getElementById("NameDiv").value;
  var osbID = document.getElementById("OpenSenseBoxDiv").value;
  var newModell = modell;
  var newStandort = pos;
  //console.log(newName, newModell, newStandort);
  document.getElementById("FehlerDiv").style.display = "none";
  document.getElementById("FehlerDiv2").style.display = "none";
  document.getElementById("FehlerDiv3").style.display = "none";
  if (newName == "") {
    document.getElementById("FehlerDiv3").style.display = "block";
  } else if (newModell.length == 0) {
    document.getElementById("FehlerDiv").style.display = "block";
  } else if (newStandort == null) {
    document.getElementById("FehlerDiv2").style.display = "block";
  } else {
    var durchschnitt = getDurchschnitt(newModell);

    data = {
      name: newName,
      geometry: {
        type: "Point",
        coordinates: newStandort,
      },
      Messung: newModell,
      Durchschnitt: durchschnitt,
      OpenSenseBoxID: osbID,
    };
    console.log(data);
    postData(data);
  }
}

/**
 * Berechnet den Durchschnitt aus einem Feld mit int Werten
 * @param {int} Messungen
 * @returns durchschnitt
 */
function getDurchschnitt(Messungen) {
  var Summe = 0;
  for (var i = 0; i < Messungen.length; i++) {
    Summe = Summe + Messungen[i].value;
  }
  return Summe / Messungen.length;
}

/**
 * Fetcht die neuen Daten
 * @param doc zu postende Daten
 */
function postData(doc) {
  fetch("/addData", {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(doc),
  });
 
  if (aufnahme.length > 50){
    con.suspend();
    console.log(aufnahme);
    tonspurMax(aufnahme)
  }

  document.getElementById("hinzufuegen").addEventListener("click", function () {
  getValues();
  });
}

function getValues() {
  // Daten einlesen
  var newName = document.getElementById("NameDiv").value;
  var osbID = document.getElementById("OpenSenseBoxDiv").value;
  var newModell = modell;
  var newStandort = pos;
  //console.log(newName, newModell, newStandort);
  document.getElementById("FehlerDiv").style.display = "none";
  document.getElementById("FehlerDiv2").style.display = "none";
  document.getElementById("FehlerDiv3").style.display = "none";
  if (newName == "") {
    document.getElementById("FehlerDiv3").style.display = "block";
  } else if (newModell.length == 0) {
    document.getElementById("FehlerDiv").style.display = "block";
  } else if (newStandort == null) {
    document.getElementById("FehlerDiv2").style.display = "block";
  } else {
    var durchschnitt = getDurchschnitt(newModell);

    data = {
      name: newName,
      geometry: {
        type: "Point",
        coordinates: newStandort,
      },
      Messung: newModell,
      Durchschnitt: durchschnitt,
      OpenSenseBoxID: osbID,
    };
    console.log(data);
    postData(data);
  }
}

/**
 * Berechnet den Durchschnitt aus einem Feld mit int Werten
 * @param {int} Messungen
 * @returns durchschnitt
 */
function getDurchschnitt(Messungen) {
  var Summe = 0;
  for (var i = 0; i < Messungen.length; i++) {
    Summe = Summe + Messungen[i].value;
  }
  return Summe / Messungen.length;
}

/**
 * Fetcht die neuen Daten
 * @param doc zu postende Daten
 */
function postData(doc) {
  fetch("/addData", {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(doc),
  });

  if (aufnahme.length > 50) {
    con.suspend();
    console.log(aufnahme);
    tonspurMax(aufnahme);
  }
}

///////////////////////////////////////////////////////////////////////////
//// Array kürzen
///////////////////////////////////////////////////////////////////////////

/**
 * Searches for the first maximum decible value
 * inside the given soundarray 
 * @param {Array} soundArray 
 * @returns {Number} max - is the indice of the first maximum decible value
 */
function soundArrayMax(soundArray) {
  if (soundArray.length > 0) {
      let max = soundArray[0];
      let maxIndex = 0;
      // search for maximum
      for (var i = 1; i < soundArray.length; i++) {
          if (soundArray[i] > max) {
              maxIndex = i;
              max = soundArray[i];
          }
      }
  
      var realMaxIndex = maxIndex
      // check that this value is really the last of the starting sound, as this sound is one secound long
      for(i = maxIndex + 1; i < maxIndex + 10; i++) { // 10 as time for the maximum length of the starting sound 
          if(soundArray[maxIndex] - 2 < soundArray[i]) { // maximum 2 decibles difference as varianz
              realMaxIndex = i 
          }
      }
      return realMaxIndex;
  }
  else{
      console.error("Fehlerhafter Lautstärke-Array übergeben") // Error handling
      // @todo  response auf der Website anzeigen
  }
}

/**
* Slices the soundArray starting from the 
* first max decible value down to 100 sound values
* @param {Array} soundArray is the array that needs to be shortend
*/
function sliceSoundArray(soundArray) {
  const max = soundArrayMax(soundArray)
  if(soundArray[max] === undefined || soundArray[max+100] === undefined){
      console.error("Die Soundaufnahme ab dem Kalibrierungsstart ist zu kurz"); // Error handling
      // @todo  response auf der Website anzeigen
  }
  else{
      soundArray = soundArray.slice(max, max + 100) // shorten Array to 30 values
  }
}