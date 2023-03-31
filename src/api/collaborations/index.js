const routes = require('./routes');
const CollaborationsHandler = require('./handler');

const pluginsCollaborations = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationsService,
    playlistsService,
    usersService,
    validator,
  }) => {
    const collaborationHandler = new CollaborationsHandler(
        collaborationsService,
        playlistsService,
        usersService,
        validator,
    );
    server.route(routes(collaborationHandler));
  },
};

module.exports = pluginsCollaborations;