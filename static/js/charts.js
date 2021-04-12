
//map
let map = AmCharts.makeChart("mapdiv",{
    type: "map",
    theme: "light",
    projection: "mercator",
    dragMap: false,
    zoomOnDoubleClick: false,
    zoomControl: {
        zoomControlEnabled: false,
        homeButtonEnabled: false
    },
    dataProvider : {
        map : "worldHigh",
        getAreasFromMap : true,
        areas : []
    },
    areasSettings : {
        color : "#B4B4B7",
        colorSolid : "#B4B4B7",
        selectedColor : "#84ADE9",
        outlineColor : "#666666",
        rollOverColor : "#B4B4B7",
        rollOverOutlineColor : "#000000"
    }
});

//download chart
let progresschart = Highcharts.chart('downloadchart', {
    chart: {
        type: 'area'
    },
    title: {
        text:""
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        labels: {
            overflow: 'justify'
        },
        dateTimeLabelFormats: {
          minute: '%H:%M:%S',
          day: '%H:%M:%S',
        }
    },
    yAxis: {
        max: 100,
        labels: {
            formatter: function () {
                return this.value + "%";
            }
        }
    },
    tooltip: {
        pointFormat: 'The download was at <b>{point.y} %</b> after {point.x:%H:%M:%S}'
    },
    plotOptions: {
        area: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{
        showInLegend: false,
        data: [

        ]
    }]
});

//download pie chart
let piechart = Highcharts.chart('myPieChart', {
    chart: {
        type: 'pie'
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{point.y}: <b>{point.percentage:.1f}%</b>'
    },
    series: [{
        name: 'Peers',
        data: []
    }]
});

let speeddown = Highcharts.chart('speeddown', {
    chart: {
        type: 'solidgauge'
    },
    title:{
        text:"Download Speed"
    },
    pane: {
        center: ['50%', '60%'],
        startAngle: -120,
        endAngle: 120,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    exporting: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    // the value axis
    yAxis: {
        min: 0,
        max: 5 * 1024 * 1024,
        stops: [
            [1, '#60e7a9']
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
            y: 16
        }
    },
    credits: {
        enabled: false
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    },
    series: [{
        name: 'Speed',
        data: [{y: 0, name: 'B/s', converted: 0}],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{point.converted}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">{point.name}</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' {point.name}'
        }
    }]
})

let speedup = Highcharts.chart('speedup', {
    chart: {
        type: 'solidgauge'
    },
    title:{
        text:"Upload Speed"
    },
    pane: {
        center: ['50%', '60%'],
        startAngle: -120,
        endAngle: 120,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    exporting: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    // the value axis
    yAxis: {
        min: 0,
        max: 5 * 1024 * 1024,
        stops: [
            [1, '#60e7a9']
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
            y: 16
        }
    },
    credits: {
        enabled: false
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    },
    series: [{
        name: 'Speed',
        data: [{y: 0, name: 'B/s', converted: 0}],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{point.converted}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">{point.name}</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' {point.name}'
        }
    }]
})

