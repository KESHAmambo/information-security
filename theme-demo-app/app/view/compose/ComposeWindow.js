/**
 * Created by abara on 02.12.2017.
 */
Ext.define('ThemeDemoApp.view.compose.ComposeWindow', {
    extend: 'Ext.window.Window',
    xtype: 'compose-window',

    requires: [
        'ThemeDemoApp.view.compose.ComposeWindowModel',
		'ThemeDemoApp.view.compose.ComposeWindowController'
    ],

    viewModel: {
        type: 'compose-window'
    },
    controller: 'compose-window',

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

    initComponent: function() {
        var me = this;

        var holdersField = me.holdersField = Ext.create({
            xtype: 'tagfield',
            fieldLabel: 'Holders',
            labelAlign: 'top',
            queryMode: 'local',
            displayField: 'username',
            valueField: 'id',
            listConfig: {
                shadow: false,
                alwaysOnTop: true
            },
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: RequestHelper.getBaseUrl() + 'api/users',
                    reader: {
                        type: 'json'
                    }
                },
                fields: ['id', 'username']
            })
        });

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
                        labelAlign: 'top'
                    },
                    {
                        xtype: 'htmleditor',
                        enableFont: false,
                        margin: '0 0 16 0',
                        flex: 1
                    },
                    holdersField
                ]
            }
        ];

        me.callParent(arguments);
    },

    listeners: {
        afterrender: function(view) {
            view.holdersField.getStore().load();
        }
    }
});