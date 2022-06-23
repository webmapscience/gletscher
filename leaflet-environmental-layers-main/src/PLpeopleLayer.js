L.LayerGroup.PLpeopleLayer = L.LayerGroup.extend(

  {
    options: {
      url: 'https://publiclab.org/api/srch/nearbyPeople',
      clearOutsideBounds: false,
    },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
    },

    onAdd: function(map) {
      this._map = map;
      this.blurred_options = {
        map: this._map,
      };
      this.BlurredLocation = new BlurredLocation(this.blurred_options);
      
      function JSONparser(data)
      {
        parsed_data = [] ; 
        if (!!data.items) {
          for (i = 0 ; i < data.items.length ; i++) {
            let obj = {} ;
            obj["id"] = data.items[i].doc_id ;
            obj["url"] = data.items[i].doc_url;
            obj["title"] = data.items[i].doc_title; 
            obj["latitude"] = parseFloat(data.items[i].latitude) ;
            obj["longitude"] = parseFloat(data.items[i].longitude) ;
            obj["name"] = data.items[i].doc_title ;
            obj["joined_time_ago"] = TimeAgo().inWords("2019-09-16T19:23:51Z"); // will change to data.items[i].created_at when it is available
            obj["image_url"] = "https://images.unsplash.com/photo-1432958576632-8a39f6b97dc7?ixlib=rb-1.2.1&w=1000&q=80"; // will change to data.items[i].doc_image_url when it is available
            parsed_data[parsed_data.length] = obj ;
          }
        }
        return parsed_data ; 
      }

      function popupDisplay(obj) {
        var popup_content = "";
        popup_content += "<div class='popup-two-column'>";
          if (obj.image_url) popup_content += "<div class='popup-shrink-column'><img src='" + obj.image_url + "' class='profile-thumb' /></div>";
          popup_content += "<div class='popup-stretch-column'><h5><a href='https://publiclab.org" + obj.url + "'>@" + obj.name + "</a></h5>";
          popup_content += "<div>Joined " + obj.joined_time_ago + "</div></div>";
        popup_content += "</div>";
        return popup_content
      }

      this.options_display = {
        blurredLocation: this.BlurredLocation,
        JSONparser: JSONparser,
        popupDisplay: popupDisplay,
        source_url: 'https://publiclab.org/api/srch/nearbyPeople',
        color_code_markers: false, // by default this is false .
        style: 'both', // or 'heatmap' or 'markers' , by default is 'both'
      };

      this.blurredLocationDisplay = new BlurredLocationDisplay(this.options_display);
    },

    onRemove: function(map) {
      this._layers = {};
      this.blurredLocationDisplay.removeLBLD();
      var lbld = this.blurredLocationDisplay;
      setTimeout(function() { lbld.removeLBLD(); }, 2000);
      setTimeout(function() { lbld.removeLBLD(); }, 5000);
      setTimeout(function() { lbld.removeLBLD(); }, 7000);
      setTimeout(function() { lbld.removeLBLD(); }, 10000);
    },

  },
);


L.layerGroup.PLpeople = function(options) {
  return new L.LayerGroup.PLpeopleLayer(options);
};