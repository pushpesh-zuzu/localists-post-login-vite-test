import { memo, forwardRef } from "react";

const XIcon = forwardRef(
  (
    {
      width = 35,
      height = 35,
      bgColor = "#EAEAEA",
      iconColor = "#000000",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <circle
          cx="17.3287"
          cy="17.3287"
          r="17.3287"
          fill={bgColor}
        />

        <g clipPath="url(#clip0_11433_9014)">
          <mask
            id="mask0"
            maskUnits="userSpaceOnUse"
            x="10"
            y="10"
            width="15"
            height="15"
            style={{ maskType: "luminance" }}
          >
            <path d="M10.3281 10.3281H24.3281V24.3281H10.3281V10.3281Z" fill="white" />
          </mask>

          <g mask="url(#mask0)">
            <path
              d="M21.3531 10.9844H23.5001L18.8101 16.3584L24.3281 23.6724H20.0081L16.6221 19.2374L12.7521 23.6724H10.6031L15.6191 17.9224L10.3281 10.9854H14.7581L17.8141 15.0384L21.3531 10.9844ZM20.5981 22.3844H21.7881L14.1081 12.2054H12.8321L20.5981 22.3844Z"
              fill={iconColor}
            />
          </g>
        </g>

        <defs>
          <clipPath id="clip0">
            <rect
              width="14"
              height="14"
              fill="white"
              transform="translate(10.3281 10.3281)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }
);

XIcon.displayName = "XIcon";

export default memo(XIcon);
