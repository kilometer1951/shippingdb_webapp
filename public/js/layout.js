$(document).ready(function(){
   
//open and close drop down and actions
$('#navbarDropdown_4').on('click', function(e){
    e.stopPropagation(); 
    $('#dropdown_menu_4').toggle();
    
    //close other menus
    $('#dropdown_menu_3').css("display", "none");
    $('#dropdown_menu_2').css("display", "none");
    $('#dropdown_menu_1').css("display", "none");
});

$('#navbarDropdown_3').on('click', function(e){
    e.stopPropagation(); 
    $('#dropdown_menu_3').toggle();
    
    //close other menus
    $('#dropdown_menu_4').css("display", "none");
    $('#dropdown_menu_2').css("display", "none");
    $('#dropdown_menu_1').css("display", "none");
});



$('#navbarDropdown_2').on('click', function(e){
    e.stopPropagation(); 
    $('#dropdown_menu_2').toggle();
    
    //close other menus
    $('#dropdown_menu_4').css("display", "none");
    $('#dropdown_menu_3').css("display", "none");
    $('#dropdown_menu_1').css("display", "none");
});


$('#navbarDropdown_1').on('click', function(e){
    e.stopPropagation(); 
    $('#dropdown_menu_1').toggle();
    
    //close other menus
    $('#dropdown_menu_4').css("display", "none");
    $('#dropdown_menu_3').css("display", "none");
    $('#dropdown_menu_2').css("display", "none");
});





//close any open menu
$(document).click(function(){
    $('#dropdown_menu_4').css("display", "none");
    $('#dropdown_menu_3').css("display", "none");
    $('#dropdown_menu_2').css("display", "none");
    $('#dropdown_menu_1').css("display", "none");
    
    
});







//logout
 $('.logoutDiv').on('click', function(){
     
    window.location.href = "/logout";
 });
  


});