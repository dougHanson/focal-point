    var squareClicked = [];
    var gridSize;
    var imgId;

    // CALCMARGINS()
    function calcMargins(focal) {
      $('.js-output').each(function() {       
        imgId = $(this).attr('src');
        
        //if (!$.isEmptyObject(focal)) {
        if (focal[imgId] != undefined) {
          squareClicked[0] = focal[imgId].X;
          squareClicked[1] = focal[imgId].Y;
          gridSize = focal[imgId].grid;
        }
        //default to centre if focal point not set
        else {                    //  _____________
          squareClicked[0] = 1;   //  |_0_|___|___| 
          squareClicked[1] = 1;   //  |___|_X_|___|
          gridSize = 3;           //  |___|___|_2_|
        }

        var outputContainerWidth = $(this).parent().width();
        var outputContainerHeight = $(this).parent().height();
        var playX = $(this).width() - outputContainerWidth;
        var playY = $(this).height() - outputContainerHeight;
        var positionX = (((squareClicked[0]) * (1 / (gridSize - 1))) * playX);
        var positionY = (((squareClicked[1]) * (1 / (gridSize - 1))) * playY);

        
        //ensure image fills its container correctly, depending on dimensions of both
        //ideally, these styles will be defined within css of the theme - this is merely for the output testing
        //DOUG : tie this zoom to gridSize??
        if (outputContainerWidth > outputContainerHeight) {
          $(this).css({'min-height': '100%', 'height': 'auto', 'min-width': '100%'});
          if ( $(this).height() <= outputContainerHeight ) {
            $(this).css({'width': 'auto', 'min-height': 'auto', 'min-width': '100%'});
          }
        }
        else { $(this).css({'height': '120%', 'min-width': '100%', 'width': 'auto', 'min-height': 'auto'}); }
        
        
        if (positionX > playX) { positionX = playX; }
        if (positionY > playY) { positionY = playY; }
        
       $(this).css({ 'margin-left': -positionX, 'margin-top': -positionY });

       setTimeout(function() {
         $('img').css({'opacity': 1});
       }, 200);
        
      });
      
      //once all calcs finished, show images. This removes FOUC

    }


    $(window).on("load resize", function(e) {

      //get stored focal points - set to null if nothing defined
      var obj = JSON.parse(localStorage.getItem('imgMargins')) || {};

      //set small delay to ensure images have resized before recalc of margins
      setTimeout(function() {
        calcMargins(obj);
      }, 200);

      console.log(obj);
    });