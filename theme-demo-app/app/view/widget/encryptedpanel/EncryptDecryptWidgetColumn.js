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
                var confirmed = record.get('confirmed');
                confirmed += (isDecryptBtn ? 1 : -1);
                record.set('permission', isDecryptBtn);
                record.set('confirmed', confirmed);

                //TODO: send post request
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
                    hidden: '{!record.permission}'
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
                    hidden: '{record.permission}'
                }
            }
        ]
    }
});