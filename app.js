var App = (function() {
    'use strict';

    function LoadInvoices(q) {
        $.ajax({
            async: true,
            url: 'http://localhost:3000/invoices',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                var $table_data = $('#table_data');
                $table_data.empty();

                $.each(data, function(i, v) {
                    var editBtn = `<td><button class="btn btn-primary" data-id="${v.id}">Edit</button></td>`;
                    var delBtn = `<td><button class="btn btn-danger" data-id="${v.id}">Delete</button></td>`;
                    var $tr = $(`<tr><td class="hide">${v.id}</td><td>${v.create}</td><td>${v.no}</td><td>${v.supple}</td><td>${v.comment}</td>${editBtn}${delBtn}</tr>`);
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

$(document).ready(function() {
    App.Init();
});