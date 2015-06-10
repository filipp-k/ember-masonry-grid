/* global imagesLoaded */
import Ember from 'ember';

var getOptions = function (keys) {
  var properties = this.getProperties(keys);

  Object.keys(properties).forEach(function (key) {
    if (properties[key] === "null") {
      properties[key] = null;
    }

    if (properties[key] === undefined) {
      delete properties[key];
    }
  });

  return properties;
};

export default Ember.Component.extend({
  classNames: ['masonry-grid'],

  options: null,
  items: null,

  masonryInitialized: false,

  initializeMasonry: Ember.on('didInsertElement', function () {
    this.set('options', getOptions.call(this, [
      'containerStyle',
      'columnWidth',
      'gutter',
      'hiddenStyle',
      'isFitWidth',
      'isInitLayout',
      'isOriginLeft',
      'isOriginTop',
      'isResizeBound',
      'itemSelector',
      'stamp',
      'transitionDuration',
      'visibleStyle'
    ]));

    this.layoutMasonry();
  }),

  events: [
    'transitionEnd',
    'layout',
    'layoutComplete',
    'remove',
    'removeComplete'
  ],
  eventListeners: [],

  layoutMasonry: Ember.observer('items.@each', function () {
    var _this = this;

    imagesLoaded(this.$(), function () {
      var options = _this.get('options');
      var isInitLayout = options.isInitLayout || true; // save set options or default value
      options.isInitLayout = false; // turn off initialization to set up event listeners
      
      if (_this.get('masonryInitialized')) {
        _this.eventListeners.map(function (obj) {
          _this.$().masonry('off', obj.name, obj.callback);
        });
        _this.eventListeners = [];
        _this.$().masonry('destroy');
      }
      // setup masonry without initialization
      _this.$().masonry(options);

      // setup event listeners
      _this.events.map(function (event) {
        var obj = {
          event: event,
          callback: function () {
            _this.$().trigger('masonry.' + event);
          }
        };
        _this.$().masonry('on', obj.event, obj.callback);
        _this.eventListeners.push(obj);
      });

      // initiate masonry if user wants it
      if (isInitLayout) {
        _this.$().masonry();
      }

      _this.set('masonryInitialized', true);
    });
  })
});
