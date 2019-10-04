let App = (function() {
    'use strict';

    let LoadInvoices = function(query, filterBy, sortBy, sortType) {
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

    let LoadInvoicesByFilter = function() {
        var query = $('#search-query').val();
        var filterBy = $('#filter-by').val();
        var sortBy = $('#sort-by').val();
        var sortType = $('#sort-type').val();

        LoadInvoices(query, filterBy, sortBy, sortType);
    }

    let GenerateUUID = function() {
        return `f${(+new Date).toString(16)}`;
    }


    let Init = function() {
        LoadInvoices();
    };

    $('#search-btn').on('click', function() {
        LoadInvoicesByFilter();
    });

    $('#add-invoice-btn').on('click', function() {
        let $modal = $('#edit-modal');
        let $form = $modal.find('form');
        $form.data('id', '');
        $form.validator();

        $modal.find('.modal-title').text('Добавление счета');
        $modal.modal('show');
    });

    $('#edit-modal').on('hidden.bs.modal', function() {
        $(this).find('form').validator('destroy');
    });

    $('#edit-modal form').validator().on('submit', function(e) {
        if (!e.isDefaultPrevented()) {
            let $form = $(this);
            var invoice = {
                number: parseInt($form.find('#number').val()),
                direction: $form.find('#direction').val(),
                date_created: new Date().toLocaleDateString(),
                date_due: $form.find('#date-due').val(),
                date_supply: $form.find('#date-supply').val(),
                comment: $form.find('#comment').val()
            };

            if ($form.data('id') == '') {
                let uuid = GenerateUUID() + GenerateUUID();
                invoice.id = uuid;
                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:3000/invoices',
                    data: JSON.stringify(invoice),
                    contentType: 'application/json; charset=utf-8',
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function (d) {
                        console.log(d);
                    }
                });
            }
            else {              
                invoice.id = $form.data('id');
                $.ajax({
                    async: true,
                    url: `http://localhost:3000/invoices/${invoice.id}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(invoice),
                    success: function () {
                        LoadInvoicesByFilter();
                    },
                    error: function (error) {
                        console.error(error);
                    }
                });
            }
        }
    });


    return {
        Init: Init
    };
}());

$(document).ready(function() {
    App.Init();
});
