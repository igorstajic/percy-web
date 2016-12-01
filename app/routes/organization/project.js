import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    let organizationSlug = this.modelFor('organization').get('slug');
    return this.store.findRecord('project', `${organizationSlug}/${params.project_id}`);
  },
});
