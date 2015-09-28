if(_.isUndefined($.webgis))
{
    $.webgis = {};
}
if(_.isUndefined($.webgis.data))
{
    $.webgis.data = {};
}
if(_.isUndefined($.webgis.data.bbn))
{
    $.webgis.data.bbn = {};
}
$.webgis.data.bbn.grown_model = {};
$.webgis.data.bbn.grown_model.score_range = [
    {'level':'I', range: _.range(0, 10)},
    {'level':'II', range: _.range(10, 24)},
    {'level':'III', range: _.range(24, 30)},
    {'level':'IV', range: _.range(30, 41)},
];
$.webgis.data.bbn.unitsub_template_2009 = [];
//    {unit:'unit_1', children:[]}
//];

//$.webgis.data.bbn.grown_model.unit_fault_factor = [
//    {
//        unit:'unit_1',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_2',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_3',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_4',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_5',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_6',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_7',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//    {
//        unit:'unit_8',
//        factors:[
//            {'level':'I', factor:1.0},
//            {'level':'II', factor:2.0},
//            {'level':'III', factor:3.0},
//            {'level':'IV', factor:4.0},
//        ]
//    },
//];
function calc_next_year_probability(record)
{
    var ret;
    if(!_.isUndefined(record))
    {
        ret = $.extend(true, {}, record);
        ret._id = null;
        ret.check_year = record.check_year + 1;
        if(record.line_state === 'I'){
            ret.line_state = 'II';
        }
        if(record.line_state === 'II'){
            ret.line_state = 'III';
        }
        if(record.line_state === 'III'){
            ret.line_state = 'IV';
        }
        _.forEach(_.range(1, 9), function(i){
            if(record['unit_' + i] === 'I'){
                ret['unit_' + i] = 'II';
            }
            if(record['unit_' + i] === 'II'){
                ret['unit_' + i] = 'III';
            }
            if(record['unit_' + i] === 'III'){
                ret['unit_' + i] = 'IV';
            }
        });
    }
    return ret;
}
function calc_future_probability(alist, year_num)
{
    var list = $.extend(true, [], alist);
    var ret = {line_state:{'I':0.0, 'II':0.0, 'III':0.0, 'IV':0.0}};
    _.forEach(_.range(1, 9), function(i){
        ret['unit_' + i] = {'I':0.0, 'II':0.0, 'III':0.0, 'IV':0.0};
    });
    if(list.length)
    {
        if(year_num > 0)
        {
            _.forEach(_.range(1, year_num+1), function(i){
                var years = _.pluck(list, 'check_year');
                var latest_year = _.max(years);
                var latest = _.find(list, {check_year:latest_year});
                list.push(calc_next_year_probability(latest));
            });
        }
        var happen = {};
        happen.line_state = {'I':0,'II':0,'III':0,'IV':0};
        _.forEach(_.range(1, 9), function(i){
            happen['unit_' + i] = {'I':0,'II':0,'III':0,'IV':0};
        });
        var total_cnt = list.length;
        _.forEach(list, function(item){
            _.forEach(['I', 'II', 'III', 'IV'], function(item1){
                if(item.line_state === item1){
                    happen['line_state'][item1] += 1;
                }
                _.forEach(_.range(1, 9), function(i){
                    if(item['unit_' + i] === item1){
                        happen['unit_' + i][item1] += 1;
                    }
                });
            });
        });

        _.forEach(['I', 'II', 'III', 'IV'], function(item1){
            ret['line_state'][item1] = happen['line_state'][item1]/total_cnt;
            _.forEach(_.range(1, 9), function(i){
                ret['unit_' + i][item1] = happen['unit_' + i][item1]/total_cnt;
            });
        });
    }
    return ret;
}
function calc_future_probability_series(alist, year_num)
{
    var ret = [];
    var years = _.pluck(alist, 'check_year');
    var latest_year = _.max(years);
    var latest = _.find(alist, {check_year:latest_year});
    var ys = [];
    if(year_num>0)
    {
        ys = _.map(_.range(1, year_num+1), function(i){
            return latest_year + i;
        });
    }
    _.forEach(_.range(1, year_num+1), function(i){
        var o = {};
        o.check_year = latest_year + i;
        o.prob = calc_future_probability(alist, i);
        ret.push(o);
    });
    return ret;
}
function calc_past_probability(alist, filtername, year)
{
    var list = $.extend(true, [], alist);
    list = _.filter(list, function(n){
        return n.check_year <= year;
    });
    var ret = {};
    ret[filtername] = {'I':0.0, 'II':0.0, 'III':0.0, 'IV':0.0};
    if(list.length > 0)
    {
        var happen = {};
        happen[filtername] = {'I':0,'II':0,'III':0,'IV':0};
        var total_cnt = list.length;
        _.forEach(list, function(item){
            _.forEach(['I', 'II', 'III', 'IV'], function(item1){
                if(item[filtername] === item1){
                    happen[filtername][item1] += 1;
                }
            });
        });
        _.forEach(['I', 'II', 'III', 'IV'], function(item1){
            ret[filtername][item1] = happen[filtername][item1]/total_cnt;
        });
    }
    return ret;
}
function calc_past_probability_series(alist, filtername, year)
{
    var ret = [];
    var years = _.pluck(alist, 'check_year');
    //_.remove(years, function (n) {
    //    return n === year;
    //});
    _.forEach(years, function(y){
        var o = {};
        o.check_year = y;
        o.prob = calc_past_probability(alist, filtername, y);
        ret.push(o);
    });
    ret = _.sortBy(ret, function(n){
        return n.check_year;
    });
    return ret;
}


