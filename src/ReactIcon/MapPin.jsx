import React from "react";

function MapPin({ className = '' }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.374 10.9141L9.00313 16.8L4.63227 10.9141C3.91755 9.95167 3.37675 8.85707 3.26033 7.66392C3.1599 6.63454 3.15574 5.37164 3.54927 4.47213C4.58384 2.10741 6.44335 0.800003 9.00313 0.800003C11.5629 0.800003 13.4224 2.10741 14.457 4.47213C14.8505 5.37164 14.8463 6.63454 14.7459 7.66392C14.6295 8.85707 14.0887 9.95167 13.374 10.9141Z" fill="#3A5898" />
            <path d="M6.79688 7.2L8.19688 8.6L11.3969 5.2" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

export default MapPin;
