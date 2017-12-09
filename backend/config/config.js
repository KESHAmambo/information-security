var config = {
    port : 27015,
    mongoose : {
        uri : 'mongodb://localhost/crypta',
        options : {
            server : {
                socketOptions : {
                    keepAlive : 1
                }
            }
        }
    }
};


module.exports = config;