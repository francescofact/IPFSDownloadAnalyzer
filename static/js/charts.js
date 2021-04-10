
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