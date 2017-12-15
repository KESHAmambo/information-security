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
        var viewModel = me.getViewModel();

        me.items = [
            {
                xtype: 'panel',
                viewModel: viewModel,
                cls: 's-login-panel',
                region: 'center',
                layout: {
                    type: 'hbox',
                    align: 'stretch',
                    pack: 'top'
                },
                defaults: {
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'top'
                    },
                    bodyPadding: 16,
                    defaults: {
                        margin: '0 0 16 0',
                        width: 300,
                        labelAlign: 'top'
                    }
                },
                items: [
                    {
                        xtype: 'panel',
                        cls: 's-sign-in-panel',
                        margin: '0 16 0 0',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Username',
                                bind: {
                                    value: '{signInUsername}'
                                }
                            },
                            {
                                xtype: 'textfield',
                                inputType: 'password',
                                fieldLabel: 'Password',
                                bind: {
                                    value: '{signInPassword}'
                                }
                            }
                        ],
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
                                        Ext.Ajax.request({
                                            method: 'GET',
                                            url: RequestHelper.getBaseUrl() + 'api/signin',
                                            params: {
                                                username: viewModel.get('signInUsername'),
                                                password: viewModel.get('signInPassword')
                                            },
                                            success: me.onSignSuccess.bind(me),
                                            failure: function(response) {
                                                Ext.toast({
                                                    html: 'Invalid credentials!',
                                                    title: 'Error',
                                                    userCls: 's-error-toast',
                                                    align: 'tr'
                                                });
                                                console.log('server-side failure with status code ' + response.status);
                                            }
                                        });
                                    }
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'panel',
                        cls: 's-sign-up-panel',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Username',
                                bind: {
                                    value: '{signUpUsername}'
                                }
                            },
                            {
                                xtype: 'textfield',
                                inputType: 'password',
                                fieldLabel: 'Password',
                                bind: {
                                    value: '{signUpPassword}'
                                }
                            },
                            {
                                xtype: 'textfield',
                                inputType: 'password',
                                fieldLabel: 'Confirm password',
                                bind: {
                                    value: '{signUpPasswordConfirm}'
                                }
                            }
                        ],
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
                                        var password = viewModel.get('signUpPassword');
                                        var passwordConfirm = viewModel.get('signUpPasswordConfirm');
                                        if(password === passwordConfirm) {
                                            Ext.Ajax.request({
                                                method: 'GET',
                                                url: RequestHelper.getBaseUrl() + 'api/signup',
                                                params: {
                                                    username: viewModel.get('signUpUsername'),
                                                    password: password
                                                },
                                                success: me.onSignSuccess.bind(me),
                                                failure: function(response) {
                                                    if(response.status === 409) {
                                                        Ext.toast({
                                                            html: 'User with this name already exists!',
                                                            title: 'Error',
                                                            userCls: 's-error-toast',
                                                            align: 'tr'
                                                        });
                                                    } else {
                                                        Ext.toast({
                                                            html: 'Server error!',
                                                            title: 'Error',
                                                            userCls: 's-error-toast',
                                                            align: 'tr'
                                                        });
                                                    }
                                                    console.log('server-side failure with status code ' + response.status);
                                                }
                                            });
                                        } else {
                                            Ext.toast('Passwords are not equal!', undefined, 'tr');
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    },

    onSignSuccess: function(response) {
        var responseText = Ext.decode(response.responseText);
        this.destroy();
        var mainView = Ext.create({
            xtype: 'app-main',
            listeners: {
                render: {
                    fn: function() {
                        var mainViewModel = this.getViewModel();
                        mainViewModel.set({
                            username: responseText.username,
                            userId: responseText.id
                        });
                    },
                    options: {single: true}
                }
            }
        });
    }
});