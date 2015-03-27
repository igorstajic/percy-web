import DS from 'ember-data';

export default DS.Model.extend({
  build: DS.belongsTo('build'),
  baseResource: DS.belongsTo('resource'),
  otherResource: DS.belongsTo('resource'),
  pdiff: DS.belongsTo('pdiff'),
  state: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});