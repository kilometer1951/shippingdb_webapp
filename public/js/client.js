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
                    client_table += '<td>' + result.pnum + '</td>';
                    client_table += '<td>' + result.email + '</td>';
                    client_table += '<td>' + result.address + '</td>';
                    client_table += '<td>';
                    client_table += '<a href="mailto:' + result.email + '" class="btn btn-dark btn-sm" ><i class="far fa-envelope-open"></i> Send Email</a>';
                    client_table += '<button class="btn btn-info btn-sm openEditModal" id="' + result._id + '" data-toggle="modal" data-target="#editClientModal"><i class="far fa-edit"></i> Edit</button>';
                    client_table += ' <button class="btn btn-danger btn-sm deleteMessage" id="' + result._id + '" data-toggle="modal" data-target=".deleteMessageModal"><i class="far fa-trash-alt"></i> Delete</button>';
                    client_table += '</td>';
                    client_table += '</tr>';

                    $('.client_table_body').append(client_table);
                    $(".nodata").fadeOut();
                    console.log(result);
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
                client_table += '<td>' + result.pnum + '</td>';
                client_table += '<td>' + result.email + '</td>';
                client_table += '<td>' + result.address + '</td>';
                client_table += '<td>';
                client_table += '<a href="mailto:' + result.email + '" class="btn btn-dark btn-sm" ><i class="far fa-envelope-open"></i> Send Email</a>';
                client_table += '<button class="btn btn-info btn-sm openEditModal" id="' + result._id + '" data-toggle="modal" data-target="#editClientModal"><i class="far fa-edit"></i> Edit</button>';
                client_table += ' <button class="btn btn-danger btn-sm deleteMessage" id="' + result._id + '" data-toggle="modal" data-target=".deleteMessageModal"><i class="far fa-trash-alt"></i> Delete</button>';
                client_table += '</td>';
                client_table += '</tr>';

                $('.client_table_body').append(client_table);
                //console.log(result);
            });
        });



    }
}

// function removeTableData() {
//   if($(".searchClients").val() !== "") {
//         $(".client_table_body").fadeOut();
//         $(".waiting_for_search").fadeIn();
//   } 

// }



