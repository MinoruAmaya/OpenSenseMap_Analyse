/***** all getElements *****/
let btn_Gcal = document.getElementById("btn_Gruppenkalibrierung");
let btn_upload = document.getElementById("uploadData");
let btn_xl2 = document.getElementById("btn_XL2");
let btn_COM = document.getElementById("btn_COM");
let input_COM = document.getElementById("input_COM");
let in_GroupCode = document.getElementById("input_GroupCode");
let in_file = document.getElementById("in_file");
let in_soundArray = document.getElementById("soundArray");
let in_COM = document.getElementById("in_COM");
let hideText = document.getElementById("hideText");
let output_error_cal = document.getElementById("output_Error_Cal");
let output_error_up = document.getElementById("output_Error_Up");
let out_fin = document.getElementById("out_finished");
let an_s1 = document.getElementById("s1");
let an_s2 = document.getElementById("s2");
let an_s3 = document.getElementById("s3");
let an_s4 = document.getElementById("s4");
let an_txt = document.getElementById("AnleitungText");

/***** all EventListeners ******/
btn_Gcal.addEventListener("click", function(){checkErrorAndStartWorkflow("Cal"); handleAnleitung("s4");});
btn_upload.addEventListener("click", function(){checkErrorAndStartWorkflow("Up");});
btn_xl2.addEventListener("click", function(){playSound(); window.location = '/kalibrierung/XL2';});
btn_COM.addEventListener("click", function(){com = input_COM.value});
an_s1.addEventListener("click", function(){handleAnleitung("s1");});
an_s2.addEventListener("click", function(){handleAnleitung("s2");});
an_s3.addEventListener("click", function(){handleAnleitung("s3");});
an_s4.addEventListener("click", function(){handleAnleitung("s4");});

/***** all Variables ******/
const audio_calibration = new Audio('/sounds/Calibration_sound.mp3');
let xl2Tonspur = in_soundArray.innerHTML.split(',');
let counter = 0;
let group_code;
let com = "";
let SBID = "63c3f0c9a122c30008268cc0";
let SBSensor = "63c3f0c9a122c30008268cc1";
let AT = "e435ff67dd967d7211a529463861c5497025e410465f7c68935563ac54b6e62c";
let preparedXL2Data = [];
//let xl2Tonspur = [71, 58, 47, 47, 49, 48, 56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57, 56,56, 55, 55, 57]

// build the site dependand if the xl2 data was already recorded
if(xl2Tonspur[0] != ''){
    btn_xl2.classList.remove("btn-primary");
    btn_xl2.classList.add("btn-secondary", "disabled");
    btn_Gcal.classList.remove("btn-secondary", "disabled");
    btn_Gcal.classList.add("btn-primary");
    btn_upload.classList.remove("btn-secondary", "disabled");
    btn_upload.classList.add("btn-primary");
    in_GroupCode.readOnly = false;
    handleAnleitung("s3")
}

/***** all functionalities ******/

/**
 * tests that the preconditions are given, so 
 * the functionalities can work without problems
 * This function also starts the workflows 
 * @param {String} type - what button called this function
 */
function checkErrorAndStartWorkflow(type){
    let error = false;
    // Here start the code for the groupcalibration button (btn_Gcal)
    if(type === "Cal"){
        let code = in_GroupCode.value;
        if(code.length > 7){
            output_error_cal.innerHTML = "Input zu lang!";
        }
        else if(code.length < 7){
            output_error_cal.innerHTML = "Input zu kurz!"
        }
        else{
            for(var i = 0; i < code.length; i++){
                if(isNaN(code[i])){
                    output_error_cal.innerHTML = "Nur Zahlen erlaubt!"
                    error = true;
                }
            }
            if(error === false){
                group_code = in_GroupCode.value;
                btn_Gcal.classList.remove("btn-primary")
                btn_Gcal.classList.add("btn-secondary", "disabled")
                output_error_cal.classList.remove("text-danger");
                output_error_cal.classList.add("text-success");
                output_error_cal.innerHTML = "Lade Teilnehmer ein mit dem Code: " + group_code; 
            }
        }
    }
    // Here start the code for the upload button (btn_upload)
    else if(type === "Up"){
        if(xl2Tonspur[0] === ""){
            output_error_up.innerHTML = "Keine Tonspur vorhanden";
        }
        else if(group_code === undefined){
            output_error_up.innerHTML = "Keine Gruppe erstellt";
        }
        else{
            output_error_up.innerHTML = "";
            sliceSoundArray(xl2Tonspur);
            prepareXL2Data();
            sendReferenceData();
            output_error_cal.innerHTML = " "; 
            btn_upload.classList.remove("btn-success");
            btn_upload.classList.add("disabled", "btn-secondary");
            out_fin.classList.remove("visually-hidden");
        }
    }
}

