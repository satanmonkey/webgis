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
        ret.check_year = record.check_year + 1;

    }
    return ret;
}

