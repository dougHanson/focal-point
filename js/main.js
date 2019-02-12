   
    // DOUG  image sources for testing only
    var imgSrc = 'img/image@3x.jpg';
    //var imgSrc = 'img/teacher.jpg';
    //var imgSrc = 'img/students.jpg';
    var imgSrc = 'img/couple@3x.jpg';
    //var imgSrc = 'img/tree.jpg';    
    //var imgSrc = 'img/street.jpg';
    //var imgSrc = 'img/ocean.jpg';
    //var imgSrc = 'img/mountain.jpg';
    //var imgSrc = 'img/hills.jpg';
    
    $('.js-output, .uploaded').attr('src', imgSrc); // set images

    
    // VARIABLES
    var gridSize = 7; //must be a SQUARE grid, eg 10 = 10x10
    var gridImg = $('.js-grid'); //the grid image will be placed on top of the uploaded image //#DOUG: make this CSS, not image
    var uploadImg = $('.uploaded'); //the uploaded image element
    var imgWidth = uploadImg.width(); //width of the uploaded image
    var imgHeight = uploadImg.height(); //height of uploaded image
    var squareWidth = imgWidth / gridSize; //how wide each square is on the grid is determined by image size
    var squareHeight = imgHeight / gridSize; //how tall each square is on the grid is determined by image size
    var squareClicked = [gridSize / 2, gridSize / 2]; //needs global scope for resize event, half gridsize = middle of pic by default
    var positionX = 0; //px margin that image will be pulled to the LEFT
    var positionY = 0; //px margin that image will be pulled to the TOP

    //get unique identifier of each image to use in storage/database
    var imgId = $('.uploaded').attr('src');
    
    //object to save focal points in for each image
    var imgMargins = JSON.parse(localStorage.getItem('imgMargins')) || {}; //create empty object if doesn't already exist
    var tmp = {}; //temp object just to satisfy IE

