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
                    let dateCreated = v.date_created != '' ? new Date(v.date_created) : null;
                    let dateDue = v.date_due != '' ? new Date(v.date_due) : null;
                    let dateSupply = v.date_supply != '' ? new Date(v.date_supply) : null;
                    let $tr = $(`<tr>
                                    <td class="hide">${v.id}</td>
                                    <td>${v.number}</td>
                                    <td>${v.direction}</td>
                                    <td>${dateCreated != null ? dateCreated.toLocaleDateString("ru-RU") : ''}</td>
                                    <td>${dateDue != null ? dateDue.toLocaleDateString("ru-RU") : ''}</td>
                                    <td>${dateSupply != null ? dateSupply.toLocaleDateString("ru-RU") : ''}</td>
                                    <td>${v.comment}</td>
                                    <td><button type="button" class="btn btn-primary edit-invoice-btn" data-id="${v.id}">Редактировать</button></td>
                                    <td><button type="button" class="btn btn-danger delete-invoice-btn" data-id="${v.id}">Удалить</button></td>
                                </tr>`);
                    $table_data.append($tr);
                });

                $('.edit-invoice-btn').on('click', EditInvoiceBtnClickHandler);
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

    let EditInvoiceBtnClickHandler = function() {
        ClearForm();
        let $modal = $('#edit-modal');
        let $form = $modal.find('form');
        $form.data('id', $(this).data('id'));

        $.ajax({
            async: true,
            url: `http://localhost:3000/invoices/${$(this).data('id')}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $form.data('date_created', data.date_created);
                $form.find('#number').val(data.number);
                $form.find('#direction').val(data.direction);
                $form.find('#date-due').val(data.date_due.substring(0, data.date_due.indexOf('T')));
                if (data.date_supply != '')
                    $form.find('#date-supply').val(data.date_supply.substring(0, data.date_supply.indexOf('T')));
                $form.find('#comment').val(data.comment);
                $form.validator();

                $modal.find('.modal-title').text('Редактирование счета');
                $modal.modal('show');
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

    let ClearForm = function() {
        let $form = $('#edit-modal form');
        $form.data('id', '');
        $form.data('date_created', '');
        $form.find('#number').val(null);
        $form.find('#direction').val(null);
        $form.find('#date-due').val(null);
        $form.find('#date-supply').val(null);
        $form.find('#comment').val(null);
    }

    let Init = function() {
        LoadInvoices();
    };

    $('#search-btn').on('click', function() {
        LoadInvoicesByFilter();
    });

    $('#add-invoice-btn').on('click', function() {
        ClearForm();
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
            e.preventDefault();
            let $form = $(this);
            let dateSupply = $form.find('#date-supply').val();
            var invoice = {
                number: parseInt($form.find('#number').val()),
                direction: $form.find('#direction').val(),
                date_created: new Date().toISOString(),
                date_due: new Date($form.find('#date-due').val()).toISOString(),
                date_supply: dateSupply != '' ? new Date(dateSupply).toISOString() : '',
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
                    }
                });
            }
            else {
                invoice.id = $form.data('id');
                invoice.date_created = $form.data('date_created');
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

        return false;
    });


    return {
        Init: Init
    };
}());

$(document).ready(function() {
    App.Init();
});
