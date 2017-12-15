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
        var viewModel = me.getViewModel();

        var createdStore = me.createdStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: RequestHelper.getBaseUrl() + 'api/createdTexts',
                reader: {
                    type: 'json'
                }
            },
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
                            text: 'Decryption Date',
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

        me.on({
            updateData: me.loadStore
        });

        me.callParent(arguments);
    },

    loadStore: function() {
        this.createdStore.getProxy().setExtraParams({
            userId: this.getViewModel().get('userId')
        });
        this.createdStore.load();
    }
});