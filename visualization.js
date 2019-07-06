document.addEventListener("DOMContentLoaded", () => {

    d3.json("/countries.json")
        .then(countries => {
            d3.csv("/cities.csv")
                .then(cities => {
                    // Geografische Formen sind in `countries.features`

                    // Städtedaten sind in `cities`

                    // ========================================

                    // Definiere die Breite (width) und Höhe (height) deiner Visualisierung `800x600`

                    const width = 1600;
                    const height = 800;

                    // Hole den #viz container aus dem DOM mit `d3.select()`

                    const container = d3.select("#viz");

                    // Erstelle eine SVG node mit den Dimensionen `800x600`

                    const svg = container
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style("background-color", "black");

                    // Konfiguriere eine Kartenprojektion

                    const projection = d3
                        .geoAlbers()
                        .rotate([-10.0, 0.0])
                        .center([0.0, 52.0])
                        .translate([width / 2, height / 2])
                        .scale(700);

                    // Erstelle einene Pfadgenerator mit `d3.geoPath()`

                    const path = d3.geoPath().projection(projection);

                    // Optional: Erstelle ein Gradnetz mit `d3.geoGraticule()()`

                    const graticule = d3.geoGraticule()();

                    const graticulePath = svg
                        .append("path")
                        .attr("d", path(graticule))
                        .attr("stroke", "#DDD")
                        .attr("stroke-width", 0.5)
                        .attr("fill", "#FFFFFF");

                    // Binde `countries.features` an Pfade

                    const Countries = svg
                        .selectAll("path")
                        .data(countries.features)
                        .enter()
                        .append("path")
                        .attr("d", d => path(d))
                        .attr("fill", "#D8D8D8")
                        .attr("stroke", "#979797")
                        .attr("stroke-width", 0.5);

                    // Binde `cities` an Kreise

                    const sizeScale = d3.scaleLinear()
                        .domain([1, 12410])
                        .range([1, 50]);

                    const Cities = svg
                        .selectAll("circle")
                        .data(cities)
                        .enter()
                        .append("circle")
                        .attr("cx", d => projection([d.lon, d.lat])[0])
                        .attr("cy", d => projection([d.lon, d.lat])[1])
                        .attr("r", function (d) {
                            return sizeScale(d.pop_in_k)
                        })
                        .attr("fill", "rgba(245, 90, 14, 0.6)")
                        .on("click", d => {
                            console.log("Data: ", d);
                        });

                    // ========================================
                });
        });
});
