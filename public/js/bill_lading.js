$(document).ready(function() {

    //get client data
    $(document).on('click', '.newFormBtn', function() {
        //ajax call
        var id = $(this).attr("id");

        $(".createForm").attr("id", id);
        $(".createFormAndEmail").attr("id", id);
    });



    // //submit data
    $(document).on("click", ".createForm", function() {
        //get inputs
        var data = {};
        data.id = $(this).attr("id");

        data.description_of_charges = $("#description_of_charges").val();
        data.destination_agent = $("#destination_agent").val();
        data.co_loaded_with = $("#co_loaded_with").val();
        data.total_pre_paid = $("#total_pre_paid").val();
        data.total_collected = $("#total_collected").val();
        data.containerlized = $('input:radio[name=containerlized]:checked').val();
        $.ajax({
            type: 'POST',
            url: '/bill_of_lading/new',
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




    //display bill of lading per clients
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
                    html += '<td>' + (moment.parseZone(content.bill_of_lading_date).format('l') === moment.parseZone(new Date()).format('l') ? 'Today' : moment(content.bill_of_lading_date).format("ll")) + '</td>';
                    html += '<td>' + content.Client[0].full_name + '</td>';
                    html += '<td>' + content.container_num + '</td>';
                    html += '<td>' + (content.bill_of_lading_status !== "" ? "Created" : "Pending") + '</td>';
                    html += '<td>';
                    if (content.bill_of_lading_status === "") {
                        html += 'button class="btn btn-outline-primary btn-sm newFormBtn" data-toggle="modal" data-target="#bill_of_ladingForm" id="' + content._id + '"><i class="fab fa-wpforms"></i> New Bill of Lading</button>';
                    }
                    html += '<a class="btn btn-outline-success btn-sm" href="/d_r_2/' + content._id + '/email/' + content.Client[0]._id + '/cargo/' + content.Cargo + '/consignee/' + content.Consignee + '/booking_c/' + content.BookingConfirmation + '"><i class="fas fa-envelope-open"></i> Email</a>';
                    html += ' <a class="btn btn-outline-info btn-sm " href="/bill_of_lading/' + content._id + '/editRoute"><i class="far fa-edit"></i> Edit</a>';
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
