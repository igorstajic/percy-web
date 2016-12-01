import setupAcceptance, { setupSession } from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';
import moment from 'moment';

describe('Acceptance: Build', function() {
  freezeMoment('2018-05-22');
  setupAcceptance();

  setupSession(function (server) {
    let organization = server.create('organization', 'withUser');
    let project = server.create('project', {name: 'with builds', organization});
    let build = server.create('build', {project, createdAt: moment().subtract(2, 'minutes') });
    server.create('comparison', {build});
    this.comparison = server.create('comparison', 'wasAdded', {build});
    server.create('comparison', 'wasRemoved', {build});
    server.create('comparison', 'same', {build});
    this.project = project;
    this.build = build;
  });

  it('shows the build page', function() {
    visit(`/${this.project.fullSlug}`);
    andThen(() => {
      expect(currentPath()).to.equal('organization.project.index');
    });

    click('.BuildState');
    andThen(() => {
      expect(currentPath()).to.equal('organization.project.builds.build');
    });
    percySnapshot(this.test);

    click('.ComparisonModePicker button')
    percySnapshot(this.test.fullTitle() + ' | Overview');
  });

  it('jumps to comparsion for query params', function() {
    visit(`/${this.project.fullSlug}/builds/${this.build.id}?comparison=${this.comparison.id}`);
    andThen(() => {
      expect(currentPath()).to.equal('organization.project.builds.build');
      expect(
        find('.ComparisonViewer.ComparisonViewer--focus .ComparisonViewer-title a').text()
      ).to.equal(this.comparison.headSnapshot.name);
      expect('')
    });

    percySnapshot(this.test.fullTitle());
  });
});
