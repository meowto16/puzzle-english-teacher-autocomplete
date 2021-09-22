// Adds .reverse() to jQuery
import * as $ from 'jquery'

$.fn.reverse = function() {
  return this.pushStack(this.get().reverse(), arguments);
};
