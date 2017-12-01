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

    flex: 1,
    renderTo: Ext.getBody(),
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    initComponent: function() {
        var me = this;

        me.items = [
            {
                xtype: 'panel',
                cls: 's-login-panel',
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
                        cls: 's-sign-in-panel',
                        bbar: {
                            padding: '0 9 16 0',
                            defaults: {
                                width: 220,
                                height: 40
                            },
                            items: [
                                '->',
                                {
                                    xtype: 'button',
                                    cls: 's-sign-in-btn',
                                    text: 'Sing In',
                                    handler: function(button) {
                                        //TODO: authorizatize
                                        // var mainContainer = Ext.ComponentQuery.query('main-container')[0];
                                        me.destroy();
                                        Ext.create({
                                            xtype: 'app-main'
                                        });
                                    }
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'panel',
                        cls: 's-sign-up-panel',
                        bbar: {
                            padding: '0 9 16 0',
                            defaults: {
                                width: 220,
                                height: 40
                            },
                            items: [
                                '->',
                                {
                                    xtype: 'button',
                                    cls: 's-sign-up-btn',
                                    text: 'Sing Up',
                                    handler: function(button) {
                                        //TODO: registration

                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    }
});