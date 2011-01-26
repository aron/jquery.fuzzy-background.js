Fuzzy Background jQuery Plugin
==============================

About
-----

Built for the [Melting Vinyl website](http://www.meltingvinyl.co.uk) this plug-in takes 
an image or a URL pointing to an image, applies a gaussian blur and sets it as the page
background. Works best on small images as it will render them quickly and the browser
will smoothly stretch the image to fit the screen.

Usage
-----

### jQuery.fuzzyBackground()

The simplest way to use the plugin is via the `jQuery.fuzzyBackground()` method which
accepts an Image element, a URL or a jQuery collection.

    // Set a image from the server as the background.
    $.fuzzyBackground('/images/my-image.png');

    // Set the first image on the page as a background.
    $.fuzzyBackground($('img:first'), 20);

    // Set a specific image on the page as the background.
    $.fuzzyBackground(document.getElementById('my-image')); 

### .fuzzyBackground()

Alternatively you can call `fuzzyBackground()` on any jQuery collection containing an
image.

     $('#my-image').fuzzyBackground();

### jQuery.fuzzyBackground.supported()

Finally you can test that the current browser supports the plug-in by calling the
`jQuery.fuzzyBackground.supported()` which will return `true` if the plug-in is
supported allowing you to fallback/enhance the page accordingly.

    if ($.fuzzyBackground.supported()) {
      $(document.body).addClass('background-supported');
      $.fuzzyBackground($('#my-image'));
    } else {
      // Do something else...
    }

Browser Support
---------------

Tested in Firefox 3.6, Chrome 9, Safari 4 & 5 and Opera 10.5

License
-------

Released under the MIT license see the LICENSE file for more info. 

Credits
-------

[Paul Nickerson](http://pvnick.blogspot.com/) for the gaussian blur.
