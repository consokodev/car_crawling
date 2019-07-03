/**
 * Created by tuonglv on 07/03/2017.
 */
$(document).ready(function(){
    $('input[name="toDate"]').datepicker(
        {
            showWeekNumbers: true,
            showDropdowns: true,
            autoclose: true,
            singleDatePicker: true,
            format: 'yyyy/mm/dd'
        });


    function cb(start, end) {
        $('#rangeDate span').html(start.format('YYYY MM, DD') + ' - ' + end.format('YYYY MM, DD'));
    }
    cb(moment().subtract(29, 'days'), moment());

    $('input[name="rangeDate"]').daterangepicker({
        alwaysShowCalendars:true,
        autoUpdateInput: false,
        locale: {
            format: 'YYYY/MM/DD',
            cancelLabel: 'Clear'
        },
        autoApply:true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    $('input[name="rangeDate"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'));
    });

    $('input[name="rangeDate"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }



    //$("#slGameSelection").select2();
});
