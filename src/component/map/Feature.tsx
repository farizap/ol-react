import React from 'react';
import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MapContext } from './Map';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';

interface Props {
  features: Feature<Geometry>[];
}
export const FeatureLayer: React.FC<Props> = ({ features }) => {
  const mapCtx = React.useContext(MapContext);

  const vectorSource = new VectorSource({
    features: features,
    format: new GeoJSON({ dataProjection: 'EPSG:3857' }),
  });

  const vectorLayer = new VectorImageLayer({
    source: vectorSource,
    // style: (features: FeatureLike) => {
    //   return styleFunction(features, highlights, filters, styles);
    // },
    imageRatio: 2,
  });

  mapCtx?.addLayer(vectorLayer);
  return null;
};
