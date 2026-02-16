import { memo, forwardRef } from "react";

const InstagramIcon = forwardRef(
  (
    {
      width = 35,
      height = 35,
      bgColor = "#EAEAEA",
      strokeColor = "#253238",
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
          d="M21.318 9.01562H13.1216C10.8583 9.01562 9.02344 10.8505 9.02344 13.1138V21.3102C9.02344 23.5736 10.8583 25.4084 13.1216 25.4084H21.318C23.5814 25.4084 25.4162 23.5736 25.4162 21.3102V13.1138C25.4162 10.8505 23.5814 9.01562 21.318 9.01562Z"
          stroke={strokeColor}
          strokeWidth="1.96036"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M21.7199 12.6953H21.7281M20.4904 16.687C20.5916 17.3691 20.475 18.0658 20.1574 18.6779C19.8398 19.29 19.3373 19.7864 18.7213 20.0964C18.1053 20.4064 17.4073 20.5143 16.7264 20.4048C16.0456 20.2952 15.4166 19.9738 14.929 19.4862C14.4414 18.9985 14.1199 18.3696 14.0104 17.6887C13.9008 17.0079 14.0088 16.3098 14.3188 15.6939C14.6288 15.0779 15.1252 14.5754 15.7373 14.2577C16.3494 13.9401 17.0461 13.8236 17.7282 13.9248C18.424 14.028 19.0682 14.3522 19.5656 14.8496C20.063 15.347 20.3872 15.9911 20.4904 16.687Z"
          stroke={strokeColor}
          strokeWidth="1.96036"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

InstagramIcon.displayName = "InstagramIcon";

export default memo(InstagramIcon);
