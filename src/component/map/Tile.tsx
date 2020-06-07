import React from 'react';
import { MapContext } from './Map';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';

export const Tile: React.FC = () => {
  const mapCtx = React.useContext(MapContext);
  console.log(mapCtx);
  mapCtx?.addLayer(
    new TileLayer({
      source: new OSM(),
    })
  );
  return null;
};