var test = {};

    //var variant = {};  //dont do this
    var variantName;
    var isVariant = false;


    //  SAVE ()
    // save image focal point into local storage
    function saveImgMargins() {
      

      //make clicked box green
      $('.js-box').css({ 'background-color': '#00ff00' });
      $('.js-box').html('<span class="tick" style="position: relative; left:'+((squareWidth-6)/2)+'px; top:'+((squareHeight-20)/2)+'px;">&#10004;</span>');

      if (isVariant) {
        test[variantName] = { 
          "X": squareClicked[0],
          "Y": squareClicked[1],
          "grid": gridSize  
        };
        //$.extend(variant, test);
        
        //if (imgId.length) {
        if (imgId.length) {
          tmp[imgId] = {
            "X": tmp[imgId].X,
            "Y": tmp[imgId].Y,
            "grid":  tmp[imgId].grid,
            "variants": test
          };
          $.extend(imgMargins, tmp); // must be done this way to satisfy IE
          localStorage.setItem('imgMargins', JSON.stringify(imgMargins));
        }        
      }
      
      else {
        //add new focal points to existing object
        if (imgId.length) {
          tmp[imgId] = {
            "X": squareClicked[0],
            "Y": squareClicked[1],
            "grid": gridSize,
            "variants": tmp[imgId].variants
          };
          $.extend(imgMargins, tmp); // must be done this way to satisfy IE
          localStorage.setItem('imgMargins', JSON.stringify(imgMargins));
        }
      }

      //get saved focal point for image
      var obj = JSON.parse(localStorage.getItem('imgMargins'));
      console.log(obj);
      // console.log(variant);
      
      $('.js-saved').html('<span style="background: #DEF2D6; color: darkgreen; padding: 6px 12px;">&#10004; Saved focal point:  ' + obj[imgId].X + ' , ' + obj[imgId].Y + '</span>');

    } // end saveImgMargins()



    //  LAYGRID ()
    //overlay grid image - squash it to fit the image shape
    //this is called on doc load and window resize so it always fits image
    function layGrid() {
      $('.js-grid').html(''); //clear the grid to start
      
      //get dimensions of uploaded image
      imgWidth = uploadImg.width();
      imgHeight = uploadImg.height();
      
      //how wide/high each square is on the grid is determined by image size
      squareWidth = imgWidth / gridSize;
      squareHeight = imgHeight / gridSize;

      //draw the grid one square at a time
      for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
          $('.js-grid').append("<div style='border-right: 1px solid #000; border-bottom: 1px solid #000; float: left; height:" + (squareHeight) + "px; width:" + (squareWidth) + "px;'>&nbsp;</div>"); // deduct part of pixel to ensure grid always smaller than image, even with borders
        }
        $('.js-grid').append("<div style='clear: both; '></div>"); //newline
      }

       //reset the box (not the selection)
       $('.js-box').css({ 'top': 0, 'left': 0, 'opacity': 0 });

    } //end layGrid()



    //  GETGRIDSIZE ()
    //get gridsize from entered input, then redraw grid
    var getGridSize = function() {
      gridSize = $('.js-input').val();
      if (gridSize <= 50 && gridSize >= 2) {
        layGrid();
      }
      else { 
        alert('Please enter a value between 2 and 50'); 
      }
    }; //end gridSize()



    //  CALCSQUARECLICKED ()
    //when a square on the grid is clicked, get it's x and y offset within its bounding container
    //divide it by width of one square to return it as a multiple of grid squares, then round that value to the nearest integer        
    function calcSquareClicked(e) {
      var offset = gridImg.offset();
      var scrollTop = $(window).scrollTop();

      squareWidth = imgWidth / gridSize; //how wide each square is on the grid is determined by image size
      squareHeight = imgHeight / gridSize;
      squareClicked = []; // gotta reset this so values are cleared b4 new values pushed
      var squaresX = (e.clientX - offset.left) / squareWidth ;
      var squaresXInt = parseInt(squaresX);

      var squaresY = (e.clientY + scrollTop - offset.top) / squareHeight;
      var squaresYInt = parseInt(squaresY);

      // push x and y square into array
      squareClicked.push(squaresXInt, squaresYInt);

      //draw a box the size of one square to show which area was clicked, using value from above calc
      $('.js-box').css({
        'height': squareHeight,
        'width': squareWidth,
        'top': parseInt(squaresY) * squareHeight,
        'left': parseInt(squaresX) * squareWidth,
        'opacity': 0.66
      });

    } // end calcSquareClicked()


    //  CALCMARGINS ()
    //calculate margins based on wrapping container dimensions
    function calcMargins(focal) {
      //if we're passing a saved focal point through, use that instead
      if (focal != undefined) {
        squareClicked[0] = focal.X;
        squareClicked[1] = focal.Y;        
      }

      //for each output image, get the container height and width and calc margins
      $('.js-output').each(function() {
        var outputContainerWidth = $(this).parent().width();
        var outputContainerHeight = $(this).parent().height();
        
        var containerClass = $(this).parent().attr('class');
        //if (focal.variant) {
         // alert(imgId);
        //}

        
        //ensure image fills its container correctly, depending on dimensions of both
        //ideally, these styles will be defined within css of the theme - this is merely for the output testing
        //DOUG : tie this zoom to gridSize??
        if (outputContainerWidth > outputContainerHeight) {
          $(this).css({'width': '120%', 'min-height': '100%', 'height': 'auto', 'min-width': 'auto'});
          if ( $(this).height() <= outputContainerHeight ) {
            $(this).css({'width': 'auto', 'min-height': 'auto', 'height': '120%', 'min-width': '100%'});
          }
        }
        else { $(this).css({'height': '120%', 'min-width': '100%', 'width': 'auto', 'min-height': 'auto'}); }

        //how many px we have to pull the image
        var playX = $(this).width() - outputContainerWidth;
        var playY = $(this).height() - outputContainerHeight;

        //how much we move the image is the number of squares as a % of play
        //For example, if we have a 900px image and a 300px container, the play will be 900px - 300px = 600px play. 
        //If the grid has 12 squares, moving it 3 squares will pull image 3/12 * 600px = 150px.
        positionX = (((squareClicked[0]) * (1 / (gridSize - 1))) * playX);
        positionY = (((squareClicked[1]) * (1 / (gridSize - 1))) * playY); 

        //prob not needed, just ensures img never goes beyond boundaries
        if (positionX > playX) { positionX = playX; }
        if (positionY > playY) { positionY = playY; }

        //these are basically the values that will need to be calculated and applied to each image on page load & resize
        $(this).css({ 'margin-left': -positionX, 'margin-top': -positionY });
      });

    } // end calcMargins()



    //  UPLOADFILE ()
    //gets file from hdd and uploads into container
    function uploadFile() {
      var preview = document.querySelector('.uploaded'); //selects the query
      var file = document.querySelector('input[type=file]').files[0]; //sames as here
      var reader = new FileReader();

      reader.onloadend = function() {
        preview.src = reader.result;
      };

      if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
      } 
      else {
        preview.src = "";
      }
       
      //set small delay to ensure images have resized before recalc of margins
      setTimeout(function() {
        layGrid();
        $('.js-output, .uploaded').attr('src', preview.src);
        imgId = $('.uploaded').attr('src');
        var obj = JSON.parse(localStorage.getItem('imgMargins'));
        calcMargins(obj[imgId]);
      }, 200);

    } // end uploadFile()



    //  ONCLICK ()
    //when a focal point is clicked 
    gridImg.on('click', function(e) {

      //color the box they clicked red
      $('.js-box').css({ 'background-color': '#ff0000' });
      $('.js-box').html('');

      //get which square user clicked on
      calcSquareClicked(e);      
      $('.js-selected').html('Current selection: ' + squareClicked[0] + ' , ' + squareClicked[1]);      

      //then calc margins and apply them
      calcMargins();

    }); // end onClick | grid

    //when a variant is clicked 
    $('.output').on('click', function(e) {

      variantName =  $(this).attr('class').replace('output ','');
      $('body, html').animate({scrollTop: 0}, 200);
      $('.js-variantMsg').html('Selecting focal for ' + variantName).show();
      isVariant = true;
      //variant.push(variantName);

    }); // end onClick | variant




    //on doc load and window resize, refit the grid and recalc the margins based on new container width
    $(window).on("load resize", function(e) {    
      
      //initialise
      setTimeout(function() {
        layGrid();
        calcMargins();
      }, 200);
      
       //if image is already saved, load saved focal point
      if (imgId.length) {
        var obj = JSON.parse(localStorage.getItem('imgMargins'));
        
        //only calcMargins if the image has a set focal point, otherwise will just default to centre of image
       // if (obj[imgId].length && obj.hasOwnProperty(imgId)) {
          console.log(obj);
        //console.log(variant);

          //set small delay to ensure images have resized before recalc of margins
          setTimeout(function() {
            calcMargins(obj[imgId]);
          }, 200);
        //}
      }
    });