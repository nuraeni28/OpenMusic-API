const dotenv = require('dotenv');
dotenv.config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Albums plugin
const albums = require('./api/albums/index');
const AlbumsService = require('./services/postgres/AlbumServices');
const AlbumsValidator = require('./validator/albums/index');

// Songs plugin
const songs = require('./api/songs/index');
const SongsService = require('./services/postgres/SongsServices');
const SongsValidator = require('./validator/songs/index');

// Users plugin
const users = require('./api/users/index');
const UsersService = require('./services/postgres/UsersServices');
const UsersValidator = require('./validator/users/index');

// Authentication plugin
const authentications = require('./api/authentications/index');
const AuthenticationsValidator = require('./validator/authentications/index');
const AuthenticationsService
  = require('./services/postgres/AuthenticationsServices');
const TokenManager = require('./tokenize/TokenManager');

// Playlists plugin
const playlists = require('./api/playlists/index');
const PlaylistsValidator = require('./validator/playlists/index');
const PlaylistsService = require('./services/postgres/PlaylistsServices');

// Collaborations plugin
const collaborations = require('./api/collaborations/index');
const CollaborationsValidator = require('./validator/collaborations/index');
const CollaborationsService
  = require('./services/postgres/CollaborationsServices');

// Exports
const _exports = require('./api/exports/index');
const ProducerService = require('./services/rabbitmq/ProducerServices');
const ExportsValidator = require('./validator/exports/index');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // External plugins registration
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Definition of JWT authentication
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exportsService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();