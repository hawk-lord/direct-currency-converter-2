/*
 *
 * Event function from SOLID Javascript
 * http://aspiringcraftsman.com/series/solid-javascript/
 *
 */

"use strict";

// destructuring
const {grep} = require("./grep");

const Event = function(name) {
    this._handlers = [];
    this.name = name;
};
Event.prototype.addHandler = function(handler) {
    this._handlers.push(handler);
};
Event.prototype.removeHandler = function(handler) {
    for (var i = 0; i < this._handlers.length; i++) {
        if (this._handlers[i] == handler) {
            this._handlers.splice(i, 1);
            break;
        }
    }
};
Event.prototype.fire = function(eventArgs) {
    this._handlers.forEach(function(h) {
        h(eventArgs);
    });
};
const eventAggregator = (function() {
    const events = [];
    const getEvent = function(eventName) {
        return grep(events, function(event) {
            return event.name === eventName;
        })[0];
    };
    return {
        publish: function(eventName, eventArgs) {
            var event = getEvent(eventName);
            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.fire(eventArgs);
        },
        subscribe: function(eventName, handler) {
            var event = getEvent(eventName);
            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.addHandler(handler);
        }
    };
})();

exports.publish = eventAggregator.publish;

exports.subscribe = eventAggregator.subscribe;