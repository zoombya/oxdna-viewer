let angle = 90;
function setRotAngle(textArea) {
    angle = parseInt(textArea.value);
}
function getRotObj(i) {
    let rotobj;
    if (scopeMode.includes("Nuc")) {
        rotobj = nucleotides[i].visual_object; //set rotobj to nucleotide's visual_object
    }
    else if (scopeMode.includes("Strand")) {
        let nuctemp = nucleotides[i];
        rotobj = systems[nuctemp.my_system].strands[nuctemp.my_strand - 1].strand_3objects; //set rotobj to current nuc's strand's strand_3objects
    }
    else if (scopeMode.includes("System")) {
        let nuctemp = nucleotides[i];
        rotobj = systems[nuctemp.my_system].system_3objects; //set rotobj to current nuc's system's system_3objects
    }
    return rotobj;
}
function rotate(dir) {
    var rot = false; //rotation success boolean
    for (let i = 0; i < selected_bases.length; i++) { //go through each nucleotide in all systems
        if (selected_bases[i] == 1) { //if nucleotide is selected
            let rotobj = getRotObj(i); //get object to rotate - nucleotide, strand, or system based on mode
            getAxisMode(); //get axis on which to rotate
            updatePos(nucleotides[i].my_system); //update class positions
            //rotate around user selected axis - default is X - and user entered angle - updated every time textarea is changed; default is 90
            if (axisMode == "X") {
                rotobj.rotateX(dir * angle * Math.PI / 180);
            }
            else if (axisMode == "Y") {
                rotobj.rotateY(dir * angle * Math.PI / 180);
            }
            else {
                rotobj.rotateZ(dir * angle * Math.PI / 180);
            }
            render();
            rot = true;
        }
        let tempnuc = nucleotides[i];
        if (rot) {
            if (scopeMode.includes("Strand")) {
                i += systems[tempnuc.my_system].strands[tempnuc.my_strand - 1].nucleotides.length - tempnuc.local_id - 1; //increment i to get to end of strand; subtract 1 because add 1 in loop automatically
            }
            else if (scopeMode.includes("System")) {
                let locsysID = (tempnuc.my_strand - 1) * systems[tempnuc.my_system].strands[tempnuc.my_strand - 1].nucleotides.length + tempnuc.local_id; //gets nucleotide id in relation to system
                i += systems[tempnuc.my_system].system_length() - locsysID - 1; //increment i to get to end of system; subtract 1 to undo automatic increment by for loop
            }
        }
    }
    if (!rot) { //if no object has been selected, rotation will not occur and error message displayed
        alert("Please select an object to rotate.");
    }
}
function getAxisMode() {
    var modeRadioButtons = document.forms['Axis'].elements['rotate']; //get radio buttons in form with id 'Axis' and radio buttons with name 'rotate'
    for (let i = 0, len = modeRadioButtons.length; i < len; i++) { //for each radio button
        if (modeRadioButtons[i].checked) { //if radio button is checked
            axisMode = modeRadioButtons[i].value; //set axisMode to radio button's value: X,Y, or Z
            break;
        }
    }
}