import Ember from 'ember';

export default Ember.Component.extend({
  selectedWidths: null,
  selectedNumColumns: null,
  comparisons: null,
  comparisonComponents: null,
  activeComparison: null,
  updateActiveComparison: null,

  selectedComparisonIndex: -1,
  lastComparisonIndex: null,

  scrollToComponentAfterRender: null,

  isDefaultExpanded: Ember.computed('comparisons', function() {
    return this.get('comparisons.length') < 150;
  }),

  sortedComparisons: Ember.computed.sort('comparisons', 'comparisonSortProperties'),
  comparisonSortProperties: ['isDifferent:desc', 'pdiff.diffPercentageFull:desc'],

  classNames: ['ComparisonList'],
  classNameBindings: ['comparisonListMode'],
  comparisonListMode: Ember.computed('selectedNumColumns', function() {
    return 'ComparisonList--' + this.get('selectedNumColumns') + 'col';
  }),
  setupKeyHandlers: Ember.on('didInsertElement', function() {
    Ember.$(document).bind('keydown.comparisons', function(e) {
      if (e.keyCode === 39) {  // right arrow
        this.send('nextComparison');
      } else if (e.keyCode === 37) {  // left arrow
        this.send('previousComparison');
      }
    }.bind(this));
  }),
  destroyKeyHandlers: Ember.on('willDestroyElement', function() {
    Ember.$(document).unbind('keydown.comparisons');
  }),
  scrollToSelected: Ember.on('didRender', function() {
    // Wait for the views changes to render, then calculate the right scroll position.
    let component = this.get('scrollToComponentAfterRender');
    if (component) {
      this.set('scrollToComponentAfterRender', null);
      window.scrollTo(0, component.$().offset().top - 210);
    }
  }),
  actions: {
    comparisonUrl(comparison) {
      return `?comparison=${comparison.id}`;
    },
    registerChild(component) {
      if (!this.get('comparisonComponents')) {
        this.set('comparisonComponents', Ember.ArrayProxy.create({content: Ember.A()}));
      }
      this.get('comparisonComponents').pushObject(component);
      if (this.get('activeComparison')) {
        let index = this.get('comparisonComponents.length') - 1;
        if (this.get('activeComparison') == this.get('sortedComparisons').objectAt(index).get('id')) {
          var lastIndex = this.get('selectedComparisonIndex');
          this.set('lastComparisonIndex', lastIndex);
          this.set('selectedComparisonIndex', index);
          this.send('updateSelectedComparison');
        }
      }
    },
    unregisterChild(component) {
      // Assume all components are being destroyed and we should reset the selection. TODO: improve.
      this.set('selectedComparisonIndex', 0);
      this.get('comparisonComponents').removeObject(component);
    },
    scrollToChild(component) {
      this.set('scrollToComponentAfterRender', component);
    },
    nextComparison() {
      var index = this.get('selectedComparisonIndex');
      this.set('lastComparisonIndex', index);

      if (index === this.get('comparisons.length') - 1) {
        // Wrap around to beginning.
        this.set('selectedComparisonIndex', 0);
      } else {
        this.set('selectedComparisonIndex', index + 1);
      }
      this.send('updateSelectedComparison');
    },
    previousComparison() {
      var index = this.get('selectedComparisonIndex');
      this.set('lastComparisonIndex', index);

      if (index <= 0) {
        // Wrap around to end.
        this.set('selectedComparisonIndex', this.get('comparisons.length') - 1);
      } else {
        this.set('selectedComparisonIndex', index - 1);
      }
      this.send('updateSelectedComparison');
    },
    updateSelectedComparison() {
      var comparisonComponents = this.get('comparisonComponents');
      var selectedIndex = this.get('selectedComparisonIndex');
      var selectedComponent = comparisonComponents.objectAt(selectedIndex);
      var lastIndex = this.get('lastComparisonIndex');

      this.get('updateActiveComparison')(selectedComponent.get('comparison.id'))

      // Expand the selected component.
      selectedComponent.set('isExpanded', true);
      selectedComponent.set('showNoDiffSnapshot', true);
      selectedComponent.set('isFocus', true);

      // Grab the last component, if it exists.
      if (lastIndex !== -1) {
        var lastComponent = comparisonComponents.objectAt(lastIndex);
        lastComponent.set('isExpanded', this.get('isDefaultExpanded'));
        lastComponent.set('isFocus', false);
      }

      this.set('scrollToComponentAfterRender', selectedComponent);
    },
  }
});
