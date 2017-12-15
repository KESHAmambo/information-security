/**
 * Created by abara on 29.11.2017.
 */
Ext.define('ThemeDemoApp.view.widget.encryptedpanel.EncryptedPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'encrypted-panel',

    componentCls: 'encrypted-panel',

    layout: 'fit',
    initComponent: function() {
        var me = this;

        var encryptedStore = me.encryptedStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: RequestHelper.getBaseUrl() + 'api/encryptedTexts',
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
            ],
            // data: [
            //     {title: 'Passport data', creator: 'Lisa', creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 1, keepers: 9, permission: true},
            //     {title: 'Passport data', creator: 'Bart', creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 5, keepers: 9, permission: false},
            //     {title: 'Passport data', creator: 'Homer', creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 3, keepers: 9, permission: false},
            //     {title: 'Passport data', creator: 'Marge', creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 8, keepers: 9, permission: true},
            //     {title: 'Passport data', creator: 'Maggy', creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 5, keepers: 9, permission: true}
            // ]
        });
        me.items = [
            {
                xtype: 'grid',
                store: encryptedStore,
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
                            text: 'Confirmation',
                            xtype: 'widgetcolumn',
                            width: 120,
                            dataIndex: 'acceptance',
                            widget: {
                                xtype: 'progressbarwidget',
                                bind: {
                                    text: '{record.confirmed + " / " + record.keepers}'
                                }
                            },
                            flex: 1
                        },
                        {
                            text: 'Action',
                            xtype: 'encrypt-decrypt-widgetcolumn',
                            width: 66
                        }
                    ]
                },
                getMaskTarget: function() {
                    return this.getEl().down('.x-grid-header-ct');
                }
            }
        ];

        me.callParent(arguments);
    },

    listeners: {
        activate: function(view) {
            view.encryptedStore.getProxy().setExtraParams({
                userId: view.getViewModel().get('userId')
            });
            view.encryptedStore.load();
        }
    }
});