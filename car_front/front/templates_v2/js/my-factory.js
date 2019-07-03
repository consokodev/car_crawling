if (typeof jQuery === "undefined") {
    throw new Error("MyFactory requires jQuery");
}

$.MyFactory = {
    setCookie:function ($c_name, $c_value, $ex_days) {
        var d = new Date();
        d.setTime(d.getTime() + ($ex_days*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = $c_name + "=" + $c_value + ";" + expires + ";path=/";
    },
    createSelection2:function(name_attr, label, list, col ) {
        var $col_kpi = $("<div>", {"class": "col-md-" + col});
        var $form_kpi = $("<div>", {"class": "input-group"});
        var $kpi_selection = $("<select></select>").attr("class", "form-control select2")
            .attr("name", name_attr).attr("id", name_attr);
        for (var i = 0; i < list.length; i++) {
            var $v = list[i][0];
            var $d = list[i][1];
            $kpi_selection.append("<option value=\"" + $v + "\">" + $d + "</option>");
        }
        $form_kpi.append("<label>" + label + "</label>");
        $form_kpi.append($kpi_selection);
        $col_kpi.append($form_kpi);
        return $col_kpi;
    }
};

