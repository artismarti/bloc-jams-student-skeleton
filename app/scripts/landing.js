$(document).ready(function() { 
    $('.hero-content h3').click(function(){
      var subText = $(this).text();
       $(this).text(subText + "!");
    });
 
   var onHoverAction = function(event) {
     console.log('Hover action triggered.');
     $(this).animate({'margin-top': '10px'});
   };
 
   var offHoverAction = function(event) {
     console.log('Off-hover action triggered.');
     $(this).animate({'margin-top': '0px'});
   };

  var onTurnHover = function(event) {
    console.log("Turn colour on");
    $(this).css("color", "red");
  }

  var offTurnHover = function(event) {
    console.log("Turn colour off");
    $(this).css("color", "white");
  }

  $('.selling-points .point').hover(onHoverAction, offHoverAction);
  $('.hero-content h3').hover(onTurnHover, offTurnHover);
  $('.logo').click(function() {
      $('.logo').fadeOut("slow", function() {
        console.log("Fade");
      });
  });
  });