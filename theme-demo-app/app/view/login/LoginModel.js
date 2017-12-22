/**
 * Created by abara on 01.12.2017.
 */
Ext.define('ThemeDemoApp.view.login.LoginModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.login',

    data: {
        signInUsername: 'kesha',
        signInPassword: '12345',
        signUpUsername: undefined,
        signUpPassword: undefined,
        signUpPasswordConfirm: undefined
    }
});