'use strict';


// IMPORTS =====================================================================

var AlexaSkill = require('libs/alexa_skill');
var config = require('./config');


// CONFIG ======================================================================

var ALEXA_APP_ID = config.ALEXA_APP_ID;

var HighLowBot = function() {
  AlexaSkill.call(this, ALEXA_APP_ID);
};

// Extend AlexaSkill.
HighLowBot.prototype = Object.create(AlexaSkill.prototype);
HighLowBot.prototype.constructor = HighLowBot;


// LIFECYCLE ===================================================================

HighLowBot.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
  console.log("HighLowBot onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);

  // Generate random number.
  session.attributes.answer = Math.round(Math.random() * 100);
}

HighLowBot.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  console.log("HighLowBot onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  response.ask("Guess a number between 0 and 100!", "Say a number. For example, fourty two!");
}

HighLowBot.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log("HighLowBot onSessionEnded requestId: " + sessionEndedRequest.requestId
  + ", sessionId: " + session.sessionId);
};


// HANDLES =====================================================================

HighLowBot.prototype.intentHandlers = {
  "GetGuessIntent": function (intent, session, response) {
    if (intent.slots.Number.value) {
      handleNumberInput(session.attributes.answer, intent.slots.Number.value, response);
    } else {
      handleErrorInput(response);
    }
  },

  "AMAZON.HelpIntent": function (intent, session, response) {
    response.ask("You can tell HighLowBot a number and see if it is correct", "For example, say try fifty two");
  },

  "AMAZON.StopIntent": function (intent, session, response) {
    handleStopRequest(response);
  },

  "AMAZON.CancelIntent": function (intent, session, response) {
    handleStopRequest(response);
  }
};

function handleNumberInput(answer, guess, response) {
  var speechOutput = "That is ";
  if (guess > answer) {
    speechOutput += "too high!";
    response.ask(speechOutput, speechOutput);
  } else if (guess < answer) {
    speechOutput += "too low!";
    response.ask(speechOutput, speechOutput);
  } else if (guess == answer) {
    speechOutput += "the answer! Thanks for playing.";
    response.tell(speechOutput);
  }
}

function handleErrorInput(response) {
  response.ask("Sorry, I did not understand what you've said", "Sorry, try saying a number between zero and one hundred");
}

function handleStopRequest(response) {
  var speechOutput = "See ya!";
  response.tell(speechOutput);
}


// EXPORT ======================================================================

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the HighLowBot skill.
  var highLowBot = new HighLowBot();
  highLowBot.execute(event, context);
};
