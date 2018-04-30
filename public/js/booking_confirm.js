
$(document).ready(function(){

//get client data
$('.newFormBtn').on('click', function(){
    //ajax call
    
    $.get("/clientsAjax", function(data) {
          data.forEach(function(content) {
            var clientdropdown = '';
            clientdropdown += '<option id="'+ content._id +'" value="'+ content._id +'">'+ content.full_name +'</option>';
            $("#clientdropdown").append(clientdropdown);
           console.log(clientdropdown);
          });
    });
         
});



//get cosignee 
$(document).on('change', '#clientdropdown', function(){
  var client_id = $(this).val();
  // alert(client_id);
  //get cosignee data
    $.get("/cosigneeDropdownData/"+client_id , function(data) {
          if(data.length === 0 ) {
                $("#consigneedropdown").html("<option>Select a Consignee</option>");
          } else {
              data.forEach(function(content) {
                var consigneedropdown = '';
                consigneedropdown += '<option id="'+ content._id +'" value="'+ content._id +'">'+ content.full_name +'</option>';
                $("#consigneedropdown").append(consigneedropdown);
              // console.log(content);
              });
          }
     });
  
    
   
}); 

           


$(document).on("click", ".next_22", function() {
     $(".section1").fadeOut();
     $(".section2").fadeIn();
   
     
});

$(document).on("click", ".next_1", function() {
     $(".section1").fadeOut();
     $(".section2").fadeIn();
    
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

  data.vessel_name = $("#vessel_name").val();
  data.voyage_number = $("#voyage_number").val();
  data.booking_number = $("#booking_number").val();
  data.equipment_size = $("#equipment_size").val();
  data.total_number_of_container = $("#total_number_of_container").val();
  data.loading_terminal = $("#loading_terminal").val();
  data.commodity_des = $("#commodity_des").val();
  data.carrier = $("#carrier").val();
  
  
  
  
  data.cut_off_date = $("#cut_off_date").val();
  data.sail_date = $("#sail_date").val();
  data.arrival_date = $("#arrival_date").val();
  data.return_depot = $("#return_depot").val();
  data.pickup_terminal = $("#pickup_terminal").val();
  data.place_of_recript = $("#place_of_recript").val();
  
  data.port_of_loading = $("#port_of_loading").val();
  data.port_of_discharge = $("#port_of_discharge").val();
  data.place_of_delivery = $("#place_of_delivery").val();
  
  data.rate = $("#rate").val();
  data.notes = $("#notes").val();
  
  
   
  
  $.ajax({
      type: 'POST',
			url: '/b_c/new',
			data: data,
			success: function(data){
			   // console.log(data);
			    location.reload();
			},
			error: function(){
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

  data.vessel_name = $("#vessel_name").val();
  data.voyage_number = $("#voyage_number").val();
  data.booking_number = $("#booking_number").val();
  data.equipment_size = $("#equipment_size").val();
  data.total_number_of_container = $("#total_number_of_container").val();
  data.loading_terminal = $("#loading_terminal").val();
  data.commodity_des = $("#commodity_des").val();
  data.carrier = $("#carrier").val();
  
  
  
  
  data.cut_off_date = $("#cut_off_date").val();
  data.sail_date = $("#sail_date").val();
  data.arrival_date = $("#arrival_date").val();
  data.return_depot = $("#return_depot").val();
  data.pickup_terminal = $("#pickup_terminal").val();
  data.place_of_recript = $("#place_of_recript").val();
  
  data.port_of_loading = $("#port_of_loading").val();
  data.port_of_discharge = $("#port_of_discharge").val();
  data.place_of_delivery = $("#place_of_delivery").val();
   
  data.rate = $("#rate").val();
  data.notes = $("#notes").val();
  
  $.ajax({
      type: 'POST',
			url: '/b_c/new',
			data: data,
			success: function(data){
			   // console.log(data);
			    window.location.href="/bc/"+data._id+"/email/"+data.Client;
			},
			error: function(){
				alert("Something went wrong");
			}
  });
   
    
});


//get  id
$(document).on('click', '.deleteMessage1', function(){
  var id = $(this).attr("id");
    $(".delete1").attr("id",id);
    
  //alert(state_id);
});

//delete Client
$(document).on('click', '.delete1', function(){
  var id = $(this).attr("id");
   
    $.post("/bc/"+id+"/delete?_method=DELETE", function(result) {
        
        location.reload();
         
  });
  //alert(state_id);
});



//display bc per clients
$("#clients_dropdown").on('change', function() {
  var id = $(this).val();
  //display loader
  $(".loader").css("display","block");
  //clear table data and wait for new data from server
  $(".table_body").html("");
    //ajax call to display data
     $.get('/bc/'+ id +'/fetch_perclient', function(result) {
         $(".table_body").html('');
         console.log(result.length);
     if(result.length !== 0 ) {
          result.forEach(function(content) {
              //display data
              var html = '';
                  html += '<tr id="rowID">';
                  html += '<td>'+(moment.parseZone(content.createdAt).format('l') === moment.parseZone(new Date()).format('l') ? 'Today': moment(content.createdAt).format("ll"))+'</td>';
                  html += '<td>'+content.Client[0].full_name+'</td>';
                  html += '<td>'+content.vessel_name+'</td>';
                  html += '<td>'+content.booking_number+'</td>';
                  html += '<td>'+content.voyage_number+'</td>';
                  html += '<td>';
                  html += '<a class="btn btn-outline-dark btn-sm" href="/bc/'+content._id+'/email/'+content.Client[0]._id+'"><i class="fas fa-envelope-open"></i> Email</a>';
                  html += ' <a class="btn btn-outline-info btn-sm openEditModal" href="/bc/'+content._id+'/editRoute"><i class="far fa-edit"></i> Edit</a>';
                  html += ' <button class="btn btn-outline-danger btn-sm deleteMessage1" id="'+content._id+'" data-toggle="modal" data-target=".deleteMessageModal1"><i class="far fa-trash-alt"></i> Delete</button>';
                  html += '</td>';
                  html += '</tr>';
                  $(".table_body").append(html);
                  //remove loader
                  $(".loader").css("display","none");
                  $(".nodata").css("display","none");
            //   console.log(content.Client[0].full_name);
              console.log(content);
             
              
          });
     } else {
          $(".nodata").css("display","block");
          $(".loader").css("display","none");
     }
          
  });
});
     

});