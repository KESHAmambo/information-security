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
    items: [
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
                    xtype: 'htmleditor',
                    enableFont: false,
                    margin: '0 0 16 0',
                    flex: 1
                },
                {
                    xtype: 'tagfield',
                    // width: '100%',
                    fieldLabel: 'Holders',
                    labelAlign: 'top',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'abbr',
                    listConfig: {
                        shadow: false,
                        alwaysOnTop: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: ['abbr', 'name'],
                        data : [
                            {"abbr":"AL", "name":"Alabama"},
                            {"abbr":"AK", "name":"Alaska"},
                            {"abbr":"AZ", "name":"Arizona"},
                            {"abbr":"AL", "name":"Alabama"},
                            {"abbr":"AK", "name":"Alaska"},
                            {"abbr":"AZ", "name":"Arizona"},
                            {"abbr":"AL", "name":"Alabama"},
                            {"abbr":"AK", "name":"Alaska"},
                            {"abbr":"AZ", "name":"Arizona"},
                            {"abbr":"AL", "name":"Alabama"},
                            {"abbr":"AK", "name":"Alaska"},
                            {"abbr":"AZ", "name":"Arizona"},
                            {"abbr":"AL", "name":"Alabama"},
                            {"abbr":"AK", "name":"Alaska"},
                            {"abbr":"AZ", "name":"Arizona"},
                            {"abbr":"AL", "name":"Alabama"},
                            {"abbr":"AK", "name":"Alaska"},
                            {"abbr":"AZ", "name":"Arizona"}
                        ]
                    })
                }
            ]
        }
    ]
});