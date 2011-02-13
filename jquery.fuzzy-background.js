/*  Fuzzy Background jQuery Plugin - v1.0
 *  Copyright 2011, Aron Carroll & Paul Ferguson
 *  Released under the MIT license
 *  More Information: http://github.com/aron/floodlight.js
 */

(function ($, window, document) {

  var $body   = $(document.body),
      $window = $(window),
      resized;

  /* Applies gaussian blur to an image data object and returns it.
   *
   * Taken from http://pvnick.blogspot.com/2010/01/im-currently-porting-image-segmentation.html
   * by way of Paintbrush.js (http://github.com/mezzoblue/PaintbrushJS)
   *
   * img    - The image/canvas element that is to be blurred.
   * pixels - The image data obtained from the context via getImageData().
   * amount - The amount to blur the image by.
   *
   * Example:
   *
   *   var image   = document.getElementById('my-image');
   *   var context = document.createElement('canvas').getContext('2d');
   *
   *   context.canvas.width  = image.width;
   *   context.canvas.height = image.height;
   *   context.drawImage(image, 0, 0);
   *
   *   var data = gaussianBlur(image, context.getImageData(0, 0, image.width, image.height), 20);
   *   context.putImageData(data, 0, 0);
   *
   * Returns image data object.
   */

  function gaussianBlur(img, pixels, amount) {
    var width, width4, height, data, q, qq, qqq, b0, b1, b2, b3, bigB, c,
        x, y, index, indexLast, pixel, ppixel, pppixel, ppppixel;

    width = img.width;
    width4 = width << 2;
    height = img.height;

    if (pixels) {
      data = pixels.data;

      // compute coefficients as a function of amount
      q;
      if (amount < 0.0) {
        amount = 0.0;
      }
      if (amount >= 2.5) {
        q = 0.98711 * amount - 0.96330;
      } else if (amount >= 0.5) {
        q = 3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * amount);
      } else {
        q = 2 * amount * (3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * 0.5));
      }

      //compute b0, b1, b2, and b3
      qq = q * q;
      qqq = qq * q;
      b0 = 1.57825 + (2.44413 * q) + (1.4281 * qq ) + (0.422205 * qqq);
      b1 = ((2.44413 * q) + (2.85619 * qq) + (1.26661 * qqq)) / b0;
      b2 = (-((1.4281 * qq) + (1.26661 * qqq))) / b0;
      b3 = (0.422205 * qqq) / b0;
      bigB = 1.0 - (b1 + b2 + b3);

      // horizontal
      for (c = 0; c < 3; c++) {
        for (y = 0; y < height; y++) {
          // forward
          index = y * width4 + c;
          indexLast = y * width4 + ((width - 1) << 2) + c;
          pixel = data[index];
          ppixel = pixel;
          pppixel = ppixel;
          ppppixel = pppixel;
          for (; index <= indexLast; index += 4) {
            pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
            data[index] = pixel;
            ppppixel = pppixel;
            pppixel = ppixel;
            ppixel = pixel;
          }
          // backward
          index = y * width4 + ((width - 1) << 2) + c;
          indexLast = y * width4 + c;
          pixel = data[index];
          ppixel = pixel;
          pppixel = ppixel;
          ppppixel = pppixel;
          for (; index >= indexLast; index -= 4) {
            pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
            data[index] = pixel;
            ppppixel = pppixel;
            pppixel = ppixel;
            ppixel = pixel;
          }
        }
      }

      // vertical
      for (c = 0; c < 3; c++) {
        for (x = 0; x < width; x++) {
          // forward
          index = (x << 2) + c;
          indexLast = (height - 1) * width4 + (x << 2) + c;
          pixel = data[index];
          ppixel = pixel;
          pppixel = ppixel;
          ppppixel = pppixel;
          for (; index <= indexLast; index += width4) {
            pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
            data[index] = pixel;
            ppppixel = pppixel;
            pppixel = ppixel;
            ppixel = pixel;
          }
          // backward
          index = (height - 1) * width4 + (x << 2) + c;
          indexLast = (x << 2) + c;
          pixel = data[index];
          ppixel = pixel;
          pppixel = ppixel;
          ppppixel = pppixel;
          for (; index >= indexLast; index -= width4) {
            pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
            data[index] = pixel;
            ppppixel = pppixel;
            pppixel = ppixel;
            ppixel = pixel;
          }
        }
      }

      return(pixels);
    }
  }

  /* Sets the page background to a blurred version of the provided image.
   *
   * source - Either an jQuery set containing an image element, the image element
   *          itself or a URL pointing to an image on the current server.
   * amount - The amount to blur the image from 0 upwards.
   *
   * Examples:
   *
   *   // Set a image from the server as the background.
   *   $.fuzzyBackground('/images/my-image.png');
   *
   *   // Set the first image on the page as a background.
   *   $.fuzzyBackground($('img:first'), 20);
   *
   *   // Set a specific image on the page as the background.
   *   $.fuzzyBackground(document.getElementById('my-image'));
   *
   * Returns nothing.
   */

  $.fuzzyBackground = function (source, amount) {
    var context,
        canvas,
        image;

    source = (source instanceof $) ? source.get(0) : source;
    source = (typeof source === 'string') ? source : source.src;

    if (!source || !$.fuzzyBackground.supported()) { return; }

    canvas  = document.createElement('canvas');
    context = canvas.getContext('2d');
    image   = new Image();

    image.onload = function () {
      var data;

      canvas.height = image.height;
      canvas.width  = image.width;

      context.drawImage(image, 0, 0);

      data = context.getImageData(0, 0, canvas.width, canvas.height);
      data = gaussianBlur(canvas, data, amount || 15);

      context.putImageData(data, 0, 0);

      // Set as the background image.
      $body.css({
        backgroundImage: 'url(' + canvas.toDataURL() + ')',
        backgroundAttachment: 'fixed'
      });

      $.fuzzyBackground._resize();
    };
    image.src = source;

    // Bind resize event listener only once.
    if (resized !== true) {
      $window.resize($.fuzzyBackground._resize);
      resized = true;
    }
  };

  /* Resets the "background-size" property on the document.body depending on the
   * current window dimensions.
   *
   * Returns nothing.
   */

  $.fuzzyBackground._resize = function () {
    var value = $window.width() + 'px ' + $window.height() + 'px';

    $body.css({
      backgroundSize: value,
      MozBackgroundSize: value,
      WebkitBackgroundSize: value
    });
  };

  /* Checks to see if the current browser supports the plug-in.
   *
   * Example:
   *
   *   if ($.fuzzyBackground.supported()) {
   *     $.fuzzyBackground($('#my-image'));
   *   }
   *
   * Returns true if the browser supports the plug-in.
   */

  $.fuzzyBackground.supported = (function () {
    var canvas = document.createElement('canvas'),
        canvas_supported = !!(canvas.getContext && canvas.getContext('2d')),
        background_supported = false,
        element = document.documentElement,
        styles = {};

    if (window.getComputedStyle) {
      styles = window.getComputedStyle(element, null);
    }
    else if (element.currentStyle) {
      styles = element.currentStyle;
    }

    $.each(
      ['backgroundSize', 'MozBackgroundSize', 'WebkitBackgroundSize'],
      function () {
        if (this in styles) {
          background_supported = true;
        }
      }
    );

    return function () {
      return canvas_supported && background_supported;
    };
  })();

  /* Sets the first image matched by the selector as the background image.
   *
   * amount - The amount to blur the image by.
   *
   * Example:
   *
   *   $('#my-image').fuzzyBackground();
   *
   * Returns jQuery collection for chaining.
   */

  $.fn.fuzzyBackground = function (amount) {
    $.fuzzyBackground(this[0], amount);
    return this;
  };

})(jQuery, window, document);
