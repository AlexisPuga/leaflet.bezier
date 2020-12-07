<p align="center"><img src="https://raw.githubusercontent.com/lifeeka/leaflet.bezier/master/logo.png"></p>


## Leaflet Bezier
Create non-animated bezier with leaflet

### Installation

```
npm i leaflet.bezier --save
```

### Usage
```js
    var options = {
        color: 'rgb(145, 146, 150)',
        fillColor: 'rgb(145, 146, 150)',
        dashArray: 8,
        opacity: 0.8,
        weight: '1',
    };

    L.bezier({
        path: [
            [
                {lat: 7.8731, lng: 80.7718},
                {lat: -18.7669, lng: 46.8691},
            ]
        ]
    }, options).addTo(map);


```

### Demo
```
npm run start
```

### License

This project is licensed under the MIT License
