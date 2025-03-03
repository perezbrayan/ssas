exports.up = function(knex) {
    // Esta migración ya se ejecutó anteriormente
    return Promise.resolve();
};

exports.down = function(knex) {
    // No hacemos nada en el down ya que esta es una migración histórica
    return Promise.resolve();
};
