import React from 'react';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import 'ol/ol.css';
import { Map, View } from 'ol';

import { fromLonLat } from 'ol/proj';

const CENTER_PROBOLINGGO = [113.2004, -7.7572];

export const MapContext = React.createContext<Map | undefined>(undefined);

// interface Props {
//   features: Feature<Geometry>[];
// }
const map = new Map({
  view: new View({
    projection: 'EPSG:3857',
    center: fromLonLat(CENTER_PROBOLINGGO),
    zoom: 14,
    minZoom: 2,
    maxZoom: 18,
  }),
  //   controls: DefaultControls().extend([new ScaleLine()]),
});
export const MainMap: React.FC = (props) => {
  React.useEffect(() => {
    map.setTarget('map');
  }, []);
  return (
    <MapContext.Provider value={map}>
      <div
        className="map"
        id="map"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#cccccc',
          // marginTop: '64px',
        }}
      ></div>
      {props.children}
    </MapContext.Provider>
  );
};
