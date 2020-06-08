import React from 'react';
import './App.css';
import { GeoJSON } from 'ol/format';
import { MainMap } from './component/map/Map';
import { Tile } from './component/map/Tile';
import { DrawComp } from './component/map/DrawControl';
import { FeatureLayer } from './component/map/Feature';
import { GeoJSONProbolinggo } from './component/map/sampleData';

function App() {
  const geojson = new GeoJSON().readFeatures(GeoJSONProbolinggo, {
    featureProjection: 'EPSG:3857',
  });
  return (
    <MainMap>
      <Tile />
      <DrawComp />
      <FeatureLayer features={geojson} />
    </MainMap>
  );
}

export default App;
