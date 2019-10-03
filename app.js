var App = (function() {
    'use strict';

    function LoadInvoices(query, filterBy, sortBy, sortType) {
        query = $.trim(query);
        filterBy = $.trim(filterBy);
        sortBy = $.trim(sortBy);
        sortType = $.trim(sortType);

        let queryParam = '';
        if (query != '')
            queryParam = filterBy == 'all' ? `q=${query}` : `${filterBy}=${query}`;

        let sortParam = '';
        if (sortBy != '' && sortType != '' && sortType != 'without')
            sortParam = `_sort=${sortBy}&_order=${sortType}`; 
        
        let hasFilterAndSortParam = false;
        if (queryParam != '' && sortParam != '')
            hasFilterAndSortParam = true;

        var $table_data = $('#table_data');

        $.ajax({
            async: true,
            url: `http://localhost:3000/invoices?${queryParam}${hasFilterAndSortParam ? '&' : ''}${sortParam}&_limit=3`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $table_data.empty();
                $.each(data, function(i, v) {
                    var editBtn = `<td><button class="btn btn-primary" data-id="${v.id}">Редактировать</button></td>`;
                    var delBtn = `<td><button class="btn btn-danger" data-id="${v.id}">Удалить</button></td>`;
                    var $tr = $(`<tr><td class="hide">${v.id}</td><td>${v.number}</td><td>${v.direction}</td><td>${v.date_created}</td><td>${v.date_due}</td><td>${v.date_supply}</td><td>${v.comment}</td>${editBtn}${delBtn}</tr>`);
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

    $('#search-btn').on('click', function() {
        var query = $('#search-query').val();
        var filterBy = $('#filter-by').val();
        var sortBy = $('#sort-by').val();
        var sortType = $('#sort-type').val();

        LoadInvoices(query, filterBy, sortBy, sortType);
    });

    return {
        Init: Init
    };
}());

$(document).ready(function() {
    App.Init();
});
