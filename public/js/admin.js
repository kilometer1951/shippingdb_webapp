

 var imageLoader = document.getElementById('filename_1');
 imageLoader.addEventListener('change', handleImage, false);

 function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function(event) {
   $('#img').attr('src', event.target.result);
  }
  reader.readAsDataURL(e.target.files[0])
 }








 $(document).on("click", ".addcountry", function() {
  $.post("/newCountry/" + $("#countryname").val(), function(data) {
   $("#countryname").val("");
   var html = '';
   html += '<tr>';
   html += '<td>' + data.countryname + '</td>';
   html += ' <td>';
   html += '<button class="btn btn-success btn-sm editcountry" id="' + data._id + '"><i class="fas fa-pencil-alt"></i> Edit</button> ';
   html += '<button class="btn btn-danger btn-sm del_country" id="' + data._id + '"><i class="far fa-trash-alt"></i> Delete</button>';
   html += ' </td>';
   html += '</tr>';

   $(".country_table_body").prepend(html)
  });

 });


 $(document).on('click', '.editcountry', function() {
  var id = $(this).attr("id");
  //rename buttons class and id and button text
  //put id

  $(".addcountry").text("Update");

  $(".addcountry").addClass("updateCountry");
  $(".updateCountry").attr("id", id);
  $(".addcountry").removeClass("addcountry");
  $.get("/getcontryname/" + id, function(data) {
   $("#countryname").val(data.countryname)
  });
  // console.log($(".updateCountry").attr("class"))

 });

 $(document).on('click', '.updateCountry', function() {
  var id = $(this).attr("id");
  $.post("/edit/" + $("#countryname").val() + "/" + id + "/country", function(data) {
   location.reload();
  });

 });

 $(document).on('click', '.del_country', function() {
  var id = $(this).attr("id");

  $.post("/delete/" + id + "/country", function(data) {
   location.reload();
  });
  // console.log($(".updateCountry").attr("class"))

 });





 $(document).on("click", ".addstates", function() {
  $.post("/newstate/" + $("#states").val() + "/" + $("#country_dropdown").val(), function(data) {
   $("#states").val("");
   var html = '';
   html += '<tr>';
   html += '<td>' + data.statename + '</td>';
   html += ' <td>';
   html += '<button class="btn btn-success btn-sm editstates" id="' + data._id + '"><i class="fas fa-pencil-alt"></i> Edit</button> ';
   html += '<button class="btn btn-danger btn-sm del_states" id="' + data._id + '"><i class="far fa-trash-alt"></i> Delete</button>';
   html += ' </td>';
   html += '</tr>';

   $(".states_table_body").prepend(html)
  });

 });

 $(document).on('click', '.editstates', function() {
  var id = $(this).attr("id");
  //rename buttons class and id and button text
  //put id

  $(".addstates").text("Update");

  $(".addstates").addClass("updateState");
  $(".updateState").attr("id", id);
  $(".addstates").removeClass("addstates");
  $.get("/getstatename/" + id, function(result) {

   $("#states").val(result.States.statename);

   //get countries
   //clear data first
   $("#country_dropdown").html("")
   result.Country.forEach(function(data) {
    var countryhtml = '';
    countryhtml += '<option value="' + data._id + '" ' + (data._id === result.States.Country ? "selected" : "") + '>' + data.countryname + '</option>';
    $("#country_dropdown").append(countryhtml);

   });


  });

 });


 $(document).on('click', '.updateState', function() {
  var id = $(this).attr("id");
  $.post("/edit/" + $("#states").val() + "/" + $("#country_dropdown").val() + "/" + id + "/state", function(data) {
   location.reload();
  });

 });


 $(document).on('click', '.del_states', function() {
  var id = $(this).attr("id");

  $.post("/delete/" + id + "/state", function(data) {
   location.reload();
  });
  // console.log($(".updateCountry").attr("class"))

 });


 $(document).on("click", ".addcities", function() {
  $.post("/newcity/" + $("#city").val() + "/" + $("#state_dropdown").val(), function(data) {
   $("#city").val("");
   var html = '';
   html += '<tr>';
   html += '<td>' + data.cityname + '</td>';
   html += ' <td>';
   html += '<button class="btn btn-success btn-sm editcity" id="' + data._id + '"><i class="fas fa-pencil-alt"></i> Edit</button> ';
   html += '<button class="btn btn-danger btn-sm del_city" id="' + data._id + '"><i class="far fa-trash-alt"></i> Delete</button>';
   html += ' </td>';
   html += '</tr>';

   $(".city_table_body").prepend(html)
  });

 });



 $(document).on('click', '.del_city', function() {
  var id = $(this).attr("id");

  $.post("/delete/" + id + "/city", function(data) {
   location.reload();
  });
  // console.log($(".updateCountry").attr("class"))

 });



 $(document).on('click', '.editcity', function() {
  var id = $(this).attr("id");
  //rename buttons class and id and button text
  //put id

  $(".addcities").text("Update");

  $(".addcities").addClass("updateCity");
  $(".updateCity").attr("id", id);
  $(".addcities").removeClass("addcities");
  $.get("/getcity/" + id, function(result) {

   $("#city").val(result.Cities.cityname);

   //get countries
   //clear data first
   $("#state_dropdown").html("")
   result.States.forEach(function(data) {
    var statehtml = '';
    statehtml += '<option value="' + data._id + '" ' + (data._id === result.Cities.States ? "selected" : "") + '>' + data.statename + '</option>';
    $("#state_dropdown").append(statehtml);

   });


  });

 });


 $(document).on('click', '.updateCity', function() {
  var id = $(this).attr("id");
  $.post("/edit/" + $("#city").val() + "/" + $("#state_dropdown").val() + "/" + id + "/city", function(data) {
   location.reload();
  });

 });
 