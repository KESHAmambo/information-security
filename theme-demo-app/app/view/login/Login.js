/**
 * Created by abara on 01.12.2017.
 */
Ext.define('ThemeDemoApp.view.login.Login', {
    extend: 'Ext.container.Viewport',
    xtype: 'login',

    requires: [
        'ThemeDemoApp.view.login.LoginModel',
		'ThemeDemoApp.view.login.LoginController'
    ],

    viewModel: {
        type: 'login'
    },
    controller: 'login',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    items: [
        {
            xtype: 'panel',
            cls: 's-login',
            region: 'center',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'top'
            },
            defaults: {
                height: 400,
                width: 400
            },
            items: [
                {
                    xtype: 'panel',
                    bbar: {
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                cls: 's-sing-in-btn',
                                text: 'Sing In'
                            }
                        ]
                    }
                },
                {
                    xtype: 'panel',
                    bbar: {
                        items: [
                            '->',
                            {
                                xtype: 'button',
                                cls: 's-sing-up-btn',
                                text: 'Sing Up'
                            }
                        ]
                    }
                }
            ]
        }
    ]});