import React from 'react';
import { ScaleLine, defaults as DefaultControls, Control } from 'ol/control';
import { Map } from 'ol';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape } from 'ol/style';

import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Draw } from 'ol/interaction';
import Feature, { FeatureLike } from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import GeometryType from 'ol/geom/GeometryType';
import { MapContext } from './Map';
import pencil from './pencil';

export const drawStyle = {
  pipe: new Style({
    stroke: new Stroke({
      color: '#0000ff',
      width: 4,
      lineDash: [10, 8],
    }),
  }),
  point: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: '#0000ff' }),
      stroke: new Stroke({ color: '#0000ff', width: 1 }),
    }),
  }),
};

const source: VectorSource<Geometry> = new VectorSource({ wrapX: false });
const vectorDraw = new VectorLayer({
  source: source,
  style: (feature: FeatureLike) => {
    if (feature.getGeometry().getType() === 'Point') {
      return drawStyle.point;
    }
    return drawStyle.pipe;
  },
  zIndex: 9999,
});

const draw = new Draw({
  source: source,
  type: GeometryType.LINE_STRING,
});

const DrawControl = (map: Map): Control => {
  const drawHandler = () => {
    let isDrawing = true;

    draw.once('drawstart', function (evt: any) {
      evt.feature.setStyle(drawStyle.pipe);
    });
    draw.once('drawend', (evt: any) => {
      map.removeInteraction(draw);

      const coordinates: number[] = evt.feature.getProperties().geometry?.flatCoordinates;

      let totalDistance: number = 0;

      const newPoint = new Point([coordinates[0], coordinates[1]]);
      const feature = new Feature({
        geometry: newPoint,
      });
      feature.setProperties({
        length: totalDistance,
      });
      source.addFeature(feature);
      for (let i = 2; i < coordinates.length; i = i + 2) {
        const newPoint = new Point([coordinates[i], coordinates[i + 1]]);
        const feature = new Feature({
          geometry: newPoint,
        });

        const tempLine = new LineString([
          [coordinates[i - 2], coordinates[i - 1]],
          [coordinates[i], coordinates[i + 1]],
        ]);

        totalDistance += tempLine.getLength();

        feature.setProperties({
          'Length :': `${totalDistance.toFixed(2)} m`,
        });
        source.addFeature(feature);
      }
      evt.feature.setProperties({
        'Total Pipe Length :': `${totalDistance.toFixed(2)} m`,
      });

      setTimeout(() => {
        isDrawing = false;
      }, 50);
    });
    map.addInteraction(draw);
  };

  var button = document.createElement('button');
  button.innerHTML = pencil;
  button.onclick = (evt) => {
    drawHandler();
  };

  var element = document.createElement('div');
  element.className = 'draw ol-unselectable ol-control';
  element.appendChild(button);

  return new Control({
    element: element,
  });
};

export const DrawComp = () => {
  console.log('draw rerender');
  const mapCtx = React.useContext(MapContext);

  React.useEffect(() => {
    mapCtx?.addControl(DrawControl(mapCtx));
    mapCtx?.addLayer(vectorDraw);
  }, [mapCtx]);

  return null;
};
