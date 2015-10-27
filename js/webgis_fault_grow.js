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


function CalcUnitLevelByScore(unit, score, score_accmu)
{
    var ret = '正常';
    if(unit === 'unit_1' || unit === 'unit_4')
    {
        if(score_accmu < 14)
        {
            ret = '正常';
        }
        if(score <= 10)
        {
            ret = '正常';
        }
        if(score_accmu >= 14 )
        {
            ret = '注意';
        }
        if(score >= 12 && score <= 24)
        {
            ret = '注意';
        }
        if(score >= 30 && score <= 32)
        {
            ret = '异常';
        }
        if(score === 40)
        {
            ret = '严重';
        }
    }
    if(unit === 'unit_2' || unit === 'unit_6' || unit === 'unit_8')
    {
        if(score <= 10)
        {
            ret = '正常';
        }
        if(score >= 12 && score <= 24)
        {
            ret = '注意';
        }
        if(score >= 30 && score <= 32)
        {
            ret = '异常';
        }
        if(score === 40)
        {
            ret = '严重';
        }

    }
    if(unit === 'unit_3')
    {
        if(score_accmu < 16)
        {
            ret = '正常';
        }
        if(score <= 10)
        {
            ret = '正常';
        }
        if(score_accmu >= 16 )
        {
            ret = '注意';
        }
        if(score >= 12 && score <= 24)
        {
            ret = '注意';
        }
        if(score >= 30 && score <= 32)
        {
            ret = '异常';
        }
        if(score === 40)
        {
            ret = '严重';
        }

    }
    if(unit === 'unit_5' || unit === 'unit_7')
    {
        if(score_accmu < 24)
        {
            ret = '正常';
        }
        if(score <= 10)
        {
            ret = '正常';
        }
        if(score_accmu >= 24 )
        {
            ret = '注意';
        }
        if(score >= 12 && score <= 24)
        {
            ret = '注意';
        }
        if(score >= 30 && score <= 32)
        {
            ret = '异常';
        }
        if(score === 40)
        {
            ret = '严重';
        }
    }
    return ret;
}
function CalcUnitProbability()
{
    var get_percom = function(number){
        var cp = Combinatorics.permutationCombination(_.range(0, number));
        cp = cp.toArray();
        var exists = [];
        var check_is_in = function(item){
            var ret = true;
            var item1 = $.extend(true, [], item);
            item1.sort();
            var key = item1.join('');
            //console.log(key);
            if(_.indexOf(exists, key) === -1){
                exists.push(key);
                ret = false;
            }
            return ret;
        };
        cp = _.filter(cp, function(item){
            if(item.length === 1){
                return true;
            }else if(item.length > 1 && item.length < number){
                return !check_is_in(item);
            }else{
                return false;
            }
        });
        return cp;
    };
    var calc_p = function(unit){
        var alist = _.map(unit.children, function(n){
            return {idx: _.indexOf(unit.children, n), score: n.total_score, category: n.name};
        });
        var alist1 = _.map(alist, function(n){
            return n.idx;
        });
        var grouped = _.groupBy(alist, function(n){
            return n.category;
        });
        //console.log(grouped);
        alist1 = _.map(_.values(grouped), function(n){
            return _.map(n, function(nn){
                return nn.idx;
            });
        });
        //console.log(alist1.length);
        var allcon = get_percom(alist1.length);
        var cond = [];
        _.forEach(allcon, function(n){
            var l = _.map(n, function(nn){
                return alist1[nn];
            });
            //console.log(l);
            var cp = Combinatorics.cartesianProduct.apply(this, l);
            cp = cp.toArray();
            cond = _.uniq(_.union(cond, cp));
        });
        var cp = Combinatorics.cartesianProduct.apply(this, alist1);
        cp = cp.toArray();
        cond = _.uniq(_.union(cond, cp));
        var total_cnt = {};
        var total_score = {};
        var happen_cnt = {};
        _.forEach(unit.children, function(child){
            var idx = _.indexOf(unit.children, child);
            total_cnt[idx + ''] = 0;
            happen_cnt[idx + ''] = {I:0, II:0, III:0, IV:0};

            _.forEach(cond, function(cpitem){
                if(_.indexOf(cpitem, idx) > -1)
                {
                    total_cnt[idx + ''] += 1;
                    total_score[idx + ''] = 0;
                    _.forEach(cpitem, function(item){
                        total_score[idx + ''] += _.result(_.find(alist, {idx:item}), 'score');
                    });
                    if(unit.unit === 'unit_1' || unit.unit === 'unit_4')
                    {
                        if(cpitem.length > 1 && total_score[idx + '']<14){
                            happen_cnt[idx + ''].I += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] <= 10){
                            happen_cnt[idx + ''].I += 1;
                        }
                        //if(cpitem.length > 1 && total_score[idx + ''] >= 14){
                        //    happen_cnt[idx + ''].II += 1;
                        //}
                        if(cpitem.length === 1 && total_score[idx + ''] >= 12 && total_score[idx + ''] <= 24){
                            happen_cnt[idx + ''].II += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] >= 30 && total_score[idx + ''] <= 32){
                            happen_cnt[idx + ''].III += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] === 40){
                            happen_cnt[idx + ''].IV += 1;
                        }
                    }
                    else if(unit.unit === 'unit_2' || unit.unit === 'unit_6' || unit.unit === 'unit_8')
                    {
                        if(cpitem.length === 1 && total_score[idx + ''] <= 10){
                            happen_cnt[idx + ''].I += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] >= 12 && total_score[idx + ''] <= 24){
                            happen_cnt[idx + ''].II += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] >= 30 && total_score[idx + ''] <= 32){
                            happen_cnt[idx + ''].III += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] === 40){
                            happen_cnt[idx + ''].IV += 1;
                        }
                    }
                    else if(unit.unit === 'unit_3')
                    {
                        if(cpitem.length > 1 && total_score[idx + '']<16){
                            happen_cnt[idx + ''].I += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] <= 10){
                            happen_cnt[idx + ''].I += 1;
                        }
                        //if(cpitem.length > 1 && total_score[idx + ''] >= 16){
                        //    happen_cnt[idx + ''].II += 1;
                        //}
                        if(cpitem.length === 1 && total_score[idx + ''] >= 12 && total_score[idx + ''] <= 24){
                            happen_cnt[idx + ''].II += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] >= 30 && total_score[idx + ''] <= 32){
                            happen_cnt[idx + ''].III += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] === 40){
                            happen_cnt[idx + ''].IV += 1;
                        }
                    }
                    else if(unit.unit === 'unit_5' || unit.unit === 'unit_7')
                    {
                        if(cpitem.length > 1 && total_score[idx + '']<24){
                            happen_cnt[idx + ''].I += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] <= 10){
                            happen_cnt[idx + ''].I += 1;
                        }
                        //if(cpitem.length > 1 && total_score[idx + ''] >= 24){
                        //    happen_cnt[idx + ''].II += 1;
                        //}
                        if(cpitem.length === 1 && total_score[idx + ''] >= 12 && total_score[idx + ''] <= 24){
                            happen_cnt[idx + ''].II += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] >= 30 && total_score[idx + ''] <= 32){
                            happen_cnt[idx + ''].III += 1;
                        }
                        if(cpitem.length === 1 && total_score[idx + ''] === 40){
                            happen_cnt[idx + ''].IV += 1;
                        }
                    }

                }
            });
            //console.log(unit.unit+ ' ' +idx + ':{'
            //    + 'I:' + happen_cnt[idx + ''].I/total_cnt[idx + '']
            //    + ',II:' + happen_cnt[idx + ''].II/total_cnt[idx + '']
            //    + ',III:' + happen_cnt[idx + ''].III/total_cnt[idx + '']
            //    + ',IV:' + happen_cnt[idx + ''].IV/total_cnt[idx + '']
            //    + '}'
            //);
            unit.children[idx].p0.I = happen_cnt[idx + ''].I/total_cnt[idx + ''];
            unit.children[idx].p0.II = happen_cnt[idx + ''].II/total_cnt[idx + ''];
            unit.children[idx].p0.III = happen_cnt[idx + ''].III/total_cnt[idx + ''];
            unit.children[idx].p0.IV = happen_cnt[idx + ''].IV/total_cnt[idx + ''];

        });
        return unit;
    };
    _.forEach($.webgis.data.bbn.unitsub_template_2009, function(unit){
        var idx = _.indexOf($.webgis.data.bbn.unitsub_template_2009, unit);
        $.webgis.data.bbn.unitsub_template_2009[idx] = calc_p(unit);
    });
    console.log(JSON.stringify($.webgis.data.bbn.unitsub_template_2009));
}

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
                if(item[filtername] === item1 ){
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

