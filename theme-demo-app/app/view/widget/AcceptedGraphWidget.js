/**
 * Created by abara on 30.11.2017.
 */
Ext.define('ThemeDemoApp.view.widget.AcceptedGraphWidget', {
    /*extend: 'Ext.panel.Panel',
    xtype: 'accepted-graph-widget',

    afterrender:*/
    extend: 'Ext.chart.PolarChart',
    xtype: 'accepted-graph-widget',

    height: 70,
    width: 70,
    store: {
        fields: ['confirm', 'count'],
        data: [{
            confirm: 'Confirmed',
            count: '5'
        }, {
            confirm: 'Not Confirmed',
            count: '9'
        }]
    },
    series: {
        type: 'pie',
        label: {
            field: 'confirm',
            display: 'none'
        },
        xField: 'count',
        donut: 45,
        radiusFactor: 80,
        colors: [
            '#643fac',
            '#efefef'
        ]
    }
});