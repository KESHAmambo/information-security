/**
 * Created by abara on 01.12.2017.
 */
Ext.define('ThemeDemoApp.view.widget.decryptedpanel.ViewTextWidgetColumn', {
    extend: 'Ext.grid.column.Widget',
    xtype: 'view-text-widgetcolumn',

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
            width: 35
        },
        items: [
            {
                xtype: 'button',
                iconCls: 'fa fa-file-text',
                ui: 'transparent',
                tooltip: 'View text',
                handler: function(button) {
                    //TODO: open window with decrypted text
                }
            }
        ]
    }
});