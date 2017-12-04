var config = {
    port : 27015,
    mongoose : {
        uri : 'mongodb://localhost',
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