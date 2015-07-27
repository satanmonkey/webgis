/**
 * Created by satan on 2014/8/8.
 */
;(function ($) {
    //jQuery.getScript("javascripts/highcharts.js", function(data, status, jqxhr) {
        //jQuery('body').append('<script src="javascripts/highcharts.js"></script>')
        Highcharts.setOptions({
            lang: {
                months: ['一月', '二月', '三月', '四月', '五月', '六月',  '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths:['1', '2', '3', '4', '5', '6',  '7', '8', '9', '10', '11', '12'],
                weekdays: ['周日','周一', '周二', '周三', '周四', '周五', '周六'],
                noDate:'没有数据',
                loading:'加载中...'
            }
        });


        var container
        jQuery.fn.extend({
            drawChart:function(imei,view,beginTime,endTime,minSpeed,maxSpeed,token){
                container=this;
                var url="/proxy/api/statistics/linechart/"+imei+"/"+view+"/"+beginTime+"/"+endTime+"/"+minSpeed+"/"+maxSpeed+"?token="+token;
                if(!token){
                    url="/proxy/api/statistics/linechart/"+imei+"/"+view+"/"+beginTime+"/"+endTime+"/"+minSpeed+"/"+maxSpeed;
                }
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(result){
                        if(result.success){
                            switch(view){
                                case "Y":
                                    draw_year(result.series)
                                    break
                                case "M":
                                    draw_month(result.series)
                                    break
                                case "D":
                                    draw_day(result.series)
                                    break
                            }
                        }
                    },
                    error:function(obj,err){
                        console.log(err);
                    }
                });
            },
            drawChartWithJson:function(chartType,json){
                container=this;
                switch (chartType){
                    case "device":
                        draw_device(json.data);
                        break
                    case "weather":
                        draw_weather(json.data);
                        break
                    case "line":
                        draw_line(json.data);
                        break
                    case "tower":
                        draw_tower(json.data);
                        break
                }
            }
        });
    function draw_tower(data){
        container.empty();
        var x=[],y=[];
        for(i in data){
            var e=data[i];
            x.push(e.towerName);
            y.push(e.count);
        }
        container.highcharts({
            chart: {
                type: 'column',
                backgroundColor:""
            },
            legend:{
                itemStyle:{color:"#ffffff"}
            },
            title: {
                text: '鸟类活动情况(按杆塔统计)',
                style:{color:"#ffffff"}
            },
            xAxis: {
                type:'category',
                categories:x,
                title:{
                    text:"线路",
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff",
                labels:{
                    style:{color:"#ffffff"}
                }
            },
            yAxis: {
                title:{
                    text:"次数",
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff",
                labels:{
                    style:{color:"#ffffff"}
                }
            },
            series: [{
                type:"column",
                name: '鸟类活动',
                data: y
            }]
        });
    }
    function draw_line(data){
        container.empty();
        var x=[],y=[];
        for(i in data){
            var e=data[i];
            x.push(e.lineName);
            y.push(e.count);
        }
        container.highcharts({
            chart: {
                type: 'column',
                backgroundColor:""
            },
            title: {
                text: '鸟类活动情况(按线路统计)',
                style:{color:"#ffffff"}
            },
            legend:{
                itemStyle:{color:"#ffffff"}
            },
            xAxis: {
                type:'category',
                categories:x,
                title:{
                    text:"线路",
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff",
                labels:{
                    style:{color:"#ffffff"}
                }
            },
            yAxis: {
                title:{
                    text:"次数",
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff",
                labels:{
                    style:{color:"#ffffff"}
                }
            },
            series: [{
                type:"column",
                name: '鸟类活动',
                data: y
            }]
        });
    }
    function draw_weather(data){
        container.empty();
        var x=[],y=[];
        for(i in data){
            var e=data[i];
            x.push(e.weather);
            y.push(e.count);
        }
        container.highcharts({
            chart: {
                type: 'column',
                backgroundColor:""
            },
            legend:{
                itemStyle:{color:"#ffffff"}
            },
            title: {
                text: '鸟类活动情况(按天气统计)',
                style:{color:"#ffffff"}
            },
            xAxis: {
                type:'category',
                categories:x,
                title:{
                    text:"天气",
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff",
                labels:{
                    style:{color:"#ffffff"}
                }
            },
            yAxis: {
                title:{
                    text:"次数",
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff",
                labels:{
                    style:{color:"#ffffff"}
                }
            },
            series: [{
                type:"column",
                name: '鸟类活动',
                data: y
            }]
        });
    }

        function draw_device(data){
            container.empty();
            var x=[],y=[];
            for(i in data){
                var e=data[i];
               x.push(e.towerName);
                y.push(e.count);
            }
            container.highcharts({
                chart: {
                    type: 'column',
                    backgroundColor:""
                },
                legend:{
                    itemStyle:{color:"#ffffff"}
                },
                title: {
                    text: '鸟类活动情况(按设备统计)',
                    style:{color:"#ffffff"}
                },
                xAxis: {
                    type:'category',
                    categories:x,
                    lineColor:"#ffffff",
                    title: {
                        text:"设备",
                        style: {color: "#ffffff"}
                    },
                    labels:{
                        style:{color:"#ffffff"}
                    }
                },
                yAxis: {
                    title:{
                        text:"次数",
                        style:{color:"#ffffff"}
                    },
                    lineColor:"#ffffff",
                    labels:{
                        style:{color:"#ffffff"}
                    }
                },
                series: [{
                    type:"column",
                    name: '鸟类活动',
                    data: y
                }]
            });
        }
        function draw_year(data){//年统计
            container.empty();
            container.highcharts({
                chart: {
                    type: 'spline',
                    backgroundColor:""
                },
                legend:{
                    itemStyle:{color:"#ffffff"}
                },
                title: {
                    text: '年度活动情况',
                    style:{color:"#ffffff"}
                },
                xAxis: {
                    lineColor:"#ffffff",
                    title:{
                        style:{color:"#ffffff"}
                    },
                    labels:{
                        style:{color:"#ffffff"}
                    }

                },
                yAxis: {
                    lineColor:"#ffffff",
                    title:{
                        style:{color:"#ffffff"}
                    },
                    labels:{
                        style:{color:"#ffffff"}
                    }
                },
                series: [{
                    name: '鸟类活动',
                    data: data
                }]
            });
        };
        function draw_month(data){
            container.empty();
            var x=new Array(),y=new Array();
            for(i in data){
                var e=data[i];
                x.push(e.x);
                y.push(e.y);
            }
            container.highcharts({
                chart: {
                    type: 'spline',
                    //zoomType:'x',
                    backgroundColor:""
                },
                legend:{
                    itemStyle:{color:"#ffffff"}
                },
                title: {
                    text: '月度活动情况',
                    style:{color:"#ffffff"}
                },
                xAxis: {
                    labels:{
                        //rotation:-90,
                        formatter: function () {
                           var value=this.value;
                           var year=value.substr(0,4);
                           var month=value.substr(4,2);
                           if(month=='01'){
                               return year;
                           }
                           else{
                               return month;
                           }
                        },
                        style:{color:"#ffffff"}
                    },
                    categories:x,
                    title: {
                        enabled: true,
                        text: '年月',
                        style:{color:"#ffffff"}
                    },
                    lineColor:"#ffffff"

                },
                yAxis: {
                    title: {
                        enabled: true,
                        text: '活动次数',
                        style:{color:"#ffffff"}
                    },
                    lineColor:"#ffffff",
                    labels:{
                        style:{color:"#ffffff"}
                    }
                },
                series: [{
                    name: '鸟类活动',
                    data: y
                }]
            });
        }
    function draw_day(data){
        container.empty();
        var x=new Array(),y=new Array();
        for(i in data){
            var e=data[i];
            x.push([Date.UTC(e.x.toString().substr(0,4),parseInt(e.x.toString().substr(4,2))-1,e.x.toString().substr(6,2)), e.y]);
            //console.log(e.x.toString().substr(0,4));
            //console.log(e.x.toString().substr(4,2));
            //console.log(e.x.toString().substr(6,2));
            //y.push(e.y);
        }
        container.highcharts({
            chart: {
                type: 'column',
                //zoomType:'x',
                backgroundColor:""
            },
            legend:{
                itemStyle:{color:"#ffffff"}
            },
            title: {
                text: '日活动情况',
                style:{color:"#ffffff"}
            },
            xAxis: {
                labels:{
                    format: '{value:%m/%d}',
                    style:{color:"#FFFFFF"}
                },
                type:'datetime',
                //categories:x,
                title: {
                    enabled: true,
                    text: '日期',
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff"
            },
            yAxis: {
                title: {
                    enabled: true,
                    text: '活动次数',
                    style:{color:"#ffffff"}
                },
                labels:{
                    style:{color:"#ffffff"}
                },
                lineColor:"#ffffff"

            },
            series: [{
                name: '鸟类活动',
                data:x
            }],
            tooltip:{
                xDateFormat:"%Y-%m-%d"
            }
        });
    }
    //});

})(jQuery);