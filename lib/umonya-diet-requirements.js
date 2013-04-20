var vumigo = require("vumigo_v01");
var jed = require("jed");

if (typeof api === "undefined") {
    // testing hook (supplies api when it is not passed in by the real sandbox)
    var api = this.api = new vumigo.dummy_api.DummyApi();
}

var Promise = vumigo.promise.Promise;
var success = vumigo.promise.success;
var Choice = vumigo.states.Choice;
var ChoiceState = vumigo.states.ChoiceState;
var FreeText = vumigo.states.FreeText;
var EndState = vumigo.states.EndState;
var InteractionMachine = vumigo.state_machine.InteractionMachine;
var StateCreator = vumigo.state_machine.StateCreator;

function UmonyaDietRequirements() {
    var self = this;
    StateCreator.call(self, 'select_requirement');

    // this will turn into a state creator when I can access their current requirements and determine whether they are registered
    self.add_state(new ChoiceState(
        'select_requirement',
        'enter_allergy',
        "Hi there! What type of food do you want?",
        [new Choice("halaal", "Halaal"), new Choice("kosher", "Kosher"), new Choice("vegetarian", "Vegetarian"), new Choice("none", "None of the above")]
    ));

    self.add_state(new FreeText(
        'enter_allergy',
        'end_message',
        "Do you have any allergies? Enter them here, or enter 'none' if you don't have allergies."
    ));

    self.add_state(new EndState(
        'end_message',
        'Thanks! We have saved your answers. Dial this number again if you want to change them.',
        'select_requirement'
    ));

}

// launch app
var states = new UmonyaDietRequirements();
var im = new InteractionMachine(api, states);
im.attach();