import { memo, forwardRef } from "react";

const FacebookIcon = forwardRef(
  (
    {
      width = 35,
      height = 35,
      bgColor = "#EAEAEA",
      iconColor = "#253238",
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

        <path
          d="M18.8547 18.4415H20.9038L21.7234 15.1629H18.8547V13.5236C18.8547 12.6794 18.8547 11.8844 20.4939 11.8844H21.7234V9.13037C21.4562 9.09513 20.4472 9.01562 19.3817 9.01562C17.1564 9.01562 15.5761 10.3738 15.5761 12.8679V15.1629H13.1172V18.4415H15.5761V25.4084H18.8547V18.4415Z"
          fill={iconColor}
        />
      </svg>
    );
  }
);

FacebookIcon.displayName = "FacebookIcon";

export default memo(FacebookIcon);
