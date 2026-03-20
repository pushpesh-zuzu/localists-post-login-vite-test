"use client";
import React from "react";

function GalleryIcon({ className = "" }) {
  return (
    <svg
      width="122"
      height="123"
      viewBox="0 0 122 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <rect width="122" height="123" fill="url(#pattern0_12559_1554)" />
      <defs>
        <pattern
          id="pattern0_12559_1554"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_12559_1554"
            transform="scale(0.00819672 0.00813008)"
          />
        </pattern>
        <image
          id="image0_12559_1554"
          width="122"
          height="123"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}

export default GalleryIcon;
