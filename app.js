let App = (function() {
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

        let $table_data = $('#table_data');

        $.ajax({
            async: true,
            url: `http://localhost:3000/invoices?${queryParam}${hasFilterAndSortParam ? '&' : ''}${sortParam}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $table_data.empty();
                $.each(data, function(i, v) {
                    let dateCreated = new Date(v.date_created);
                    let dateDue = new Date(v.date_due);
                    let dateSupply = new Date(v.date_supply);
                    let $tr = $(`<tr>
                                    <td class="hide">${v.id}</td>
                                    <td>${v.number}</td>
                                    <td>${v.direction}</td>
                                    <td>${dateCreated.toLocaleDateString("ru-RU")}</td>
                                    <td>${dateDue.toLocaleDateString("ru-RU")}</td>
                                    <td>${dateSupply.toLocaleDateString("ru-RU")}</td>
                                    <td>${v.comment}</td>
                                    <td><button class="btn btn-primary" data-id="${v.id}">Редактировать</button></td>
                                    <td><button class="btn btn-danger" data-id="${v.id}">Удалить</button></td>
                                </tr>`);
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

    $('#add-invoice-btn').on('click', function() {
        $('#edit-modal').modal('show');
    });

    return {
        Init: Init
    };
}());

$(document).ready(function() {
    App.Init();
});
