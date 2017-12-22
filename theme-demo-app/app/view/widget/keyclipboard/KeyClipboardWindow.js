/**
 * Created by abara on 22.12.2017.
 */
Ext.define('ThemeDemoApp.view.widget.keyclipboard.KeyClipboardWindow', {
    extend: 'Ext.window.Window',
    xtype: 'text-clipboard-window',

    config: {
        userShare: undefined
    },
    renderTo: Ext.getBody(),
    floating: true,
    resizable: false,
    draggable: true,
    modal: false,
    hidden: false,
    frame: false,
    border: false,
    closable: true,
    shadow: false,
    bodyPadding: '16',
    width: 500,

    initComponent: function() {
        var me = this;

        me.html =
            'You have been assigned as text holder, click to ' +
            '<b>Copy to clipboard</b> button and backup it as well as text title.<br><br>' +
            '<b>No one, even you, can access the text without this key!</b>';
        me.bbar = {
            items: [
                {
                    text: 'Copy to Clipboard',
                    handler: function(button) {
                        ClipboardHelper.copy(me.getUserShare());
                    }
                },
                {
                    text: 'OK',
                    handler: function(button) {
                        button.up('window').destroy();
                    }
                }
            ]
        };

        me.callParent(arguments);
    }
});