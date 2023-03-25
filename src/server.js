require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs/index');
const albums = require('./api/albums/index');
const SongsService = require('./services/postgres/SongsServices');
const AlbumServices = require('./services/postgres/AlbumServices');
const SongsValidator = require('./validator/songs');
const AlbumsValidator = require('./validator/albums');

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
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
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();