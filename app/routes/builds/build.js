import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('build', params.build_id);
  },
  afterModel(build) {
    // Reload the build and relationships in the background each time we transition to this route.
    // We do this because the user might be clicking around and the store cache might be out of
    // date, like when comparisons have finished processing.
    build.reload();
    if (!build.get('isExpired')) {
      build.get('comparisons').reload();
    }
  }
});
