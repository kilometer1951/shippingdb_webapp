$(document).ready(function() {

    //get client data
    $('.newFormBtn').on('click', function() {
        //ajax call

        $.get("/clientsAjax", function(data) {
            data.forEach(function(content) {
                var clientdropdown = '';
                clientdropdown += '<option id="' + content._id + '" value="' + content._id + '">' + content.full_name + '</option>';
                $("#clientdropdown").append(clientdropdown);
                //  console.log(clientdropdown);
            });
        });

    });



    //get cosignee 
    $(document).on('change', '#clientdropdown', function() {
        var client_id = $(this).val();
        $(".table_1").fadeIn();
        $("#consigneedropdown").html("<option>Select a Consignee</option>");
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
        $(".loader1").css("display", "block");
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
                    html += '<button class="btn btn-outline-dark btn-sm next_1" id="' + content._id + '" ><i class="fas fa-arrow-right"></i> Next</button>';
                    html += '</td>';
                    html += '</tr>';
                    $(".cargo_table_body").append(html);
                    //remove loader
                    $(".nodata1").css("display", "none");
                    $(".loader1").css("display", "none");
                    //   console.log(content.Client[0].full_name);
                    // console.log(content.Cars);

                });
            }
            else {
                $(".nodata1").css("display", "block");
                $(".loader1").css("display", "none");
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



    $(document).on("click", ".next_1", function() {
        $(".section1").fadeOut();
        $(".nodata1").fadeOut();
        $(".loader1").fadeIn();
        var cargo_id = $(this).attr("id");


        $(".cargo_id").attr("id", cargo_id);

        //display cargo weight data
        //ajax call for one cargo
        $.get("/cargo/" + cargo_id + "/oneCargo", function(data) {
            //console.log(data.Cars.length)
            $(".loader1").css("display", "none");
            if (data.Cars.length !== 0) {
                data.Cars.forEach(function(content, index) {
                    var car_number = parseInt(index, 10) + 1
                    var html = '';

                    html += '<div class="col-md-6"><div class="form-group">';
                    html += '<label>Car ' + car_number + '</label><input class="form-control" id="cardetails" value="' + content.cardetails + '" disabled>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="col-md-3">';
                    html += '<div class="form-group">';
                    html += '<label>Weight</label><input class="form-control weight" id="' + content._id + '" value="' + content.weight + '" type="number" step="any">';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="col-md-3">';
                    html += '<div class="form-group">';
                    html += '<label>Measurement</label><input class="form-control measurement" id="' + content._id + '" value="' + content.measurement + '" type="number" step="any">';
                    html += '</div>';
                    html += '</div>';
                    //  alert()
                    $(".section2_row").append(html);

                });
            }

            var personal_effect = '';

            personal_effect += '<div class="col-md-8">';
            personal_effect += '<div class="form-group">';
            personal_effect += '<label>Personal Effects</label>';
            personal_effect += '<textarea class="form-control" name="personal_effect" rows="6" style="resize:none;" id="personal_effect" disabled>' + data.personal_effect + '</textarea>';
            personal_effect += '</div>';
            personal_effect += '</div>';
            personal_effect += '<div class="col-md-4">';
            personal_effect += '<div class="form-group">';
            personal_effect += '<label>Weight</label>';
            personal_effect += '<input class="form-control personal_effect_weight" id="' + data._id + '" value = "' + data.personal_effect_weight + '" type="number" step="any">';
            personal_effect += '<label>Measurement</label>';
            personal_effect += '<input class="form-control personal_effect_m" id="' + data._id + '" value = "' + data.personal_effect_m + '" type="number" step="any"><br>';
            personal_effect += '<button class="btn btn-warning b_2" style="float:left;"> Back</button>'
            personal_effect += '<button class="btn btn-info next_2" style="float:right;"> Next</button>'
            personal_effect += '</div>';
            personal_effect += '</div>';
            personal_effect += '<div class="col-md-12"><div class="form-group">';
            personal_effect += '<label style="color:#3F729B;">Total Weight</label>';
            personal_effect += '<input class="form-control total_weight" id="total_weight"  disabled value="' + data.total_weight + '"> ';
            personal_effect += '</div>';
            personal_effect += '</div>';


            $(".section2").css("display", "block");
            $(".section2_row").append(personal_effect);

            var g = document.getElementsByClassName("weight");
            var m = document.getElementsByClassName("measurement");
            //weight calculation
            $(".next_2").click(function() {

                var total_weight = 0;

                var data = {};
                var personal_effect_weight = parseFloat($(".personal_effect_weight").val()) || 0;
                var personal_effect_m = parseFloat($(".personal_effect_m").val()) || 0;

                for (var i = 0; i < g.length; i++) {
                    if (g[i].value !== "") {
                        total_weight += parseFloat(g[i].value);
                    }
                    //update cargo db
                    data.cargo_id_11 = $(".cargo_id").attr("id");
                    data.car_id = g[i].id;
                    data.weight = g[i].value;
                    console.log(total_weight);
                    $.post("/_update_cargo_dock_1_", { data: data }, function(result) {
                        //console.log(result);
                    });
                    //    }

                }
                $(".total_weight").val(total_weight + personal_effect_weight);
                //alert(personal_effect_weight)

                for (var i = 0; i < m.length; i++) {
                    //update cargo db
                    data.cargo_id_11 = $(".cargo_id").attr("id");
                    data.car_id = m[i].id;
                    data.measurement = m[i].value;
                    //  console.log(data);
                    $.post("/_update_cargo_dock_3_", { data: data }, function(result) {
                        //console.log(result);
                    });

                }



                //update total weight and personal effect
                data.personal_effect_weight = personal_effect_weight;
                data.personal_effect_m = personal_effect_m;
                data.total_weight = $(".total_weight").val();
                $.post("/_update_cargo_dock_2_", { data: data }, function(result) {
                    //  console.log(result);
                });


            });



        });

    });


    //booking c
    $(document).on("click", ".next_2", function() {
        $(".nodata1").fadeOut();
        //remove section 2 and display section 3
        $(".section2").fadeOut();
        $(".section3").fadeIn();
        $(".loader1").fadeIn();

        var client_id = $("#clientdropdown").val();
        //ajax call
        $.get("/bc/" + client_id + "/fetch_perclient", function(data) {
            if (data.length !== 0) {
                data.forEach(function(content) {
                    //display data
                    var html = '';
                    html += '<tr id="cargo_rowID">';
                    html += '<td>' + (moment.parseZone(content.createdAt).format('l') === moment.parseZone(new Date()).format('l') ? 'Today' : moment(content.createdAt).format("ll")) + '</td>';
                    html += '<td style="background-color:#01579b ;color:#fff;">' + content.vessel_name + '</td>';
                    html += '<td>' + content.booking_number + '</td>';
                    html += '<td>' + content.voyage_number + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-dark btn-sm next_3" id="' + content._id + '" ><i class="fas fa-arrow-right"></i> Next</button>';
                    html += '</td>';
                    html += '</tr>';
                    $(".table_body_bc").append(html);
                    //remove loader
                    $(".nodata1").css("display", "none");
                    $(".loader1").css("display", "none");
                    //   console.log(content.Client[0].full_name);
                    // console.log(content.Cars);

                });
            }
            else {
                $(".nodata1").css("display", "block");
                $(".loader1").css("display", "none");
            }

        });

    });


    $(document).on("click", ".next_3", function() {
        $(".section3").fadeOut();
        $(".nodata1").fadeOut();
        var bookingc_id = $(this).attr("id")

        $(".bookingc_id").attr("id", bookingc_id);

        //go to next section
        $(".section4").fadeIn();
        $(".modal-footer").fadeIn();
    });


    $(document).on("click", ".b_2", function() {
        $(".section1").fadeIn();

        //remove html data
        $(".section2_row").html("");
        $(".section2").fadeOut();
    });
    $(document).on("click", ".b_3", function() {
        $(".section2").fadeIn();

        //remove html data
        $(".table_body_bc").html("");
        $(".section3").fadeOut();
    });
    $(document).on("click", ".b_4", function() {
        $(".section3").fadeIn();
        $(".section4").fadeOut();

        $(".modal-footer").fadeOut();
    });



    // $(document).on("click", ".back_3", function() {
    //      $(".section3").fadeOut();
    //      $(".modal-footer").fadeOut();
    //      $(".section2").fadeIn();
    // });


    // //submit data
    $(document).on("click", ".createForm", function() {
        //get inputs
        var data = {};
        data.bookingc_id = $(".bookingc_id").attr("id");

        data.n_name = $("#n_name").val();
        data.n_address = $("#n_address").val();
        data.n_country = $("#n_country").val();
        data.n_pnum = $("#n_pnum").val();
        data.seal_num = $("#seal_num").val();
        data.demurrage = $("#demurrage").val();
        data.container_num = $("#container_num").val();
        data.aes_num = $("#aes_num").val();

        data.cleint_is_agent = $('input:radio[name=agent]:checked').val();
        data.originals_tobe_released = $("#originals_tobe_released").val();

        data.clientdropdown = $("#clientdropdown").val();
        data.consigneedropdown = $("#consigneedropdown").val();
        data.fowarding_agent_ref = $("#fowarding_agent_ref").val();

        data.for_transhipment_to = $("#for_transhipment_to").val();
        data.point_and_contry_of_origin = $("#point_and_contry_of_origin").val();

        data.cargo_id_ = $(".cargo_id").attr("id");

        $.ajax({
            type: 'POST',
            url: '/dock_r/new',
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






    //display dr per clients
    $("#clients_dropdown").on('change', function() {
        var id = $(this).val();
        //display loader
        $(".loader").css("display", "block");
        //clear table data and wait for new data from server
        $(".table_body").html("");
        //ajax call to display data
        $.get('/d_r/' + id + '/fetch_perclient', function(result) {
            $(".table_body").html('');
            console.log(result.length);
            if (result.length !== 0) {
                result.forEach(function(content) {
                    //display data
                    var html = '';
                    html += '<tr id="rowID">';
                    html += '<td>' + (moment.parseZone(content.createdAt).format('l') === moment.parseZone(new Date()).format('l') ? 'Today' : moment(content.createdAt).format("ll")) + '</td>';
                    html += '<td>' + content.Client[0].full_name + '</td>';
                    html += '<td>' + content.container_num + '</td>';
                    html += '<td>';
                    html += '<a class="btn btn-success btn-sm" href="/d_r/' + content._id + '/email/' + content.Client[0]._id + '/cargo/' + content.Cargo + '/consignee/' + content.Consignee + '/booking_c/' + content.BookingConfirmation + '"><i class="fas fa-envelope-open"></i> Email with clients name</a> ';
                    html += '<a class="btn btn-success btn-sm" href="/d_r_2/' + content._id + '/email/' + content.Client[0]._id + '/cargo/' + content.Cargo + '/consignee/' + content.Consignee + '/booking_c/' + content.BookingConfirmation + '"><i class="fas fa-envelope-open"></i> Email with company name</a> ';
                    html += '<a class="btn btn-warning btn-sm" href="/bill_of_lading__/' + content._id + '/email/' + content.Client[0]._id + '/cargo/' + content.Cargo + '/consignee/' + content.Consignee + '/booking_c/' + content.BookingConfirmation + '"><i class="fas fa-envelope-open"></i> Email Bill of Lading</a>';
                    html += ' <a class="btn btn-info btn-sm openEditModal" href="/d_r/' + content._id + '/editRoute"><i class="far fa-edit"></i> Edit</a>';
                    html += ' <button class="btn btn-danger btn-sm deleteMessage1" id="' + content._id + '" data-toggle="modal" data-target=".deleteMessageModal1"><i class="far fa-trash-alt"></i> Delete</button>';
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

    //delete
    //get  id
    $(document).on('click', '.deleteMessage1', function() {
        var id = $(this).attr("id");
        $(".delete1").attr("id", id);

        //alert(state_id);
    });

    //delete Client
    $(document).on('click', '.delete1', function() {
        var id = $(this).attr("id");

        $.post("/d_r/" + id + "/delete?_method=DELETE", function(result) {

            location.reload();

        });
        //alert(state_id);
    });


    //INVOICE

    $(document).on('click', '.new_invoiceBTN', function() {
        var id = $(this).attr("id");

        $(".dock_r_id").val(id)
    });


});
