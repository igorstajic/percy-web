export default function() {
  // Don't block internal ember-percy requests.
  this.passthrough('/_percy/**');

  this.get('/api/v1/namespaces', function(schema) {
    return schema.db.namespaces[0];
  });
  this.get('/api/v1/repos', function(schema, request) {
    if (request.queryParams['filter[namespace]'] === 'test-user') {
      return schema.db.filteredRepos[0];
    }
  });
}