/**
 * Handles the changing of the sites from the Anleitung
 * @param {String} Seite which should be displayed
 */
function handleAnleitung(Seite){
    if(Seite === "s1"){
        in_COM.classList.remove("visually-hidden");
        hideText.classList.remove("visually-hidden");
        an_s1.classList.remove("btn-outline-secondary");
        an_s1.classList.add("btn-success");
        an_s2.classList.remove("btn-success");
        an_s2.classList.add("btn-outline-secondary");
        an_s3.classList.remove("btn-success");
        an_s3.classList.add("btn-outline-secondary");
        an_s4.classList.remove("btn-success");
        an_s4.classList.add("btn-outline-secondary");
        an_txt.innerHTML = '1. Verbinden Sie ihr Endgerät mit dem XL2-Gerät </br></br> 2. Wählen Sie auf dem XL2 das Feld COM-Port aus und geben Sie unten ihren verwendeten COM-Port an </br>'
    }
    if(Seite === "s2"){
        in_COM.classList.add("visually-hidden");
        hideText.classList.add("visually-hidden");
        an_s2.classList.remove("btn-outline-secondary");
        an_s2.classList.add("btn-success");
        an_s1.classList.remove("btn-success");
        an_s1.classList.add("btn-outline-secondary");
        an_s3.classList.remove("btn-success");
        an_s3.classList.add("btn-outline-secondary");
        an_s4.classList.remove("btn-success");
        an_s4.classList.add("btn-outline-secondary");
        an_txt.innerHTML = '3. Stellen Sie sicher, dass alle Teilnehmer die korrekte Position eingenommen haben </br></br> 4. Stellen Sie sicher, dass ihr Gerät mit der Box verbunden </br></br> 5. Starten Sie den Kalibrierungsprozess, indem Sie den Knopf "Kalibrierungsprozess starten" drücken (Bitte warten Sie)'
    }
    else if(Seite === "s3"){
        in_COM.classList.add("visually-hidden");
        hideText.classList.add("visually-hidden");
        an_s3.classList.remove("btn-outline-secondary");
        an_s3.classList.add("btn-success");
        an_s1.classList.remove("btn-success");
        an_s1.classList.add("btn-outline-secondary");
        an_s2.classList.remove("btn-success");
        an_s2.classList.add("btn-outline-secondary");
        an_s4.classList.remove("btn-success");
        an_s4.classList.add("btn-outline-secondary");
        an_txt.innerHTML = '6. Überlegen Sie sich nun einen siebenstelligen Code im Feld "Group-Code" </br></br> 7. Erstellen Sie den Kalibrierungsraum, indem Sie den Knopf "Kalibrierungsraum erstellen" drücken </br></br> 8. Geben Sie diesen Code an alle Teilnehmer weiter </br>'
    }
    else if(Seite === "s4"){
        in_COM.classList.add("visually-hidden");
        hideText.classList.add("visually-hidden");
        an_s4.classList.remove("btn-outline-secondary");
        an_s4.classList.add("btn-success");
        an_s1.classList.remove("btn-success");
        an_s1.classList.add("btn-outline-secondary");
        an_s2.classList.remove("btn-success");
        an_s2.classList.add("btn-outline-secondary");
        an_s3.classList.remove("btn-success");
        an_s3.classList.add("btn-outline-secondary");
        an_txt.innerHTML = '9. Geben Sie nun die aufgenommenen Daten von Ihnen frei, indem Sie den Knopf "Daten für Teilnehmer freigeben" drücken </br></br> 10. Nun können alle Teilnehmer ihre Kalibrierungsprozess starten </br></br> 11. Sie können nun diese Seite verlassen </br></br>'
    }
}

