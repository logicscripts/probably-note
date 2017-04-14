//
//  Probably Note
//  Created by Attila Enhardt on 2017-04-14
// 	Copyright codecave STHLM / LogicScripts 2017.
//

PluginParameters = [];
let scriptName = new Parameter(null, "Probably Note by codecave STHLM")
let prob = new Parameter(null, "Transpose probability", "lin", "prop", null, 0, 100, 0, 100, " %");
let semiTones = new Parameter(null, "Transpose semitones", "lin", null, null, -12, 12, 0, 24, " st.");
let noteLookUp = [];
for (let i = 0; i < 128; i++) {
    noteLookUp.push(i);
}

function HandleMIDI(e) {
    if (e instanceof NoteOn) {
        treatNoteOn(e);
    }
    if (e instanceof NoteOff) {
        treatNoteOff(e);
    }
    e.send();
}

function treatNoteOn(e) {
    let p = Math.floor(Math.random() * 101);
    if (p <= GetParameter("Transpose probability")) {
        let originalPitch = e.pitch;
        e.pitch += GetParameter("Transpose semitones");
        noteLookUp[originalPitch] = e.pitch;
    }
}

function treatNoteOff(e) {
    let originalPitch = e.pitch;
    e.pitch = noteLookUp[e.pitch];
    noteLookUp[originalPitch] = originalPitch;
}



function Parameter(cb, n, t, pc, vs, miv, mav, def, nos, unit) {
    let vsl = vs ? vs.length : null;
    this.callBack = cb || function(v) {
        this.currentValue = v;
    };
    this.name = n;
    this.type = t || "text";
    this.pc = pc || null;
    this.valueStrings = vs || null;
    if (t != "checkbox") {
        this.minValue = miv || 0;
        this.maxValue = mav || 0;
    }
    this.defaultValue = def || Math.floor(vsl / 2) || 0;
    this.numberOfSteps = nos || vsl || null;
    this.unit = unit || null;
    this.pc = pc || null;
    this.currentValue = 0;
    this._index = PluginParameters.length;
    this.remove = function() {
        PluginParameters.splice(this._index, 1);
    };
    PluginParameters.push(this);
}