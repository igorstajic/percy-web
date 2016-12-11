import Ember from 'ember';

export default Ember.Helper.helper(function([image, /*...rest*/]) {
  return image.get('height')*100.0/image.get('width');
});