/**
 * function plays the Audio for the calibration,
 * if button "Sound Starten" is clicked
 */
function playSound(){
    setTimeout(audio_calibration.play(), 1000);
}

/**
 * takes the recorded XL2 Soundarray and converts it into 
 * a new Array, which corresponds to the OpenSenseMap standards
 */
function prepareXL2Data(){
    // add the group code as first element
    const groupCode = {
        "sensor":"63c3f0c9a122c30008268cc1",
        "value": group_code
    }
    preparedXL2Data.push(groupCode);
    // add all the sound values to the Array
    xl2Tonspur.forEach(value => {
        const data = {
            "sensor":"63c3f0c9a122c30008268cc1",
            "value": value
        }
        preparedXL2Data.push(data);
    })
    console.log(preparedXL2Data)
}
  
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
        for(i = maxIndex + 1; i < maxIndex + 20; i++) { // 20 as time for the maximum length of the starting sound 
            if(soundArray[maxIndex] - 5 < soundArray[i]) { // maximum 5 decibles difference as varianz
                realMaxIndex = i 
            }
        }
        console.log(realMaxIndex)
        return realMaxIndex;
    }
    else{
        console.error("Fehlerhafter Lautstärke-Array übergeben") // Error handling
    }
}
  
/**
 * Slices the soundArray starting from the 
 * first max decible value down to 100 sound values
 * @param {Array} soundArray is the array that needs to be shortend
 */
function sliceSoundArray(soundArray) {
    const max = soundArrayMax(soundArray)
    if(soundArray[max] === undefined || soundArray[max+149] === undefined){
        console.error("Die Soundaufnahme ab dem Kalibrierungsstart ist zu kurz"); // Error handling
        output_error_cal.innerHTML = "Fehlerhafte Soundaufnahme. Versuchen Sie erneut."
    }
    else{
        output_error_cal.innerHTML = "";
        soundArray = soundArray.slice(max, max + 149) // shorten Array to 30 values
    }
}

/**
 * Uploads the measured sound array to the
 * OpenSenseMap Server as the reference data
 */
function sendReferenceData() {
    fetch(`https://api.opensensemap.org/boxes/${SBID}/data`, {
        method: 'POST',
        headers: {
            'Authorization': AT,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preparedXL2Data)
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}



/**********************
 * Notfalls Demo      *
 **********************/

let btn_notfalls_demo1 = document.getElementById("btn_demo1");
let btn_notfalls_demo2 = document.getElementById("btn_demo2");
btn_notfalls_demo1.addEventListener("click", startDemo);
btn_notfalls_demo2.addEventListener("click", continueDemo);
let xl2DemoData = [80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,80,34,34,34,34,34,34,34,34,34,34,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,56,56,56,56,56,56,56,56,56,56,34,34,34,34,34,34,34,34,34,34,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,34,34,34,34,34,34,34,34,34,34,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,76,34,34,34,34,34,34,34,34,34,34,34,71,71,71,71,71,71,71,71,71,71]

function startDemo(){
    console.log(xl2DemoData);
    btn_xl2.classList.remove("btn-primary");
    btn_xl2.classList.add("btn-secondary", "disabled");
    btn_Gcal.classList.remove("btn-secondary", "disabled");
    btn_Gcal.classList.add("btn-primary");
    in_GroupCode.readOnly = false;
    handleAnleitung("s3");
}

function continueDemo(){
    xl2Tonspur = xl2DemoData;
    prepareXL2Data();
    sendReferenceData();
}

function showNotfall(){
    btn_notfalls_demo1.classList.remove("visually-hidden")
    btn_notfalls_demo2.classList.remove("visually-hidden")
}