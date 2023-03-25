const SongsHandler = require('./handler');
const routes = require('./routes');

const pluginSongs = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const songHandler = new SongsHandler(service, validator);
    server.route(routes(songHandler));
  },
};

module.exports =  pluginSongs;