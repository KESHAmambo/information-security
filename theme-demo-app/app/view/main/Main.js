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

    renderTo: Ext.getBody(),
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

        var cardPanel = me.cardPanel = Ext.create({
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
                    xtype: 'settings-panel',
                    bodyPadding: '66 16 9',
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
        var cardLayout = me.cardLayout = cardPanel.getLayout();

        var mainPanel = me.mainPanel = Ext.create({
            xtype: 'panel',
            itemId: 'mainPanel',
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
                        width: 220,
                        height: 50,
                        margin: '0 16 16 0',
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
                        {
                            userCls: 's-settings-btn',
                            html: menuButtonTpl.apply({
                                text: 'Settings',
                                iconCls: 'fa fa-cogs',
                                count: 10
                            }),
                            handler: function(button) {
                                cardLayout.setActiveItem(3);
                            }
                        }
                    ]
                },
                cardPanel
            ]
        });

        me.items = [
            mainPanel
        ];

        me.callParent(arguments);
    },

    // setCardLayoutActiveItem: function(itemNumber, expandPanel) {
    //     var me = this;
    //     if(!expandPanel) {
    //         var cardPanelHeight = me.mainPanel.getHeight() - 80;
    //         var cardPanelWidth = me.mainPanel.getWidth() - 236;
    //         me.cardPanel.animate({
    //             to: {
    //                 height: cardPanelHeight,
    //                 width: cardPanelWidth
    //             }
    //         });
    //     } else {
    //         me.cardPanel.animate({
    //             to: {
    //                 height: 400,
    //                 width: 300
    //             }
    //         });
    //     }
    //     var activePanel = me.cardLayout.setActiveItem(itemNumber);
    // },

    listeners: {
        afterrender: function(view) {
            var composeCloseBtn = Ext.create({
                xtype: 'button',
                itemId: 'composeBtn',
                cls: 's-compose-btn s-floating-bottom-btn',
                iconCls: 'fa fa-plus',
                floating: true,
                alwaysOnTop: true,
                shadow: false,
                renderTo: Ext.getBody(),
                listeners:{
                    click: function(button) {
                        if(view.composeWindow) {
                            view.composeWindow.destroy();
                            delete view.composeWindow;
                        } else {
                            view.composeWindow = Ext.create({
                                xtype: 'compose-window'
                            });
                        }
                        encryptBtn.setHidden(!view.composeWindow);
                        button.toggleCls('s-close-window-btn');
                    }
                }
            });
            var encryptBtn = Ext.create({
                xtype: 'button',
                itemId: 'encryptBtn',
                cls: 's-encrypt-btn s-floating-bottom-btn',
                text: 'Encrypt',
                floating: true,
                alwaysOnTop: true,
                shadow: false,
                hidden: true,
                renderTo: Ext.getBody(),
                handler: function(button) {
                    //TODO: send create request and fire click event on close composeCloseButton
                }
            });
        }
    }
});
