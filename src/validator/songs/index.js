const InvariantError =require('../../exceptions/InvariantError');
const SongsPayloadScheme =require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports =  SongsValidator;
