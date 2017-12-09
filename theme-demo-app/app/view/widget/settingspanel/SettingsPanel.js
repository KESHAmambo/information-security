/**
 * Created by abara on 29.11.2017.
 */
Ext.define('ThemeDemoApp.view.widget.settingspanel.SettingsPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'settings-panel',

    componentCls: 's-settings-panel',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'start'
    },
    items: [
        {
            xtype: 'toolbar',
            vertical: true,
            flex: 1,
            defaults: {
                width: 220,
                height: 40
            },
            items: [
                '->',
                {
                    xtype: 'button',
                    cls: 's-plane-btn s-logout-btn',
                    text: 'Sign Out',
                    handler: function(button) {
                        var mainView = Ext.ComponentQuery.query('app-main')[0];
                        var composeCloseBtn = Ext.ComponentQuery.query('button[itemId="composeCloseBtn"]')[0];
                        mainView.destroy();
                        composeCloseBtn.destroy();
                        Ext.create({
                            xtype: 'login'
                        });
                    }
                }
            ]

        }
    ]
});