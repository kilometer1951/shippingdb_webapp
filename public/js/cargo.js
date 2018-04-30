function getClients(value) {
    if (value !== "") {
        $(".client_table_body").html("");
        //ajax call
        $.post("/clients/searchQ", { data: value }, function(dataFound) {
            //   console.log(dataFound);
            if (dataFound.length !== 0) {
                $(".client_table_body").html("");
                dataFound.forEach(function(result) {
                    var client_table = '';

                    client_table += '<tr>';
                    client_table += '<td>' + result.first_name + '</td>';
                    client_table += '<td>' + result.last_name + '</td>';
                    client_table += '<td>' + result.email + '</td>';
                    client_table += '<td>';
                    client_table += '<button class="btn btn-outline-info btn-sm newCargoBtn" id="' + result._id + '"><i class="fas fa-plus"></i> New Cargo</button>';
                    client_table += '</td>';
                    client_table += '</tr>';

                    $('.client_table_body').append(client_table);
                    $(".nodata").fadeOut();
                    // console.log(result);
                });




            }
            else {
                //if no result
                $(".nodata").fadeIn();
                $(".nodata_text").text("No Client Found for " + value);
            }

        });


    }
    else {
        //    location.reload();
        $(".nodata").fadeOut();

        //ajax call
        $.get("/clientsAjax", function(data) {
            $(".client_table_body").html("");
            data.forEach(function(result) {
                var client_table = '';

                client_table += '<tr>';
                client_table += '<td>' + result.first_name + '</td>';
                client_table += '<td>' + result.last_name + '</td>';
                client_table += '<td>' + result.email + '</td>';
                client_table += '<td>';
                client_table += '<button class="btn btn-outline-info btn-sm newCargoBtn" id="' + result._id + '"><i class="fas fa-plus"></i> New Cargo</button>';
                client_table += '</td>';
                client_table += '</tr>';

                $('.client_table_body').append(client_table);
                //console.log(result);
            });
        });



    }
}


