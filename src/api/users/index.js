const UsersHandler = require('./handler');
const routes = require('./routes');


const pluginUsers = {
  name: 'users',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const userHandler = new UsersHandler(service, validator);
    server.route(routes(userHandler));
  },
};

module.exports =  pluginUsers;