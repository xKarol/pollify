import { scaleLinear } from "@visx/scale";
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { useAnalyticsContext } from "../context";
import { useAnalyticsCountries } from "../hooks";
import AnalyticsBox from "./analytics-box";

type WorldMapProps = React.ComponentPropsWithoutRef<"div">;

const geoUrl = "/world-map.json";

export function WorldMap({ ...props }: WorldMapProps) {
  const { interval, pollId } = useAnalyticsContext();
  const { data, isSuccess, isError, isLoading } = useAnalyticsCountries({
    pollId,
    interval: interval,
  });

  const colorScale = scaleLinear()
    .domain([0.29, 0.68])
    .range(["#A3A3A3", "#22C55E"]);

  return (
    <AnalyticsBox
      name="World map"
      isError={isError}
      isLoading={isLoading}
      isEmpty={false}
      withScroll={false}
      {...props}>
      <ComposableMap
        projectionConfig={{
          scale: 210,
        }}>
        {isSuccess ? (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.data.find(
                  (s) => s.country_name === geo.properties.name
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d.amount)?.toString() : "#A3A3A3"}
                  />
                );
              })
            }
          </Geographies>
        ) : null}
      </ComposableMap>
    </AnalyticsBox>
  );
}
