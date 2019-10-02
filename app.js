var App = (function() {
    'use strict';

    function LoadInvoices() {
        $.ajax({
            async: true,
            url: 'http://localhost:3000/invoices',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                var $table_data = $('#table_data');
                $table_data.empty();

                $.each(data, function(i, v) {
                    var $tr = $(`<tr><td class="hide">${v.id}</td><td>${v.create}</td><td>${v.no}</td><td>${v.supple}</td><td>${v.comment}</td></tr>`);
                    $table_data.append($tr);
                });
                
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

    function Init() {
        LoadInvoices();
    };

    return {
        Init: Init
    };
}());

App.Init();