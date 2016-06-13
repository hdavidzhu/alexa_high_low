'use strict';


// IMPORTS =====================================================================

var AlexaSkill = require('libs/AlexaSkill');
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

  // Another other initialization logic goes here.
  session.attributes.answer = Math.round(Math.random() * 100);
}

HighLowBot.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  console.log("HighLowBot onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  response.ask("Guess a number between 0 and 100!");
}

/**
* Overridden to show that a subclass can override this function to teardown session state.
*/
HighLowBot.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log("HighLowBot onSessionEnded requestId: " + sessionEndedRequest.requestId
  + ", sessionId: " + session.sessionId);

  // Cleanup logic goes here.
};


// HANDLES =====================================================================

HighLowBot.prototype.intentHandlers = {
  "GetGuessIntent": function (intent, session, response) {
    handleNumberInput(session.attributes.answer, intent.slots.Number.value, response);
  },

  "AMAZON.HelpIntent": function (intent, session, response) {
    response.ask("You can tell HighLowBot a number and see if it is correct");
  },

  "AMAZON.StopIntent": function (intent, session, response) {
    response.handleStopRequest(response);
  },

  "AMAZON.CancelIntent": function (intent, session, response) {
    response.handleStopRequest(response);
  }
};

function handleNumberInput(answer, guess, response) {
  var speechOutput = "That is ";
  if (guess > answer) {
    speechOutput += "too high!";
    response.ask(speechOutput);
  } else if (guess < answer) {
    speechOutput += "too low!";
    response.ask(speechOutput);
  } else if (guess == answer) {
    speechOutput += "the answer! Thanks for playing.";
    response.tell(speechOutput);
  }
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
