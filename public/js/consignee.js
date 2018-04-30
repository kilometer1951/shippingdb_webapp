function getClients(value) {
    if (value !== "") {
        $(".client_table_body").html("");
        //ajax call
        $.post("/consignees/searchQ", { data: value }, function(dataFound) {
            //   console.log(dataFound);
            if (dataFound.length !== 0) {
                $(".client_table_body").html("");
                dataFound.forEach(function(result) {
                    var client_table = '';

                    client_table += '<tr>';
                    client_table += '<td>' + result.first_name + '</td>';
                    client_table += '<td>' + result.pnum + '</td>';
                    client_table += '<td>' + result.email + '</td>';
                    client_table += '<td>' + result.address + '</td>';
                    client_table += '<td>';
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
        $.get("/consigneeAjax", function(data) {
            $(".client_table_body").html("");
            data.forEach(function(result) {
                var client_table = '';

                client_table += '<tr>';
                client_table += '<td>' + result.first_name + '</td>';
                client_table += '<td>' + result.pnum + '</td>';
                client_table += '<td>' + result.email + '</td>';
                client_table += '<td>' + result.address + '</td>';
                client_table += '<td>';
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




    //get country and client data
    $('.newClient').on('click', function() {
        //ajax call

        $.get("/displayDropdowndataForConsignee", function(data) {
            data.countries.forEach(function(content) {
                var countries = '';
                countries += '<option id="' + content._id + '" value="' + content._id + '">' + content.countryname + '</option>';
                $("#country").append(countries);
                //  console.log(countries);
            });
            data.clients.forEach(function(content) {
                var clientdropdown = '';
                clientdropdown += '<option id="' + content._id + '" value="' + content._id + '">' + content.full_name + '</option>';
                $("#clientdropdown").append(clientdropdown);
                //  console.log(countries);
            });
        });

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
        data.cfull_name = $("#cfirst_name").val() + ' ' + $("#clast_name").val();
        data.cpnum = $("#cpnum").val();
        data.cemail = $("#cemail").val();
        data.address = $("#address").val();
        data.state = $("#state").val();
        data.city = $("#city").val();
        data.careof = $("#careof").val();
        data.postalcode = $("#postalcode").val();
        data.client = $("#clientdropdown").val();
        data.country = $("#country").val();

        $.post("/consignee/new", { data: data }, function(result) {
            clearInputs();
            //display data
            var client_table = '';

            client_table += '<tr>';
            client_table += '<td>' + result.first_name + '</td>';
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

        $.post("/consignees/" + id + "/delete?_method=DELETE", function(result) {

            location.reload();

        });
        //alert(state_id);
    });




    //open edit modal
    $(document).on('click', '.openEditModal', function() {
        var id = $(this).attr("id");

        $(".updateRecord").attr("id", id);

        $.get("/openEditModal_Consignees/" + id, function(result) {
            var editModalData = '';



            editModalData += '<form>';
            editModalData += '<div class="row " style=" background-color:#e0f2f1; padding:10px;">';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="clientdropdown">Client</label>';
            editModalData += '<select class="form-control" id="clientdropdown1" name="clientdropdown1"> </select>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-8">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="cfirst_name">First Name</label>';
            editModalData += '<input class="form-control" name="cfirst_name1" id="cfirst_name1" value="' + result.foundData.first_name + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="row"  style=" background-color:#ffe082 ; padding:10px;">';
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
            editModalData += '<label for="careof">Care Of</label>';
            editModalData += '<input class="form-control" name="careof1" id="careof1" value="' + result.foundData.careof + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="row"  style=" background-color:#c5e1a5 ; padding:10px;">';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="country">Country</label>';
            editModalData += '<select class="form-control" id="country1" name="country1"></select>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="address">Address</label>';
            editModalData += '<input class="form-control" name="address1" id="address1" value="' + result.foundData.address + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-4">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="state">State</label>';
            editModalData += '<input class="form-control" name="state1" id="state1" value="' + result.foundData.state + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="row"  style=" background-color:#a5d6a7; padding:10px;">';
            editModalData += '<div class="col-md-3">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="city">City</label>';
            editModalData += '<input class="form-control" name="city1" id="city1" value="' + result.foundData.city + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '<div class="col-md-3">';
            editModalData += '<div class="form-group">';
            editModalData += '<label for="postalcode">Postal Code</label>';
            editModalData += '<input class="form-control" name="postalcode1" id="postalcode1" value="' + result.foundData.postalcode + '">';
            editModalData += '</div>';
            editModalData += '</div>';
            editModalData += '</div>';

            editModalData += '</form>';

            $("#editmodal_body").html(editModalData);

            //append Clients and countries
            result.client.forEach(function(data) {
                var clientdropdown = '';
                clientdropdown += '<option value="' + data._id + '" ' + ((data._id === result.foundData.Client._id) ? 'selected' : '') + '>' + data.full_name + '</option>';
                $("#clientdropdown1").append(clientdropdown);
                console.log(clientdropdown);

            });
            result.country.forEach(function(data) {
                var country = '';
                country += '<option value="' + data._id + '" ' + ((data._id === result.foundData.Country._id) ? 'selected' : '') + '>' + data.countryname + '</option>';
                $("#country1").append(country);
                console.log(country);

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
        data.cfull_name = $("#cfirst_name1").val() + ' ' + $("#clast_name1").val();
        data.cpnum = $("#cpnum1").val();
        data.cemail = $("#cemail1").val();
        data.address = $("#address1").val();
        data.state = $("#state1").val();
        data.city = $("#city1").val();
        data.careof = $("#careof1").val();
        data.postalcode = $("#postalcode1").val();
        data.client = $("#clientdropdown1").val();
        data.country = $("#country1").val();

        $.post("/consignees/" + id + "/edit?_method=PUT", { data: data }, function(result) {
            location.reload();
            //console.log(result);
        });
    }



    //close modal
    $('#closemodal').on('click', function() {

        $("#country").html("<option>Select a country</option>");
        $("#clientdropdown").html("<option>Select a client</option>");
        clearInputs();

    });

    function clearInputs() {

        $("#cfirst_name").val('');
        $("#clast_name").val('');
        $("#cpnum").val('');
        $("#cemail").val('');
        $("#address").val('');
        $("#careof").val('');
        $("#state").val('');
        $("#city").val('');
        $("#postalcode").val('');
    }





});
