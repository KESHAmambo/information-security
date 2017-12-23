/**
 * Created by abara on 01.12.2017.
 */
Ext.define('ThemeDemoApp.view.widget.encryptedpanel.EncryptDecryptWidgetColumn', {
    extend: 'Ext.grid.column.Widget',
    xtype: 'encrypt-decrypt-widgetcolumn',

    widget: {
        xtype: 'container',
        viewModel: {
            type: 'default'
        },
        height: 40,
        layout: {
            type: 'hbox',
            pack: 'center',
            align: 'center'
        },
        defaults: {
            hidden: true,
            width: 35,
            handler: function(button){
                var container = button.up();
                var viewModel = container.getViewModel();
                var record = viewModel.get('record');
                var isDecryptBtn = button.itemId === 'decryptBtn';
                var confirmedCount = record.get('confirmed');
                var textId = record.get('textId');
                var userId = viewModel.get('userId');
                var title = record.get('title');

                if(isDecryptBtn) {
                    Ext.create({
                        xtype: 'key-return-window',
                        textId: textId,
                        userId: userId,
                        title: title,
                        successCallback: function() {
                            confirmedCount++;
                            record.set('permission', true);
                            record.set('confirmed', confirmedCount);
                        }
                    });
                } else {
                    Ext.Ajax.request({
                        url: RequestHelper.getBaseUrl() + 'api/withdrawTextKey',
                        method: 'GET',
                        params: {
                            textId: textId,
                            userId: userId
                        },
                        success: function(response) {
                            var responseText = Ext.decode(response.responseText);
                            Ext.create({
                                xtype: 'text-clipboard-window',
                                userShare: responseText.share,
                                title: title
                            });
                            confirmedCount--;
                            record.set('permission', false);
                            record.set('confirmed', confirmedCount);
                        },
                        failure: function () {
                            var toast = new Ext.window.Toast({
                                html: 'Error trying to get private key for text!',
                                title: 'Error',
                                userCls: 's-error-toast',
                                align: 'tr'
                            });
                            toast.show();
                        }
                    });
                }
            }
        },
        items: [
            {
                xtype: 'button',
                itemId: 'encryptBtn',
                cls: 's-btn-orange',
                iconCls: 'fa fa-unlock-alt',
                ui: 'transparent',
                tooltip: 'Encrypt',
                bind: {
                    hidden: '{!record.permission}',
                    disabled: '{record.acceptance === 1}'
                }
            },
            {
                xtype: 'button',
                itemId: 'decryptBtn',
                cls: 's-btn-green',
                iconCls: 'fa fa-lock',
                ui: 'transparent',
                tooltip: 'Decrypt',
                bind: {
                    hidden: '{record.permission}',
                    disabled: '{record.acceptance === 1}'
                }
            }
        ]
    }
});