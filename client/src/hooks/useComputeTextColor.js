import { useEffect, useState } from "react";
import { colorMap } from "../colors";
import { computeBrightnessFromRGB } from "../utils";

const PATTERN = /[#]([0-9a-f]{3}|[0-9a-f]{6})/i.compile();
const DARK_TEXT_COLOR = colorMap.gray[800];
const LIGHT_TEXT_COLOR = colorMap.gray[50];

/**
 * Chooses a contrasting text color for a given background color.
 *
 * @param {string} color
 * @returns {Record<string,string>} a style object with the background color given and the computed text color
 */
export default function useComputeTextColor(color, tag = null) {
  const [style, setStyle] = useState({
    backgroundColor: color,
    color: DARK_TEXT_COLOR,
  });

  useEffect(() => {
    const _color =
      typeof color === "string" && PATTERN.test(String(color)) ? color : LIGHT_TEXT_COLOR;
    const colorLuminance = computeBrightnessFromRGB(_color);
    const darkLuminance = computeBrightnessFromRGB(DARK_TEXT_COLOR);
    // const lightLuminance = computeBrightnessFromRGB(LIGHT_TEXT_COLOR);

    // console.log(tag, {
    //   colorLuminance,
    //   darkLuminance,
    //   lightLuminance
    // })

    // https://www.w3.org/TR/AERT/#color-contrast suggests a maximum brightness difference of 125
    const textColor = colorLuminance - darkLuminance >= 125 ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;

    setStyle({ backgroundColor: _color, color: textColor });
  }, [color]);

  return style;
}