$(document).ready(function() {




    //get states data
    $('.newClient').on('click', function() {
        //ajax call

        $.get("/states", function(data) {
            data.forEach(function(content) {
                var states = '';
                states += '<option id="' + content._id + '" value="' + content._id + '">' + content.statename + '</option>';
                $("#state").append(states);
            })
        });

    });

    //get cities data
    $(document).on('change', '#state', function() {
        var state_id = $(this).val();

        $.get("/cities/" + state_id, function(data) {
            if (data.length === 0) {
                $("#city").html("<option>Select a city</option>");
            }
            else {
                data.forEach(function(content) {
                    var city = '';
                    city += '<option id="' + content._id + '" value="' + content._id + '">' + content.cityname + '</option>';
                    $("#city").append(city);
                    // console.log(content);
                });
            }
        });
    });

    //get cities data edit modal
    $(document).on('change', '#state1', function() {
        var state_id = $(this).val();

        $.get("/cities/" + state_id, function(data) {
            if (data.length === 0) {
                $("#city1").html("<option>Select a city</option>");
            }
            else {
                data.forEach(function(content) {
                    var city = '';
                    city += '<option id="' + content._id + '" value="' + content._id + '">' + content.cityname + '</option>';
                    $("#city1").append(city);
                    // console.log(content);
                });
            }
        });
        //alert(state_id);
    });





    $('#cfirst_name, #clast_name').on('keyup', function() {

        $("#cfull_name").val($("#cfirst_name").val() + ', ' + $("#clast_name").val());

    });



    //save Client and new
    $("#saveandnew").on("click", function(e) {
        e.preventDefault();
        saveClients();

    });

    //save Client and close
    $("#saveandclose").on("click", function(e) {
        e.preventDefault();
        saveClients();

        $("#state").html("<option>Select a state</option>");
        $("#city").html("<option>Select a city</option>");
        clearInputs();
        $('#newclientsModal').modal('toggle');
    });

    function saveClients() {
        var data = {};
        data.cfirst_name = $("#cfirst_name").val();
        data.clast_name = $("#clast_name").val();
        data.cfull_name = $("#cfull_name").val();
        data.cpnum = $("#cpnum").val();
        data.cemail = $("#cemail").val();
        data.address = $("#address").val();
        data.state = $("#state").val();
        data.city = $("#city").val();
        data.zipcode = $("#zipcode").val();
        data.tax = $("#tax").val();
        data.passport = $("#passport").val();
        data.fax = $("#fax").val();
        data.ssn = $("#ssn").val();

        $.post("/client/new", { data: data }, function(result) {
            clearInputs();
            //display data
            var client_table = '';

            client_table += '<tr>';
            client_table += '<td>' + result.first_name + '</td>';
            client_table += '<td>' + result.last_name + '</td>';
            client_table += '<td>' + result.pnum + '</td>';
            client_table += '<td>' + result.email + '</td>';
            client_table += '<td>' + result.address + '</td>';
            client_table += '<td>';
            client_table += '<button class="btn btn-info btn-sm openEditModal" id="' + result._id + '" data-toggle="modal" data-target="#editClientModal"><i class="far fa-edit"></i> Edit</button>';
            client_table += ' <button class="btn btn-danger btn-sm deleteMessage" id="' + result._id + '" data-toggle="modal" data-target=".deleteMessageModal"><i class="far fa-trash-alt"></i> Delete</button>';
            client_table += '</td>';
            client_table += '</tr>';

            $('.client_table_body').append(client_table);
            console.log(result);


        });
    }


    //get Client id
    $(document).on('click', '.deleteMessage', function() {
        var id = $(this).attr("id");
        $(".delete").attr("id", id);

        //alert(state_id);
    });

    //delete Client
    $(document).on('click', '.delete', function() {
        var id = $(this).attr("id");

        $.post("/client/" + id + "/delete?_method=DELETE", function(result) {

            location.reload();

        });
        //alert(state_id);
    });




    //open edit modal
    $(document).on('click', '.openEditModal', function() {
        var id = $(this).attr("id");

        $(".updateRecord").attr("id", id);

        $.get("/openEditModal/" + id, function(result) {
            var editModalData = '';


            editModalData += '<form>';
            editModalData += '<div class="row " style=" background-color:#e0f2f1; padding:10px;">';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="cfirst_name">First Name</label>';
            editModalData += '<input class="form-control" name="cfirst_name1" id="cfirst_name1" value="' + result.foundData.first_name + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="clast_name">Last Name</label>';
            editModalData += '<input class="form-control " name="clast_name1" id="clast_name1" value="' + result.foundData.last_name + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="cfull_name">Full Name</label>';
            editModalData += '<input class="form-control" name="cfull_name1" id="cfull_name1" disabled value="' + result.foundData.full_name + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="row "  style=" background-color:#ffe082 ; padding:10px;">';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="cpnum">Phone Number</label>';
            editModalData += '<input class="form-control" name="cpnum1" id="cpnum1" value="' + result.foundData.pnum + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="cemail">Email</label>';
            editModalData += '<input class="form-control" name="cemail1" id="cemail1" type="email" value="' + result.foundData.email + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="address">Address</label>';
            editModalData += '<input class="form-control" name="address1" id="address1" value="' + result.foundData.address + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="row"  style=" background-color:#c5e1a5 ; padding:10px;">';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="state">State</label>';
            editModalData += '<select class="form-control" id="state1" name="state1"></select>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="city">City</label>';
            editModalData += '<select class="form-control" id="city1" name="city1"></select>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="zipcode">Zip Code</label>';
            editModalData += '<input class="form-control" name="zipcode1" id="zipcode1" value="' + result.foundData.zipcode + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="row" style=" background-color:#a5d6a7; padding:10px;">';
            editModalData += '<div class="col-md-3">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="tax">IRS Tax ID</label>';
            editModalData += '<input class="form-control" name="tax1" id="tax1" value="' + result.foundData.tax + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-3">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="passport">Passport</label>';
            editModalData += '<input class="form-control" name="passport1" id="passport1" value="' + result.foundData.passport + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-3">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="fax">Fax</label>';
            editModalData += '<input class="form-control" name="fax1" id="fax1" value="' + result.foundData.fax + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-3">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="ssn">Social Security Number</label>';
            editModalData += '<input class="form-control" name="ssn1" id="ssn1" value="' + result.foundData.ssn + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</form>';

            $("#editmodal_body").html(editModalData);

            $('#cfirst_name1, #clast_name1').on('keyup', function() {

                $("#cfull_name1").val($("#cfirst_name1").val() + ', ' + $("#clast_name1").val());

            });

            //apend states
            result.states.forEach(function(data) {
                var stateHtml = '';
                stateHtml += '<option value="' + data._id + '" ' + ((data.statename === result.foundData.State.statename) ? 'selected' : '') + '>' + data.statename + '</option>';
                $("#state1").append(stateHtml);

                //get selected value
                if (data.statename === result.foundData.State.statename) {
                    // get the cities
                    $.get("/cities/" + data._id, function(citiesData) {
                        if (citiesData.length === 0) {
                            $("#city").html("<option>Select a city</option>");
                        }
                        else {
                            citiesData.forEach(function(content) {
                                if (result.foundData.City === undefined) {
                                    var city = '';
                                    city += '<option>Select a city</option>';
                                    city += '<option id="' + content._id + '" value="' + content._id + '">' + content.cityname + '</option>';
                                    $("#city1").append(city);
                                    console.log(result.foundData.City === undefined);
                                }
                                else {
                                    var city = '';
                                    city += '<option id="' + content._id + '" value="' + content._id + '" ' + ((content._id === result.foundData.City._id) ? 'selected' : '') + '>' + content.cityname + '</option>';
                                    $("#city1").append(city);
                                }

                            });
                        }
                    });
                }
                else {
                    //console.log("here")
                }
                // console.log(stateHtml);
            });
        });
        //alert(state_id);
    });



    //Update Client
    $(document).on("click", ".updateRecord", function(e) {
        e.preventDefault();
        var id = $(this).attr("id");
        editClients(id);
    });

    function editClients(id) {
        var data = {};
        data.cfirst_name = $("#cfirst_name1").val();
        data.clast_name = $("#clast_name1").val();
        data.cfull_name = $("#cfull_name1").val();
        data.cpnum = $("#cpnum1").val();
        data.cemail = $("#cemail1").val();
        data.address = $("#address1").val();
        data.state = $("#state1").val();
        data.city = $("#city1").val();
        data.zipcode = $("#zipcode1").val();
        data.tax = $("#tax1").val();
        data.passport = $("#passport1").val();
        data.fax = $("#fax1").val();
        data.ssn = $("#ssn1").val();

        $.post("/client/" + id + "/edit?_method=PUT", { data: data }, function(result) {
            location.reload();
            //console.log(result);
        });
    }



    //close modal
    $('#closemodal').on('click', function() {

        $("#state").html("<option>Select a state</option>");
        $("#city").html("<option>Select a city</option>");
        clearInputs();

    });

    function clearInputs() {

        $("#cfirst_name").val('');
        $("#clast_name").val('');
        $("#cfull_name").val('');
        $("#cpnum").val('');
        $("#cemail").val('');
        $("#address").val('');
        $("#zipcode").val('');
        $("#tax").val('');
        $("#passport").val('');
        $("#fax").val('');
        $("#ssn").val('');
    }





});
