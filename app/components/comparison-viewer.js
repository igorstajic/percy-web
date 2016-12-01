import Ember from 'ember';

export default Ember.Component.extend({
  comparison: null,

  // The selected column mode of the comparison list.
  // So that comparison viewers can know if they are inside a n-column layout.
  selectedNumColumns: 1,
  isFullWidthOnlyMode: Ember.computed.equal('selectedNumColumns', 1),
  isMultiColumnMode: Ember.computed.gt('selectedNumColumns', 1),

  showNoDiffSnapshot: false,
  isOverlayEnabled: true,
  isDefaultExpanded: true,
  isTogglingFullWidth: false,
  isToggledFullWidth: false,
  isFocus: false,
  isExpanded: Ember.computed('isDefaultExpanded', function() {
    // TODO: this is just to break the binding with isDefaultExpanded,
    // fix this when migrating to later ember versions with default one-way bindings.
    return this.get('isDefaultExpanded');
  }),
  isNotExpanded: Ember.computed.not('isExpanded'),
  isActionable: Ember.computed.or('isNotExpanded', 'isMultiColumnMode'),

  comparisonUrl: Ember.computed(function() {
    return this.getComparisonUrl();
  }),

  classNames: ['ComparisonViewer'],
  classNameBindings: [
    'isFocus:ComparisonViewer--focus',
    'isExpanded::ComparisonViewer--collapsed',
    'isActionable:ComparisonViewer--actionable',
    'isToggledFullWidth:ComparisonViewer--fullWidth',
  ],
  attributeBindings: ['style'],
  style: Ember.computed('isTogglingFullWidth', function() {
    // Prevent the width animation from happening on toggle-full-screen actions.
    if (this.get('isTogglingFullWidth')) {
      return 'transition-property: none;';
    }
  }),

  // When switching to full-width mode, reset the full-width toggled state. This doesn't do anything
  // now, but prevents viewers from staying full-width if the user switches back to overview mode.
  resetToggledFullWidth: Ember.observer('isFullWidthOnlyMode', function() {
    if (this.get('isFullWidthOnlyMode')) {
      this.set('isToggledFullWidth', false);
    }
  }),

  setup: Ember.on('didInsertElement', function() {
    this.send('registerChild', this);
  }),
  teardown: Ember.on('willDestroyElement', function() {
    this.send('unregisterChild', this);
  }),
  click() {
    if (this.get('isNotExpanded')) {
      this.set('isExpanded', true);
    } else {
      this.send('toggleFullWidth');
    }
  },
  actions: {
    clickOnTitle() { /* nothing to do propagetes to normal click evnet handler */ },
    registerChild() {
      this.get('registerChild')(this);
    },
    unregisterChild() {
      this.get('unregisterChild')(this);
    },
    scrollToMe() {
      this.get('scrollTo')(this);
    },
    toggleOverlay() {
      this.toggleProperty('isOverlayEnabled');
    },
    toggleNoDiffResource() {
      this.toggleProperty('showNoDiffSnapshot');
    },
    toggleFullWidth() {
      if (this.get('isFullWidthOnlyMode')) {
        return;
      }
      this.set('isTogglingFullWidth', true);
      this.toggleProperty('isToggledFullWidth');
      this.set('showNoDiffSnapshot', true);
      Ember.run.next(() => {
        this.set('isTogglingFullWidth', false);
        this.send('scrollToMe');
      });
    },
  },
});
