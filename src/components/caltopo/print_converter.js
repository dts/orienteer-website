angular.module('orienteerio').factory(
  'CaltopoPrintConverter',function() {
    return function(checkpoints) {
      var base = {
        "ConfiguredLayer" : [],
        "CustomLayer" : [],
        "GeoRef" : [],
        "MapConfig" : {"base":"t",
                       "layers":["r"],
                       "opacity":[0.2],
                       "alphas":null},
        "Marker" : [],
        "Shape" : []
      };
      var marker_url = "/resource/imagery/icons/ring/FF0000.png";

      var id_ctr = 1;
      base.Marker = _.map(checkpoints,function(cp) {
        var name = cp.message || cp.name;
        var lat = cp.lat || cp.latitude;
        var lng = cp.lng || cp.longitude || cp.lon;
        var id = id_ctr++;
        
        return {
          id : id,
          label : name,
          position : { lat : lat , lng : lng, id : id },
          url : marker_url
        };
      });

      return base;
    }
  }
);
