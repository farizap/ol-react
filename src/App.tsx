import React from 'react';
import './App.css';
import { GeoJSON } from 'ol/format';
import { MainMap } from './component/map/Map';
import { Tile } from './component/map/Tile';
import { DrawComp } from './component/map/DrawControl';
import { FeatureLayer } from './component/map/Feature';
import { GeoJSONProbolinggo } from './component/map/sampleData';
import { Feature } from 'ol';
import * as geobuf from 'geobuf';
import pbf from 'pbf';
import Geometry from 'ol/geom/Geometry';

export const getMapsFeatures = async (city: string): Promise<GeoJSON.FeatureCollection> => {
  try {
    const response = await fetch(`http://localhost:3001/maps/features?kota=${city}`);

    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const resBuffer = await response.arrayBuffer();
    const geojson = geobuf.decode(new pbf(resBuffer)) as GeoJSON.FeatureCollection;
    console.log(geojson);
    return geojson;
  } catch (err) {
    throw err;
  }
};

function App() {
  const [features, setFeatures] = React.useState<Feature<Geometry>[]>();

  React.useEffect(() => {
    async function addFeatures() {
      try {
        const response = await getMapsFeatures('kota-probolinggo');

        const geojson = new GeoJSON().readFeatures(response, {
          featureProjection: 'EPSG:3857',
        });

        setFeatures(geojson);
      } catch (e) {
        const geojson = new GeoJSON().readFeatures(GeoJSONProbolinggo, {
          featureProjection: 'EPSG:3857',
        });
        setFeatures(geojson);
      }
    }

    addFeatures();
  }, []);

  return (
    <MainMap>
      <Tile />
      <DrawComp />
      {features && <FeatureLayer features={features} />}
    </MainMap>
  );
}

export default App;
