/**
 * Created by abara on 29.11.2017.
 */
Ext.define('ThemeDemoApp.view.widget.createdpanel.CreatedPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'created-panel',

    componentCls: 'created-panel',

    layout: 'fit',
    initComponent: function() {
        var me = this;

        var createdStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'title'
                },
                {
                    name: 'share'
                },
                {
                    name: 'creationDate'
                },
                {
                    name: 'decodingDate'
                },
                {
                    name: 'confirmed'
                },
                {
                    name: 'keepers'
                },
                {
                    name: 'acceptance',
                    calculate: function(data) {
                        return data.confirmed / data.keepers;
                    }
                }
            ],
            data: [
                {title: 'Passport data', share: true, creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 9, keepers: 9, permission: true},
                {title: 'Passport data', share: false, creationDate: '2011/04/22', decodingDate: '', confirmed: 5, keepers: 9, permission: false},
                {title: 'Passport data', share: false, creationDate: '2011/04/22', decodingDate: '', confirmed: 3, keepers: 9, permission: false},
                {title: 'Passport data', share: true, creationDate: '2011/04/22', decodingDate: '', confirmed: 8, keepers: 9, permission: true},
                {title: 'Passport data', share: true, creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 9, keepers: 9, permission: true},
                {title: 'Passport data', share: false, creationDate: '2011/04/22', decodingDate: '', confirmed: 3, keepers: 9, permission: false},
                {title: 'Passport data', share: false, creationDate: '2011/04/22', decodingDate: '', confirmed: 3, keepers: 9, permission: false},
                {title: 'Passport data', share: false, creationDate: '2011/04/22', decodingDate: '2011/04/22', confirmed: 9, keepers: 9, permission: false}
            ]
        });
        me.items = [
            {
                xtype: 'grid',
                store: createdStore,
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
                            text: 'Creation Date',
                            xtype: 'datecolumn',
                            format:'Y-m-d',
                            dataIndex: 'creationDate',
                            flex: 1
                        },
                        {
                            text: 'Share',
                            xtype: 'booleancolumn',
                            dataIndex: 'share',
                            renderer: function(value, metaData) {
                                metaData.tdCls = (value ? 's-share' : 's-no-share');
                                return '';
                            },
                            align: 'center',
                            width: 56
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
                            text: 'Decoding Date',
                            xtype: 'datecolumn',
                            format:'Y-m-d',
                            dataIndex: 'decodingDate',
                            flex: 1
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