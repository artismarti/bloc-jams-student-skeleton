$(document).ready(function() {
  $(".hero-content h3").click(function(){
    var subText = $(this).text();
    $(this).text(subText + "!");
  });

var onHoverAction = function(event) {
  console.log("Hover Action Triggered")
    $(this).animate({"margin-top": "10px"});
}

var offHoverAction = function(event) {
  console.log("Off-hover Action Triggered");
  $(this).animate({"margin-top": "0px"});
}

$(".selling-points .point").hover(onHoverAction, offHoverAction);
});