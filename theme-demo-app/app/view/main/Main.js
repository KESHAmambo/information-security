/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 */
Ext.define('ThemeDemoApp.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: 'fit',

    menuButtonWithItemsTpl: new Ext.XTemplate(
        '<div class="{iconCls}"></div>' +
        '<div class="s-btn-text">{text}</div>' +
        '<div class="s-items">' +
            '<div class="s-items-count">{count}</div>' +
            '<div class="s-items-text">ITEMS</div>' +
        '</div>'
    ),
    menuButtonTpl: new Ext.XTemplate(
        '<div class="{iconCls}"></div>' +
        '<div class="s-btn-text">{text}</div>'
    ),

    initComponent: function() {
        var me = this;
        var menuButtonTpl = me.menuButtonTpl;
        var menuButtonWithItemsTpl = me.menuButtonWithItemsTpl;

        var cardPanel = Ext.create({
            xtype: 'panel',
            cls: 's-main-card-panel',
            flex: 1,
            margin: '0 0 16 0',
            layout: {
                type: 'card',
                deferredRender: true
            },
            defaults: {
                margin: '0 0 0 5',
                bodyPadding: '16 16 16 11',
                listeners: {
                    activate: function(panel) {
                        cardPanel.getEl().dom.style.borderColor = panel.color;
                    }
                }
            },
            items: [
                {
                    xtype: 'decrypted-panel',
                    color: '#ffd435'
                },
                {
                    xtype: 'encrypted-panel',
                    color: '#26b774'
                },
                {
                    xtype: 'created-panel',
                    color: '#ec7c9d'
                },
                {
                    xtype: 'compose-panel',
                    color: '#643fac'
                },
                {
                    xtype: 'settings-panel',
                    color: '#d5a0d5'
                }
            ],
            listeners: {
                afterrender: function(panel) {
                    var activeItem = panel.getLayout().getActiveItem();
                    panel.getEl().dom.style.borderColor = activeItem.color;
                }
            }
        });
        var cardLayout = cardPanel.getLayout();

        me.items = [
            {
                xtype: 'panel',
                cls: 's-main-panel',
                margin: '0 80',
                layout: {
                    type: 'hbox',
                    align: 'stretch',
                    pack: 'top'
                },
                tbar: {
                    cls: 's-main-top-toolbar',
                    height: 64,
                    margin: '0 0 16 0',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'label',
                                    cls: 's-hello-label',
                                    html: 'HELLO,',
                                    margin: '0 0 0 16'
                                },
                                {
                                    xtype: 'label',
                                    cls: 's-username-label',
                                    margin: '0 0 0 16',
                                    bind: {
                                        html: '{username}'
                                    }
                                }
                            ]
                        },
                        '->',
                        {
                            xtype: 'label',
                            cls: 's-day',
                            html: 'Friday,'
                        },
                        {
                            xtype: 'label',
                            cls: 's-date',
                            html: '29 nov'
                        }
                    ]
                },
                items: [
                    {
                        xtype: 'panel',
                        cls: 's-menu-panel',
                        layout: {
                            type: 'vbox',
                            align: 'stretch',
                            pack: 'top'
                        },
                        defaults: {
                            xtype: 'button',
                            cls: 's-menu-button',
                            width: 250,
                            height: 50,
                            margin: '0 16 16',
                            toggleGroup: 'menu-buttons',
                            allowDepress: false
                        },
                        items: [
                            {
                                userCls: 's-decrypted-btn',
                                html: menuButtonWithItemsTpl.apply({
                                    text: 'Decrypted',
                                    iconCls: 'fa fa-unlock-alt',
                                    count: 10
                                }),
                                handler: function(button) {
                                    cardLayout.setActiveItem(0);
                                },
                                pressed: true
                            },
                            {
                                userCls: 's-encrypted-btn',
                                html: menuButtonWithItemsTpl.apply({
                                    text: 'Encrypted',
                                    iconCls: 'fa fa-lock',
                                    count: 10
                                }),
                                handler: function(button) {
                                    cardLayout.setActiveItem(1);
                                }
                            },
                            {
                                userCls: 's-created-btn',
                                html: menuButtonWithItemsTpl.apply({
                                    text: 'Created',
                                    iconCls: 'fa fa-pencil',
                                    count: 10
                                }),
                                handler: function(button) {
                                    cardLayout.setActiveItem(2);
                                }
                            },
                            /*{
                                userCls: 's-compose-btn',
                                html: menuButtonTpl.apply({
                                    text: 'Compose',
                                    iconCls: 'fa fa-plus',
                                    count: 10
                                }),
                                handler: function(button) {
                                    cardLayout.setActiveItem(3);
                                }
                            },*/
                            {
                                userCls: 's-settings-btn',
                                html: menuButtonTpl.apply({
                                    text: 'Settings',
                                    iconCls: 'fa fa-cogs',
                                    count: 10
                                }),
                                handler: function(button) {
                                    cardLayout.setActiveItem(4);
                                }
                            }
                        ]
                    },
                    cardPanel
                ]
            }
        ];

        me.callParent(arguments);
    },

    listeners: {
        afterrender: function(view) {
            var createCloseButton = Ext.create({
                xtype: 'button',
                cls: 's-compose-btn',
                iconCls: 'fa fa-plus',
                floating: true,
                shadow: false,
                renderTo: Ext.getBody()
            });
        }
    }
});
