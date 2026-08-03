import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { GeoJSON } from 'react-leaflet';

import { routes } from '../../helpers/routes';

const styles = {
    regular: {
        color: '#ddd',
        dashArray: '3',
        fillOpacity: 0.82,
        // fillColor: '#2bace2', // light blue with 1.0
        fillColor: '#009ddf', // light blue with 0.82
        // fillColor: '#f02b01', // orange with 0.67
        // fillColor: '#e5f3ff', // light gray with 0.6
        opacity: 1,
        weight: 2,
    },
    hover: {
        color: '#666',
        dashArray: '',
        fillOpacity: 0.67,
        fillColor: '#f02b01',
        weight: 5,
    },
};

function RegionsLayer() {
    const navigate = useNavigate();

    const featureOver = (mouseEvent) => {
        const layer = mouseEvent.target;
        const tooltip = layer.getTooltip();
        // set hover style to layer
        layer.setStyle(styles.hover);
        // set hover style to tooltip
        tooltip.getElement().classList.add('hovered');

        layer.bringToFront();
        tooltip.bringToFront();
    };

    const featureOut = (mouseEvent) => {
        const layer = mouseEvent.target;
        // set regular style to layer
        layer.setStyle(styles.regular);
        // set regular style to tooltip
        layer.getTooltip().getElement().classList.remove('hovered');

        layer.bringToBack();
    };

    const featureClick = (pointerEvent) => {
        navigate(routes.region(pointerEvent.target.feature.properties.code));
    };

    const onEach = (feature, layer) => {
        let label;
        if (window.innerWidth < 576) {
            label = feature.properties.code;
        } else {
            label = ['BA', 'NR', 'TN', 'TT'].includes(feature.properties.code)
                ? feature.properties.name.replace(' ', '<br/>')
                : feature.properties.name;
        }
        let offset = [0, 0];
        switch (feature.properties.code) {
            case 'BA':
                offset = [5, 10];
                break;
            case 'NR':
            case 'TN':
                offset = [0, 5];
                break;
            case 'TT':
                offset = [10, -30];
                break;
            default:
                break;
        }
        layer.bindTooltip(label, {
            direction: 'center',
            offset,
            opacity: 1,
            permanent: true,
        });
        layer.on({
            mouseover: featureOver,
            mouseout: featureOut,
            click: featureClick,
        });
    };

    const { isLoading, error, data } = useQuery({
        queryKey: ['regionsGeoJSON'],
        queryFn: () =>
            fetch('/json/regions.geojson').then((res) => res.json()),
    });
    if (isLoading || error) return null;

    // render react-leaflet GeoJSON when the data is ready
    return (
        <GeoJSON
            data={data}
            onEachFeature={onEach}
            pathOptions={styles.regular}
        />
    );
}

export default RegionsLayer;
