
var map;

// execute when the DOM is fully loaded
$(function() {
    
    // get DOM node in which map will be instantiated
    var canvas = $("#map").get(0);
    
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VubnlhaXJlcyIsImEiOiJjajExc3E5emUwNTl6MnFwZTNwbTRxbWY0In0.fcxuhxE38yX_qaho5eWMhw';
    
    map = new mapboxgl.Map({
    container: canvas, // container id
    style: 'mapbox://styles/mapbox/light-v9', //hosted style id
    center: [-10.38, 45], // starting position
    minZoom: 2,
    maxZoom: 5,
    zoom: 2 // starting zoom
    });
    
    //share box code
    var a2a_config = a2a_config || {};
    a2a_config.linkname = "Granfon";
    a2a_config.linkurl = "https://ide50-kennyaires.cs50.io/";
    a2a_config.num_services = 8;
    
    
    $.getJSON(Flask.url_for("countries"))
    .done(function(data, textStatus, jqXHR) {
    
         // add markers to map
        data.forEach(function(marker) {
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(static/marker.fw.png)';
        el.style.width = 16 + 'px';
        el.style.height = 16 + 'px';
    
        el.addEventListener('click', function() {
            // send marker properties to python application
            var form = document.createElement("form");
            var element1 = document.createElement("input");
            var element2 = document.createElement("input");
            
            form.method = "POST";
            form.action = "/#chart";
            
            element1.value=marker.country_name;
            element1.name="country";
            form.appendChild(element1);
            
            element2.value=marker.country_code;
            element2.name="ccode";
            form.appendChild(element2);
            
            document.body.appendChild(form);
            form.submit();
        });
        
        var lngLat = {lng: marker.longitude, lat: marker.latitude};
        
        // add marker to map
        new mapboxgl.Marker(el, {offset: [-24 / 2, -24 / 2]})
            .setLngLat(lngLat)
            .addTo(map);
    });
    
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

            // log error to browser's console
            console.log(errorThrown.toString());
    });

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();
    
        // configure typeahead
    $("#q").typeahead({
        highlight: false,
        minLength: 1
    },
    {
        display: function(suggestion) { return null; },
        limit: 10,
        source: search,
        templates: {
            suggestion: Handlebars.compile(
                "<div>" +
                "{{country_name}}"
                +"</div>"
            )
        }
    });
    
    //set delay when hiding/focusing on form text
    (function($) {
    $.fn.promptTooltip = function(duration) {
        $this = $(this);
        $this.focus();
        setTimeout(function() {
            $this.blur();
        }, duration);
    };
    })(jQuery);
    
    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // set map's center
        map.flyTo({
        center: [
            parseFloat(suggestion.longitude),
            parseFloat(suggestion.latitude)],
        zoom: 5
        });
        
        $('#q').promptTooltip(1000);

    });
    
    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);
    
        //lightboxes
    $('.test-popup-link').magnificPopup({type:'image'});
    $('.video').magnificPopup({type:'iframe'});

});

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, syncResults, asyncResults)
{
    // get places matching query (asynchronously)
    var parameters = {
        q: query
    };
    $.getJSON(Flask.url_for("search"), parameters)
    .done(function(data, textStatus, jqXHR) {
     
        // call typeahead's callback with search results (i.e., places)
        asyncResults(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());

        // call typeahead's callback with no results
        asyncResults([]);
    });
}


$('.video').magnificPopup({
  type: 'iframe',
    iframe: {
      markup: '<div class="mfp-iframe-scaler">'+
                '<div class="mfp-close"></div>'+
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
              '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button
    
      patterns: {
        youtube: {
          index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
    
          id: '?listType=search&list=', // String that splits URL in a two parts, second part should be %id%
          // Or null - full URL will be returned
          // Or a function that should return %id%, for example:
          // id: function(url) { return 'parsed id'; }
    
          src: '//www.youtube.com/embed/%id%&autoplay=1' // URL that will be set as a source for iframe.
        }
      },
    
      srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
    }
    
});

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}