$(document).ready(function() {


    $("#vinsearchBtn").click(function() {
        $.get("https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" + $("#vinsearch").val() + "/getallmakes?format=json", function(data) {

            if (data.Results[8].Value !== null) {
                $("#error").fadeOut();
                $(".newCargoSection").css({ "height": "550px" });
                if (data.Results[11].Value !== null) {
                    $("#cardetails").val(data.Results[8].Value + " " + data.Results[5].Value + " " + data.Results[7].Value + " " + data.Results[11].Value)
                    $("#vin").val($("#vinsearch").val());
                    $("#vinsearch").val("")

                }
                else {
                    $("#cardetails").val(data.Results[8].Value + " " + data.Results[5].Value + " " + data.Results[7].Value)
                    $("#vin").val($("#vinsearch").val());
                    $("#vinsearch").val("")
                }
            }
            else {
                $(".newCargoSection").css({ "height": "600px", "margin-bottom": "20px" });
                $("#error").fadeIn();
                $("#cardetails").val("");
                $("#vin").val("");
            }

            // console.log(data.Results)
        });
    });



    $(document).on('click', '.newCargoBtn', function() {
        var client_id = $(this).attr("id");

        //display loading bar and remove div
        $(".loader").css("display", "block");
        $(".activateCargoEntry").css("display", "none");
        //ajax call
        $.get("/clientsBasedId/" + client_id, function(data) {
            //display text and div
            $("#clientName").text("New Cargo for: " + data.full_name);
            $(".client_ID").attr("id", data._id);

            // ajax call then check if you have to clear text or assign va value to it clear 

            $.ajax({
                url: "/checkcargourl__/" + client_id,
                type: "GET",
                success: function(response) {
                    //    console.log(response)
                    $(".saveAndNew").attr("id", response);
                    $(".saveAndClose").attr("id", response);
                },
                error: function(argument) {
                    // body...
                }
            })

            $(".saveAndNew").attr("id", "");
            $(".saveAndClose").attr("id", "");




            //clear input filds
            $("#cardetails").val('');
            $("#vin").val('');
            $("#aes").val('');
            $("#personal_effect").val('');
            //end

            $(".activateCargoEntry").css("display", "block");

            //remove loader
            $(".loader").css("display", "none");
        });

    });

    $(document).on('click', '.saveAndNew', function() {

        var cargo_id = $(this).attr("id");
        saveCargo(cargo_id);

    });

    $(document).on('click', '.saveAndClose', function() {

        var cargo_id = $(this).attr("id");
        saveCargo(cargo_id);
        window.location.href = "/cargo";
    });



    function saveCargo(cargo_id) {
        if ($("#vin").val() !== "") {
            //get data
            var data = {};
            data.cargo_id = cargo_id;
            data.client_ID = $(".client_ID").attr("id");
            data.cardetails = $("#cardetails").val();
            //data.date_ = $("#date_").val();
            data.vin = $("#vin").val();
            data.aes = $("#aes").val();
            data.personal_effect = $("#personal_effect").val();

            //send data to server
            $.post("/cargo/new", { data: data }, function(result) {
                console.log(result._id);
                //add cargo id to save button
                $(".saveAndNew").attr("id", result._id);
                $(".saveAndClose").attr("id", result._id);

                //clear input filds
                $("#cardetails").val('');
                $("#vin").val('');
                $("#aes").val('');

                //display snackbar
                var x = document.getElementById("snackbar");
                x.className = "show";
                setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);

            });
        }


    }


    //Add More Cars
    $(document).on('click', '.openAddMoreCars', function() {
        var id = $(this).attr("id");
        $(".addMoreCarsAndNew").attr("id", id);
        $(".addMoreCarsAndClose").attr("id", id);
        //addMoreCars(id);
    });

    $(document).on('click', '.addMoreCarsAndNew', function() {
        var id = $(this).attr("id");
        addMoreCars(id);
    });

    $(document).on('click', '.addMoreCarsAndClose', function() {
        var id = $(this).attr("id");
        addMoreCars(id);
        $('#addMoreCarsModal').modal('toggle');
    });


    function addMoreCars(id) {

        if ($("#vin").val() !== "") {
            //get data
            var data = {};
            data.cardetails = $("#cardetails").val();
            data.vin = $("#vin").val();
            data.aes = $("#aes").val();
            //send data to server
            $.post('/cargo/' + id + '/addmorecars', { data: data }, function(result) {
                console.log(result);
                //append new car to table
                $("#cars_columnId" + id).prepend($("#cardetails").val() + ', ');
                //clear input filds
                $("#cardetails").val('');
                $("#vin").val('');
                $("#aes").val('');

                if (result !== false) {
                    //display snackbar
                    var x = document.getElementById("snackbar");
                    x.className = "show";
                    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
                }



            });
        }



    }

    //get cargo id
    $(document).on('click', '.deleteMessage1', function() {
        var id = $(this).attr("id");
        $(".delete1").attr("id", id);

        //alert(state_id);
    });

    //delete Client
    $(document).on('click', '.delete1', function() {
        var id = $(this).attr("id");

        $.post("/cargo/" + id + "/delete?_method=DELETE", function(result) {

            location.reload();

        });
        //alert(state_id);
    });

    //display cargo per clients
    $("#clients_dropdown").on('change', function() {
        var value = $(this).val();
        //display loader
        $(".loader").css("display", "block");
        //clear table data and wait for new data from server
        $(".cargo_table_body").html("");
        //ajax call to display data
        $.get('/cargo/' + value + '/fetchCargo_perclient', function(result) {
            $(".client_table_body").html('');
            console.log(result.length);
            if (result.length !== 0) {
                result.forEach(function(content) {
                    //display data
                    var html = '';
                    html += '<tr id="cargo_rowID">';
                    html += '<td>' + (moment.parseZone(content.createdAt).format('l') === moment.parseZone(new Date()).format('l') ? 'Today' : moment(content.createdAt).format("ll")) + '</td>';
                    html += '<td>' + content.Client[0].full_name + '</td>';
                    html += '<td style="background-color:#37474F;color:#fff;">';
                    content.Cars.forEach(function(allCars, idx, array) {
                        html += '<span id="cars_columnId' + content._id + '">' + displayCars_1(allCars.cardetails, idx, array) + '</span>';
                    });
                    html += '</td>';
                    html += '<td>' + content.personal_effect + '</td>';
                    html += '<td>';
                    html += '<button class="btn btn-outline-dark btn-sm openAddMoreCars" id="' + content._id + '" data-toggle="modal" data-target="#addMoreCarsModal"><i class="fas fa-plus"></i> Add more cars</button> ';
                    html += '<a class="btn btn-outline-info btn-sm openEditModal" href="cargo/' + content._id + '/editRoute"><i class="far fa-edit"></i> Edit</a> ';
                    html += '<button class="btn btn-outline-danger btn-sm deleteMessage1" id="' + content._id + '" data-toggle="modal" data-target=".deleteMessageModal1"><i class="far fa-trash-alt"></i> Delete</button>';
                    html += '</td>';
                    html += '</tr>';
                    $(".cargo_table_body").append(html);
                    //remove loader
                    $(".loader").css("display", "none");
                    $(".nodata").css("display", "none");
                    //   console.log(content.Client[0].full_name);
                    // console.log(content.Cars);
                });
            }
            else {
                $(".nodata").css("display", "block");
                $(".loader").css("display", "none");
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



    //edit personal effect
    $(document).on('click', '.savechanges_personaleffect', function() {

        var cargo_id = $(this).attr("id");
        // get data
        var data = {};
        data.personal_effect = $("#personal_effect").val();

        //send data to server
        $.post('/cargo/' + cargo_id + '/edit_personaleffect', { data: data }, function(result) {
            console.log(result);


            //display snackbar
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);

        });

    });



});



//edit cargo
//1. cars
function updateCars(car_id, cargo_id) {
    // get data
    var data = {};
    data.cardetails = $("#cardetails" + car_id).val();
    data.vin = $("#vin" + car_id).val();
    data.aes = $("#aes" + car_id).val();
    data.car_id = car_id;
    //send data to server
    $.post('/cargo/' + cargo_id + '/edit', { data: data }, function(result) {
        console.log(result);


        //display snackbar
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);

    });

    //alert(car_id +', '+ cargo_id);
}
