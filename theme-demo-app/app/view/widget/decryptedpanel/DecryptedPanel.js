/**
 * Created by abara on 30.11.2017.
 */
Ext.define('ThemeDemoApp.view.widget.decryptedpanel.DecryptedPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'decrypted-panel',

    componentCls: 'decrypted-panel',

    layout: 'fit',
    initComponent: function() {
        var me = this;

        var decryptedStore = me.decryptedStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: RequestHelper.getBaseUrl() + 'api/decryptedTexts',
                reader: {
                    type: 'json'
                }
            },
            fields: [
                {
                    name: 'title'
                },
                {
                    name: 'creator'
                },
                {
                    name: 'creationDate'
                },
                {
                    name: 'decryptionDate'
                },
                {
                    name: 'confirmed'
                },
                {
                    name: 'keepers'
                },
                {
                    name: 'permission'
                },
                {
                    name: 'acceptance',
                    calculate: function(data) {
                        return data.confirmed / data.keepers;
                    }
                }
            ]
        });
        me.items = [
            {
                xtype: 'grid',
                store: decryptedStore,
                viewConfig: {
                    disableSelection: true
                },
                enableColumnHide : false,
                sortableColumns: false,
                emptyText: 'No items',
                columns: {
                    defaults: {
                        align: 'start'
                    },
                    items: [
                        {
                            text: 'Title',
                            dataIndex: 'title',
                            flex: 1.5
                        },
                        {
                            text: 'Creator',
                            dataIndex: 'creator',
                            flex: 1
                        },
                        {
                            text: 'Creation Date',
                            xtype: 'datecolumn',
                            format:'Y-m-d',
                            dataIndex: 'creationDate',
                            flex: 1
                        },
                        {
                            text: 'Decryption Date',
                            xtype: 'datecolumn',
                            format:'Y-m-d',
                            dataIndex: 'decryptionDate',
                            flex: 1
                        },
                        {
                            text: 'Action',
                            xtype: 'view-text-widgetcolumn',
                            width: 66
                        }
                    ]
                },
                getMaskTarget: function() {
                    return this.getEl().down('.x-grid-header-ct');
                }
            }
        ];

        me.on({
            updateData: me.loadStore
        });

        me.callParent(arguments);
    },

    loadStore: function() {
        this.decryptedStore.getProxy().setExtraParams({
            userId: this.getViewModel().get('userId')
        });
        this.decryptedStore.load();
    }
});