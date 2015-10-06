/*
  Filename:   dtd-export.js
  Title:      "Don't think... draw" export script
  Author:     Sarah Kuehnle
  Created:    October 1, 2015
*/

// First, close all open documents
while (app.documents.length) {
  app.activeDocument.close();
}

// Initiatlize variables
var numFiles = 4;
var thumbsArray = [];
var mediumFileArray = [];
var fullSizeArray = [];
var thumbsFileName;
var fullSizeFileName;
var exportOptions;
var fileExt;
var layerName;
var docRef;
var layerCount;
var fileToOpen;
var matteColor;

// Populate arrays with the appropriate filenames
for (var i = 1; i <= numFiles; i++) {
  thumbsFileName   = "dtd-200-" + i + ".psd";
  mediumFileName   = "dtd-300-" + i + ".psd";
  fullSizeFileName = "dtd-500-" + i + ".psd";
  thumbsArray.push(thumbsFileName);
  mediumFileArray.push(mediumFileName);
  fullSizeArray.push(fullSizeFileName);
}

// The root path where assets are located
var docRootPath = "/Users/sarah/Dropbox/DTD-2014/dtd-assets-working/";

// GIF export options
var exportGIFOptions = new ExportOptionsSaveForWeb();
exportGIFOptions.colors       = 32;
exportGIFOptions.dither       = Dither.NONE;
exportGIFOptions.transparency = false;
exportGIFOptions.format       = SaveDocumentType.COMPUSERVEGIF;

// JPG export options
var exportJPGOptions = new ExportOptionsSaveForWeb();
exportJPGOptions.format       = SaveDocumentType.JPEG;
exportJPGOptions.optimize     = true;
exportJPGOptions.quality      = 80;

// Loops through files and export
for (var i = 0; i < numFiles; i++) {
  exportToWeb("500", "GIF", i);
  exportToWeb("300", "GIF", i);
  exportToWeb("200", "GIF", i);
}

// Function: exportToWeb
// Parameters:
//  - type: full-size or thumbs
//  - format: GIF or JPG
//  -  num: file number
function exportToWeb(type, format, num) {
  matteColor = new RGBColor();

  // Determine which array and background color to use
  if (type == '500') {
    artArray = fullSizeArray;
    matteColor.red   = 255;
    matteColor.green = 255;
    matteColor.blue  = 255;
  } else if (type == '300') {
    artArray = mediumFileArray;
    matteColor.red   = 255;
    matteColor.green = 255;
    matteColor.blue  = 255;
  } else {
    artArray = thumbsArray;
    matteColor.red   = 148;
    matteColor.green = 148;
    matteColor.blue  = 148;
  }

  // Only GIFs need a background set. Color items have styled backgrounds
  // as a part of the art work.
  exportGIFOptions.matteColor = matteColor;

  // Open the file
  fileToOpen = open(File(docRootPath + type + "/" + artArray[num]));

  // Set the file as active and count its layers
  docRef = app.activeDocument;
  layerCount = docRef.layers.length;

  // Loop through each layer and export image
  for (var i = 0; i < layerCount; i++) {
    layerName = docRef.layers[i].name;

    // Determine wether a GIF or JPG should be output:
    // Look for layers with "-color" in the name, these should be JPGS.
    if (layerName.indexOf("-color") == -1) {
      exportOptions = exportGIFOptions;
      fileExt = ".gif";
    } else {
      exportOptions = exportJPGOptions;
      fileExt = ".jpg";
    }

    // Show the layer
    docRef.layers[i].visible = true;
    // Export the layer
    docRef.exportDocument(new File(docRootPath + type + "/output/" + layerName + fileExt), ExportType.SAVEFORWEB, exportOptions);
    // Hide the layer
    docRef.layers[i].visible = false;
  }

  // Close the document
  docRef.close(SaveOptions.DONOTSAVECHANGES);
}
