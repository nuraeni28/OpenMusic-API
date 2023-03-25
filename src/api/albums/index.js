const AlbumsHandler= require('./handler');
const routes = require('./routes');

const pluginAlbums = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const albumHandler = new AlbumsHandler(service, validator);
    server.route(routes(albumHandler));
  },
};

module.exports = pluginAlbums;