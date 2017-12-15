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
        var viewModel = me.getViewModel();
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
                viewModel: {
                    type: 'default',
                    parent: viewModel
                },
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
                                margin: '0 0 0 17'
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
                        bind: {
                            html: '{currentDay}'
                        },
                        html: 'Friday,'
                    },
                    {
                        xtype: 'label',
                        cls: 's-date',
                        bind: {
                            html: '{currentDate}'
                        }
                    }
                ]
            },
            items: [
                {
                    xtype: 'panel',
                    itemId: 'menuPanel',
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
                        allowDepress: false,
                        updateCount: function() {
                            var button = this;
                            if(button.section) {
                                Ext.Ajax.request({
                                    url: RequestHelper.getBaseUrl() + 'api/textsCount',
                                    method: 'GET',
                                    params: {
                                        userId: viewModel.get('userId'),
                                        section: button.section
                                    },
                                    success: function(response) {
                                        var responseText = JSON.parse(response.responseText);
                                        var countEl = button.getEl().down('.s-items-count');
                                        var itemsEl = button.getEl().down('.s-items-text');
                                        countEl.setHtml('' + responseText.count);
                                        if(responseText.count === 1) {
                                            itemsEl.setHtml('ITEM');
                                        } else {
                                            itemsEl.setHtml('ITEMS');
                                        }
                                    },
                                    failure: function (response) {
                                        Ext.toast({
                                            html: 'Error trying to get ' + button.section + ' texts count!',
                                            title: 'Error',
                                            userCls: 's-error-toast',
                                            align: 'tr'
                                        });
                                        console.log('server-side failure with status code ' + response.status);
                                    }
                                });
                            }
                        },
                        listeners: {
                            click: function() {
                                this.updateCount();
                                cardLayout.setActiveItem(this.childPanelNumber);
                                var childPanel = cardLayout.getActiveItem();
                                childPanel.fireEvent('updateData');
                            },
                            afterrender: function(button) {
                                button.updateCount();
                            }
                        }
                    },
                    items: [
                        {
                            userCls: 's-decrypted-btn',
                            html: menuButtonWithItemsTpl.apply({
                                text: 'Decrypted',
                                iconCls: 'fa fa-unlock-alt',
                                count: '?'
                            }),
                            section: 'decrypted',
                            childPanelNumber: 0,
                            pressed: true,
                            afterRender: function() {
                                this.fireEvent('click');
                            }
                        },
                        {
                            userCls: 's-encrypted-btn',
                            html: menuButtonWithItemsTpl.apply({
                                text: 'Encrypted',
                                iconCls: 'fa fa-lock',
                                count: '?'
                            }),
                            section: 'encrypted',
                            childPanelNumber: 1
                        },
                        {
                            userCls: 's-created-btn',
                            html: menuButtonWithItemsTpl.apply({
                                text: 'Created',
                                iconCls: 'fa fa-pencil',
                                count: '?'
                            }),
                            section: 'created',
                            childPanelNumber: 2
                        },
                        {
                            userCls: 's-settings-btn',
                            html: menuButtonTpl.apply({
                                text: 'Settings',
                                iconCls: 'fa fa-cogs',
                                count: '?'
                            }),
                            childPanelNumber: 3
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

    listeners: {
        afterrender: function(view) {
            var viewModel = view.getViewModel();

            var composeCloseBtn = Ext.create({
                xtype: 'button',
                itemId: 'composeCloseBtn',
                cls: 's-compose-btn s-floating-bottom-btn',
                iconCls: 'fa fa-plus',
                floating: true,
                shadow: false,
                renderTo: Ext.getBody(),
                listeners:{
                    click: function(button) {
                        if(view.composeWindow) {
                            view.composeWindow.destroy();
                            delete view.composeWindow;
                        } else if (view.textViewWindow) {
                            view.textViewWindow.destroy();
                            delete view.textViewWindow;
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
                shadow: false,
                hidden: true,
                renderTo: Ext.getBody(),
                handler: function(button) {
                    var titleField = view.composeWindow.down('textfield[itemId="title"]');
                    var htmlEditor = view.composeWindow.down('htmleditor');
                    var tagfield = view.composeWindow.down('tagfield');
                    var title = titleField.getValue();
                    var text = htmlEditor.getValue();
                    var holders = tagfield.getValue();
                    if(Ext.isEmpty(title)) {
                        Ext.toast('Title is Empty!', undefined, 'tr');
                    } else if(Ext.isEmpty(text)) {
                        Ext.toast('Text is Empty!', undefined, 'tr');
                    } else if(Ext.isEmpty(holders)) {
                        Ext.toast('No holders added!', undefined, 'tr');
                    } else {
                        encryptBtn.addCls('s-encrypt-btn-loading');
                        Ext.Ajax.request({
                            url: RequestHelper.getBaseUrl() + 'api/saveText',
                            method: 'POST',
                            jsonData: {
                                creatorId: viewModel.get('userId'),
                                title: title,
                                text: text,
                                holders: holders
                            },
                            success: function() {
                                encryptBtn.removeCls('s-encrypt-btn-loading');

                                view.down('created-panel').fireEvent('updateData');
                                view.down('encrypted-panel').fireEvent('updateData');
                                view.down('panel[itemId="menuPanel"]').query('button').forEach(function(item) {
                                    item.updateCount();
                                });

                                Ext.toast({
                                    html: 'Text was successfully encrypted',
                                    title: 'Success',
                                    userCls: 's-success-toast',
                                    align: 'tr'
                                });
                                composeCloseBtn.fireEvent('click', composeCloseBtn);
                            },
                            failure: function (response) {
                                encryptBtn.removeCls('s-encrypt-btn-loading');
                                composeCloseBtn.fireEvent('click', composeCloseBtn);
                                Ext.toast({
                                    html: 'Error trying to encrypt and store text!',
                                    title: 'Error',
                                    userCls: 's-error-toast',
                                    align: 'tr'
                                });
                                console.log('server-side failure with status code ' + response.status);
                            }
                        });
                    }
                }
            });
        }
    }
});
