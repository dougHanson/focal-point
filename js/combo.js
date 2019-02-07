    var squareClicked = [];
    var gridSize;
    var imgId;

    // CALCMARGINS()
    function calcMargins(focal) {
      $('.js-output').each(function() {       
        imgId = $(this).attr('src');
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

        if (positionX > playX) { positionX = playX; }
        if (positionY > playY) { positionY = playY; }

        $(this).css({ 'margin-left': -positionX, 'margin-top': -positionY });
      });
      
      //once all calcs finished, show images. This removes FOUC
      setTimeout(function() {
        $('img').show();
      }, 200);
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