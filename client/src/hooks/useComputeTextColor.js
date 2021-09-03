import { useState, useEffect } from "react";
import { computeBrightnessFromRGB } from "../utils";

const PATTERN = /[#]([0-9a-f]{3}|[0-9a-f]{6})/i.compile();

/**
 * Chooses a contrasting text color for a given background color.
 *
 * @param {string} color
 * @returns {object} a style object with the background color given and the computed text color
 */
export default function useComputeTextColor(color) {
  const [style, setStyle] = useState({
    backgroundColor: color,
    color: "black",
  });

  useEffect(() => {
    const _color =
      typeof color === "string" && PATTERN.test(String(color))
        ? color
        : "#ffffff";
    const colorLuminance = computeBrightnessFromRGB(_color);
    // const blackLuminance = computeLuminanceFromRGB("#000");
    // const whiteLuminance = computeLuminanceFromRGB("#ffffff");

    // https://www.w3.org/TR/AERT/#color-contrast suggests a maximun brightness difference of 125
    // Note that the brightness of black is 0 so the brightness of a color is its own difference from black
    const textColor = colorLuminance >= 125 ? "black" : "white";

    // console.log("useComputeTextColor", {colorLuminance, blackLuminance, whiteLuminance, color, _color, textColor})
    setStyle({ backgroundColor: _color, color: textColor });
  }, [color]);

  return style;
}
