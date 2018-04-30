$(document).ready(function() {



    //get client data
    $('.newFormBtn').on('click', function() {
        //ajax call

        $.get("/clientsAjax", function(data) {
            data.forEach(function(content) {
                var clientdropdown = '';
                clientdropdown += '<option id="' + content._id + '" value="' + content._id + '">' + content.full_name + '</option>';
                $("#clientdropdown").append(clientdropdown);
                console.log(clientdropdown);
            });
        });

    });



    //get cosignee and cargo data
    $(document).on('change', '#clientdropdown', function() {
        var client_id = $(this).val();
        $(".table").fadeIn();
        // alert(client_id);
        //get cosignee data
        $.get("/cosigneeDropdownData/" + client_id, function(data) {
            if (data.length === 0) {
                $("#consigneedropdown").html("<option>Select a Consignee</option>");
            }
            else {
                data.forEach(function(content) {
                    var consigneedropdown = '';
                    consigneedropdown += '<option id="' + content._id + '" value="' + content._id + '">' + content.full_name + '</option>';
                    $("#consigneedropdown").append(consigneedropdown);
                    // console.log(content);
                });
            }
        });

        //get clients cargo

        //clear table data and wait for new data from server
        $(".cargo_table_body").html("");
        //ajax call to display data
        $.get('/cargo/' + client_id + '/fetchCargo_perclient_2', function(result) {
            $(".cargo_table_body").html('');
            //  console.log(result.length);
            if (result.length !== 0) {
                result.forEach(function(content) {
                    //display data
                    var html = '';
                    html += '<tr id="cargo_rowID">';
                    html += '<td>' + (moment.parseZone(content.createdAt).format('l') === moment.parseZone(new Date()).format('l') ? 'Today' : moment(content.createdAt).format("ll")) + '</td>';
                    html += '<td style="background-color:#37474F;color:#fff;">';
                    content.Cars.forEach(function(allCars, idx, array) {
                        html += '<span id="cars_columnId' + content._id + '">' + displayCars_1(allCars.cardetails, idx, array) + '</span>';
                    });
                    html += '</td>';
                    html += '<td style="background-color:#01579b ;color:#fff;">' + content.personal_effect + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-outline-dark btn-sm next_1" id="' + content._id + '" ><i class="fas fa-arrow-right"></i> Attach this container</button>';
                    html += '</td>';
                    html += '</tr>';
                    $(".cargo_table_body").append(html);
                    //remove loader
                    $(".nodata1").css("display", "none");
                    //   console.log(content.Client[0].full_name);
                    // console.log(content.Cars);




                });
            }
            else {
                $(".nodata1").css("display", "block");
            }

        });
    });


    function displayCars_1(str, idx, array) {
        if (str !== "") {
            if (idx === array.length - 1) {
                return str;
            }
            return str + ', ';
        }
        else {
            return str;
        }
    }


    $(document).on("click", ".next_22", function() {
        $(".section1").fadeOut();
        $(".section2").fadeIn();
        // var cargo_id = $(this).attr("id");

        //pass cargo_id
        $(".cargo_id_").attr("id", "");
    });

    $(document).on("click", ".next_1", function() {
        $(".section1").fadeOut();
        $(".section2").fadeIn();
        var cargo_id = $(this).attr("id");

        //pass cargo_id
        $(".cargo_id_").attr("id", cargo_id);
    });


    $(document).on("click", ".next_2", function() {
        $(".section2").fadeOut();
        $(".section3").fadeIn();
        $(".modal-footer").fadeIn();
    });


    $(document).on("click", ".back_2", function() {
        $(".section2").fadeOut();
        $(".section1").fadeIn();
    });



    $(document).on("click", ".back_3", function() {
        $(".section3").fadeOut();
        $(".modal-footer").fadeOut();
        $(".section2").fadeIn();
    });



    //submit data
    $(document).on("click", ".createForm", function() {
        //get inputs
        var data = {};
        data.clientdropdown = $("#clientdropdown").val();
        data.consigneedropdown = $("#consigneedropdown").val();
        data.cargo_id_ = $(".cargo_id_").attr("id");

        data.portdestination = $("#portdestination").val();
        data.carrier = $("#carrier").val();
        data.insurance = $('input:radio[name=insurance]:checked').val();
        data.typeofshipment = $('input:radio[name=typeofshipment]:checked').val();
        data.typeofpayment = $('input:radio[name=typeofpayment]:checked').val();
        data.effective_date = $("#effective_date").val();
        data.expiration = $("#expiration").val();
        data.carrier_rep = $("#carrier_rep").val();

        data.bill_of_lading_oring = $("#bill_of_lading_oring").val();
        data.ocean_port_of_loading = $("#ocean_port_of_loading").val();
        data.bill_of_lading_destination = $("#bill_of_lading_destination").val();
        data.port_of_discharge = $("#port_of_discharge").val();
        data.rate = $("#rate").val();
        data.rate_basis = $("#rate_basis").val();
        data.cargo_qantity = $("#cargo_qantity").val();
        data.minimum = $("#minimum").val();
        data.maximum = $("#maximum").val();
        data.origin_service = $("#origin_service").val();
        data.destination_service = $("#destination_service").val();
        data.special_conditions = $("#special_conditions").val();
        data.commodity = $("#commodity").val();
        $.ajax({
            type: 'POST',
            url: '/poa_nra_form/new',
            data: data,
            success: function(data) {
                // console.log(data);
                location.reload();
            },
            error: function() {
                alert("Something went wrong");
            }
        });


    });




    //submit data and email
    $(document).on("click", ".createFormAndEmail", function() {
        //get inputs
        var data = {};
        data.clientdropdown = $("#clientdropdown").val();
        data.consigneedropdown = $("#consigneedropdown").val();
        data.cargo_id_ = $(".cargo_id_").attr("id");

        data.portdestination = $("#portdestination").val();
        data.carrier = $("#carrier").val();
        data.insurance = $('input:radio[name=insurance]:checked').val();
        data.typeofshipment = $('input:radio[name=typeofshipment]:checked').val();
        data.typeofpayment = $('input:radio[name=typeofpayment]:checked').val();
        data.effective_date = $("#effective_date").val();
        data.expiration = $("#expiration").val();
        data.carrier_rep = $("#carrier_rep").val();

        data.bill_of_lading_oring = $("#bill_of_lading_oring").val();
        data.ocean_port_of_loading = $("#ocean_port_of_loading").val();
        data.bill_of_lading_destination = $("#bill_of_lading_destination").val();
        data.port_of_discharge = $("#port_of_discharge").val();
        data.rate = $("#rate").val();
        data.rate_basis = $("#rate_basis").val();
        data.cargo_qantity = $("#cargo_qantity").val();
        data.minimum = $("#minimum").val();
        data.maximum = $("#maximum").val();
        data.origin_service = $("#origin_service").val();
        data.destination_service = $("#destination_service").val();
        data.special_conditions = $("#special_conditions").val();
        data.commodity = $("#commodity").val();
        $.ajax({
            type: 'POST',
            url: '/poa_nra_form/new',
            data: data,
            success: function(data) {
                // console.log(data);
                window.location.href = "/poa_nra/" + data._id + "/email/" + data.Client;
            },
            error: function() {
                alert("Something went wrong");
            }
        });


    });


    //get  id
    $(document).on('click', '.deleteMessage1', function() {
        var id = $(this).attr("id");
        $(".delete1").attr("id", id);

        //alert(state_id);
    });

    //delete Client
    $(document).on('click', '.delete1', function() {
        var id = $(this).attr("id");

        $.post("/poa_nra/" + id + "/delete?_method=DELETE", function(result) {

            location.reload();

        });
        //alert(state_id);
    });



    //display poa_nra per clients
    $("#clients_dropdown").on('change', function() {
        var id = $(this).val();
        //display loader
        $(".loader").css("display", "block");
        //clear table data and wait for new data from server
        $(".table_body").html("");
        //ajax call to display data
        $.get('/poa_nra/' + id + '/fetchCargo_perclient', function(result) {
            $(".table_body").html('');
            console.log(result.length);
            if (result.length !== 0) {
                result.forEach(function(content) {
                    //display data
                    var html = '';
                    html += '<tr id="rowID">';
                    html += '<td>' + (moment.parseZone(content.createdAt).format('l') === moment.parseZone(new Date()).format('l') ? 'Today' : moment(content.createdAt).format("ll")) + '</td>';
                    html += '<td>' + content.Client[0].full_name + '</td>';
                    html += '<td>' + (content.typeofshipment === null ? "" : content.typeofshipment) + '</td>';
                    html += '<td>' + content.port_of_discharge + '</td>';
                    html += '<td>' + (content.attachment_status === false ? "No Container Attached" : "Attached") + '</td>';
                    html += '<td>';
                    html += '<a class="btn btn-outline-dark btn-sm" href="/poa_nra/' + content._id + '/email_1/' + content.Client[0]._id + '"><i class="fas fa-envelope-open"></i> Email POA</a>';
                    html += ' <a class="btn btn-outline-success btn-sm" href="/poa_nra/' + content._id + '/email/' + content.Client[0]._id + '"><i class="fas fa-envelope-open"></i> Email NRA</a>';
                    html += ' <a class="btn btn-outline-warning btn-sm openEditModal" href="poa_nra/' + content._id + '/attach/' + content.Client[0]._id + '"><i class="far fa-edit"></i> Attach a container</a>';
                    html += ' <a class="btn btn-outline-info btn-sm openEditModal" href="/poa_nra/' + content._id + '/edit"><i class="far fa-edit"></i> Edit</a>';
                    html += ' <button class="btn btn-outline-danger btn-sm deleteMessage1" id="' + content._id + '" data-toggle="modal" data-target=".deleteMessageModal1"><i class="far fa-trash-alt"></i> Delete</button>';
                    html += '</td>';
                    html += '</tr>';
                    $(".table_body").append(html);
                    //remove loader
                    $(".loader").css("display", "none");
                    $(".nodata").css("display", "none");
                    //   console.log(content.Client[0].full_name);
                    console.log(content);


                });
            }
            else {
                $(".nodata").css("display", "block");
                $(".loader").css("display", "none");
            }

        });
    });


});
