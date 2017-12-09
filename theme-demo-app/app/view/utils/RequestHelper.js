/**
 * Created by abara on 09.12.2017.
 */
Ext.define('ThemeDemoApp.view.utils.RequestHelper', {
    singleton: true,
    alternateClassName: 'RequestHelper',

    getBaseUrl: function() {
        return 'http://localhost:3000/';
    }
});