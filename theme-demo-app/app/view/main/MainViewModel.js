/**
 * Created by abara on 29.11.2017.
 */
Ext.define('ThemeDemoApp.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    data: {
        username: undefined,
        userId: undefined
    },
    formulas: {
        currentDay: {
            single: true,
            get: function () {
                return Ext.Date.format(new Date(), 'l, ');
            }
        },
        currentDate: {
            single: true,
            get: function () {
                return Ext.Date.format(new Date(), 'd M');
            }
        }
    }
});