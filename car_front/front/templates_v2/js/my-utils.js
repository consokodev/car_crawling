if (typeof jQuery === "undefined") {
    throw new Error("MyUtils requires jQuery");
}

$.MyUtils = {
    setCookie:function ($c_name, $c_value, $ex_days) {
        var d = new Date();
        d.setTime(d.getTime() + ($ex_days*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = $c_name + "=" + $c_value + ";" + expires + ";path=/";
    },
    reDrawDataTable:function ($allDataTable){
        for (var $i=0;$i<$allDataTable.length;$i++){
            var $id = $allDataTable[$i];
            console.log("redraw :" +$id);
            var $table = $('#' + $id).DataTable();
            $table.draw();
        }
    },
    in_array: function (needle, haystack) {
        for (i in haystack) {
            if (haystack[i] == needle) return true;
        }
        return false;
    },
    displayMessage:function(messageId, type, message){
        var $m = $("#" + messageId);
        if(type=="loading"){
            console.log("display loading icon");
            //<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
            $m.text("");
            $m.removeClass("failure");
            $m.removeClass("success");
            $m.addClass("fa fa-circle-o-notch fa-spin fa-3x fa-fw");
            $m.show();
        }else{
            $m.removeClass("fa fa-circle-o-notch fa-spin fa-3x fa-fw");
            if(type == "success"){
                $m.removeClass("failure");
                $m.addClass("success");
            }else{
                $m.removeClass("success");
                $m.addClass("failure");
            }
            $m.text(message).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
        }
    },
    number_format:function (number, decimals, decPoint, thousandsSep) {

        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number;
        var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
        var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
        var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
        var s = '';

        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                    .toFixed(prec)
        };

        // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1).join('0')
        }

        return s.join(dec)
    }
};



