/*
* if you feel the world is such a mean and unwelcoming place to live, use this code to make a picture showing the cruedness of the world look nice and comfortable!
*/

var img;
var path = 'fileName'; //<- insert the file path of the picture you want to look nicer!
var colorArray = [];

var i, c;

// change this variables to your preferred color sheme! Choose colors, that make you feel good and loved
var hsvFrom1 = 290;
var hsvTo1 = 50;    
var hsvFrom2 = 290;
var hsvTo2 = 50;

let classifier;

function preload() {
  img = loadImage(path+'.jpg');
  classifier = ml5.imageClassifier('MobileNet');
  colorArray1 = generateValueArray(hsvFrom1, hsvTo1);
  colorArray2 = generateValueArray(hsvFrom2, hsvTo2);
  print(colorArray1);
}

function setup() {
  createCanvas(img.width, img.height + 40);
  noLoop();
}

function draw() {
  background(255);
  img.loadPixels();

  var avgImage = round(arrayavg(img.pixels));
  
  var copyPixelsLengthStart = 10;
  var copyPixelsLength = 10;
  var copyRounds = 1;

  for (var currenRound = 0; currenRound < copyRounds; currenRound++) {
    //ROUND
    for ( i = 0; i < img.pixels.length; i = i + (copyPixelsLength * 4) * 2) {
      for ( c = 0; c < copyPixelsLength * 4; c = c + 4) {
        //COPY PIXELS
        var nr, ng, nb, na, cr, cg, cb, ca;
         cr = img.pixels[i + c + 0]; //R
         cg = img.pixels[i + c + 1]; //G
         cb = img.pixels[i + c + 2]; //B
         ca = img.pixels[i + c + 3]; //B
        var avgPixel = (cr + cg + cb) / 3;
        var mappedAvg = round(avgPixel * noise(getXY(i+c).x, getXY(i+c).y));
        var colorObj = {};
        if (avgPixel < avgImage) {
          var colorBrightness = map(avgPixel, 0, avgImage, 0.9, 1);
          colorObj = bw2Color(mappedAvg, colorArray2, 0.3, colorBrightness);
          img.pixels[i + c + 0] = colorObj.r; //R
        img.pixels[i + c + 1] = colorObj.g; //G
        img.pixels[i + c + 2] = colorObj.b; //B
        img.pixels[i + c + 3] = 255; //B
        
        img.pixels[i + c + copyPixelsLength * 4 + 0] = colorObj.r; //R
        img.pixels[i + c + copyPixelsLength * 4 + 1] = colorObj.g; //G
        img.pixels[i + c + copyPixelsLength * 4 + 2] = colorObj.b; //B
        img.pixels[i + c + copyPixelsLength * 4 + 3] = 255; //B
         
          
        } else {
          var colorBrightness2 = map(avgPixel, 0, avgImage, 0.5, 1);

          colorObj = bw2Color(mappedAvg, colorArray2, 1, colorBrightness2);

          
          img.pixels[i + c + 0] = colorObj.r; //R
        img.pixels[i + c + 1] = colorObj.g; //G
        img.pixels[i + c + 2] = colorObj.b; //B
        img.pixels[i + c + 3] = 255; //B
        
        img.pixels[i + c + copyPixelsLength * 4 + 0] = colorObj.r; //R
        img.pixels[i + c + copyPixelsLength * 4 + 1] = colorObj.g; //G
        img.pixels[i + c + copyPixelsLength * 4 + 2] = colorObj.b; //B
        img.pixels[i + c + copyPixelsLength * 4 + 3] = 255; //B
          
        }
      }
    }
  }
  img.updatePixels();
  image(img, 0, 0);
  filter(BLUR, 25);
  classifier.classify(img, gotResult);
}

  function keyTyped() {
  if (key === 's') {
    saveCanvas(path, 'jpg');
  }
}

function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  createDiv('Label: ' + results[0].label);
  createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
  fill(255);
  textSize(24);
  text(results[0].label, img.width/2, img.height-10);
}

//transfer black/white value to color value based on hsv color gardient
function bwvalueToRGB(bvalue) {
  var colorArrayIndex = bvalue * 3;
  //var colorArray = hsvColorArray(hsvFrom, hsvTo);

  var pcolorArray = [colorArray[colorArrayIndex + 0], colorArray[colorArrayIndex + 1], colorArray[colorArrayIndex + 2]];
  return (pcolorArray);
}

function generateValueArray(from, to) {
  var cdistance = to - from;
  var cstep = cdistance / 255;
  var valueArray = [];
  for (var cai = 0; cai < 255; cai++) {
    var colorvalue = round(from + cstep * cai);
    //var rgbArray = hsv2rgb(acolorvalue, 0.9, 0.9);
    //print(rgbArray);
    //for (var irgbArray = 0; irgbArray < 3; irgbArray ++) {
    //  var rgbvalue = rgbArray[irgbArray];
    append(valueArray, colorvalue);
    //}
  }
  //print(hsvArray.length);
  return (valueArray);
}

function bw2Color(colorArrayI, hsvValueArray, sd, ld) {
  var hValue = hsvValueArray[colorArrayI];
  //print('hValue: '+hValue);
  var rgbObject = {};
  rgbObject = hsl2rgb(hValue, sd, ld);
  return(rgbObject);  
}

function hsl2rgb(hValue, se, ve) {
  let f = (n, k = (n + hValue / 60) % 6) => ve - ve * se * Math.max(Math.min(k, 4 - k, 1), 0); 
  var cObject = {};
  cObject = {
    r:round(map(f(5), 0, 1, 0, 255)),
    g:round(map(f(3), 0, 1, 0, 255)),
    b:round(map(f(1), 0, 1, 0, 255)),
    a:255
  };
  
  return(cObject);
}

//get xy position of pixel from pixelArray
function getXY(i) {
  var px = i % img.width;
  var py = (i - px) / img.width;
  var pos = {
    x: px,
    y: py
  };
  return (pos);
}

//get brightness of pixel
function pvalue(index) {
  var pvalue = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3; //avg of rgb values from pixel[i]  
  return (pvalue);
}

//set pixel to brighntess value
function setBWValue(index, value) {
  img.pixels[index + 0] = value; //R
  img.pixels[index + 1] = value; //G
  img.pixels[index + 2] = value; //B
}

//set pixel to brighntess value
function setCValue(index, r, g, b) {
  img.pixels[index + 0] = r; //R
  img.pixels[index + 1] = g; //G
  img.pixels[index + 2] = b; //B
}

function moveArray(steps) {
  var move = steps * 4; //each pixel index inside of the pixelArray consists of 4 values (RGBA)
  return (move);
}

function arrayavg(array) {
  var allValues = 0;
  for (var ai = 0; ai < array.length; ai++) {
    allValues = allValues + array[ai];
  }
  var avgArray = allValues / array.length + 1;
  return (avgArray);
}
/*
function avgBrighntess() {
  var l = img.pixels.length;
  for (var k = 0; k < l; k++) {
    ball = ball + img.pixels[k];
  }
  var t = ball / l;
  console.log('bavg: ' + t);
  return (t);
}
*/
