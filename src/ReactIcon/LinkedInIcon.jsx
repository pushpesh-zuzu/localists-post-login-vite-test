import { memo, forwardRef } from "react";

const LinkedInIcon = forwardRef(
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

        <path
          d="M13.8344 9.50006C13.8342 9.94534 13.6571 10.3723 13.342 10.687C13.027 11.0017 12.5999 11.1784 12.1546 11.1781C11.7094 11.1779 11.2824 11.0008 10.9677 10.6858C10.653 10.3708 10.4763 9.94366 10.4766 9.49838C10.4768 9.05311 10.6539 8.62616 10.9689 8.31146C11.2839 7.99676 11.711 7.82009 12.1563 7.82031C12.6016 7.82054 13.0285 7.99763 13.3432 8.31265C13.6579 8.62766 13.8346 9.05479 13.8344 9.50006ZM13.8847 12.4214H10.5269V22.9313H13.8847V12.4214ZM19.1901 12.4214H15.8491V22.9313H19.1565V17.4161C19.1565 14.3437 23.1607 14.0583 23.1607 17.4161V22.9313H26.4766V16.2745C26.4766 11.095 20.55 11.2881 19.1565 13.8316L19.1901 12.4214Z"
          fill={iconColor}
        />
      </svg>
    );
  }
);

LinkedInIcon.displayName = "LinkedInIcon";

export default memo(LinkedInIcon);
