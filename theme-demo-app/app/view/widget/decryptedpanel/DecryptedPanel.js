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

        var decryptedStore = Ext.create('Ext.data.Store', {
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
            ],
            data: [
                {title: 'Passport data', creator: 'Lisa', creationDate: '2011/04/22', decryptionDate: '2011/04/22', confirmed: 1, keepers: 9, permission: true},
                {title: 'Passport data', creator: 'Bart', creationDate: '2011/04/22', decryptionDate: '2011/04/22', confirmed: 5, keepers: 9, permission: false},
                {title: 'Passport data', creator: 'Homer', creationDate: '2011/04/22', decryptionDate: '2011/04/22', confirmed: 3, keepers: 9, permission: true},
                {title: 'Passport data', creator: 'Marge', creationDate: '2011/04/22', decryptionDate: '2011/04/22', confirmed: 8, keepers: 9, permission: true},
                {title: 'Passport data', creator: 'Maggy', creationDate: '2011/04/22', decryptionDate: '2011/04/22', confirmed: 5, keepers: 9, permission: true}
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

        me.callParent(arguments);
    }
});