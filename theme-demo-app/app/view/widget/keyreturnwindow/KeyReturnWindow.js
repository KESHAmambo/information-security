/**
 * Created by abara on 22.12.2017.
 */
Ext.define('ThemeDemoApp.view.widget.keyreturnwindow.KeyReturnWindow', {
    extend: 'Ext.window.Window',
    xtype: 'key-return-window',

    viewModel: {
        type: 'default'
    },

    config: {
        textId: undefined,
        userId: undefined,
        successCallback: undefined
    },
    renderTo: Ext.getBody(),
    floating: true,
    resizable: false,
    draggable: true,
    modal: false,
    hidden: false,
    frame: false,
    shadow: false,
    border: false,
    closable: true,
    bodyPadding: '16',
    width: 300,

    initComponent: function() {
        var me = this;
        var viewModel = me.getViewModel();

        var keyTextfield = me.keyTextfield = Ext.create({
            xtype: 'textfield',
            width: '100%',
            labelAlign: 'top',
            fieldLabel: 'Enter your private key',
            bind: {
                value: '{keyTextfieldValue}'
            }
        });
        me.items = [
            keyTextfield
        ];
        me.bbar = {
            items: [
                {
                    text: 'Send',
                    disabled: true,
                    bind: {
                        disabled: '{keyTextfieldValue === ""}'
                    },
                    handler: function(button) {
                        var userTextKey = keyTextfield.getValue();
                        if(Ext.isEmpty(userTextKey)) {
                            var toast = new Ext.window.Toast({
                                html: 'Private key for the text must not be empty!',
                                title: 'Invalid input',
                                userCls: 's-error-toast',
                                align: 'tr'
                            });
                            toast.show();
                            return;
                        }
                        Ext.Ajax.request({
                            url: RequestHelper.getBaseUrl() + 'api/returnTextKey',
                            method: 'POST',
                            jsonData: {
                                textId: me.getTextId(),
                                userId: me.getUserId(),
                                share: userTextKey
                            },
                            success: function(response) {
                                var toast = new Ext.window.Toast({
                                    html: 'Permission on decryption was successfully grunted',
                                    title: 'Success',
                                    userCls: 's-success-toast',
                                    align: 'tr'
                                });
                                toast.show();

                                me.getSuccessCallback()();
                                keyTextfield.setValue('');
                                me.destroy();
                            },
                            failure: function () {
                                var toast = new Ext.window.Toast({
                                    html: 'Error trying to post private key for text!',
                                    title: 'Error',
                                    userCls: 's-error-toast',
                                    align: 'tr'
                                });
                                toast.show();
                            }
                        });
                    }
                }
            ]
        };

        me.callParent(arguments);
    },

    listeners: {
        close: function(view) {
            view.keyTextfield.setValue('');
        }
    }
});