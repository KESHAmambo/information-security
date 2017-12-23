/**
 * Created by abara on 16.12.2017.
 */
Ext.define('ThemeDemoApp.view.widget.textviewwindow.TextViewWindow', {
    extend: 'Ext.window.Window',
    xtype: 'text-view-window',

    componentCls: 's-compose-window',
    renderTo: Ext.getBody(),
    constrain: true,
    floating: true,
    resizable: false,
    draggable: false,
    modal: true,
    hidden: false,
    frame: false,
    border: false,
    header: false,
    shadow: false,
    height: '100%',
    width: '100%',
    layout: 'fit',

    config: {
        textId: undefined,
        title: undefined
    },

    initComponent: function() {
        var me = this;

        me.items = [
            {
                xtype: 'panel',
                cls: 's-compose-window-main-panel',
                margin: '75 44 128',
                bodyPadding: '16 16 11',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'top'
                },
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'title',
                        fieldLabel: 'Title',
                        labelAlign: 'top',
                        value: me.title
                    },
                    {
                        xtype: 'htmleditor',
                        enableFont: false,
                        margin: '0 0 16 0',
                        flex: 1
                    }
                ]
            }
        ];

        me.callParent(arguments);
    },

    listeners: {
        afterrender: function(view) {
            var htmleditor = view.down('htmleditor');
            htmleditor.setLoading(true);
            Ext.Ajax.request({
                url: RequestHelper.getBaseUrl() + 'api/decryptedText',
                method: 'GET',
                params: {
                    textId: view.textId
                },
                success: function(response) {
                    var responseText = JSON.parse(response.responseText);

                    htmleditor.setValue(responseText.text);
                    htmleditor.setLoading(false);
                },
                failure: function (response) {
                    htmleditor.setLoading(false);
                    var toast;
                    if(response.status === 403) {

                        toast= new Ext.window.Toast({
                            html: 'Invalid key was submitted buy someone of holders!',
                            title: 'Error',
                            userCls: 's-error-toast',
                            align: 'tr'
                        });
                    } else {
                        toast= new Ext.window.Toast({
                            html: 'Error trying to load decrypted text!',
                            title: 'Error',
                            userCls: 's-error-toast',
                            align: 'tr'
                        });
                        console.log('server-side failure with status code ' + response.status);
                    }
                    toast.show();
                }
            });
        }
    }
});