import PropTypes from 'prop-types';
import React from 'react';

interface IProps {
  width?: number;
  height?: number;
  className?: string;
}

const DefaultLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1425.8 353.74"
    {...props}
  >
    <defs>
      <linearGradient
        id="prefix__a"
        y2={488.43}
        gradientUnits="userSpaceOnUse"
        x2={-469.87}
        y1={-68.973}
        x1={-467.57}
      >
        <stop offset={0} stopColor="#2294fe" />
        <stop offset={1} stopColor="#014f96" />
      </linearGradient>
    </defs>
    <g fill="#666">
      <path d="M495.494 179.516v19.095c-5.773-3.182-11.583-5.55-17.43-7.105a64.331 64.331 0 00-17.541-2.442c-13.248 0-23.536 4.219-30.863 12.656-7.327 8.363-10.991 20.13-10.991 35.304 0 15.172 3.664 26.977 10.991 35.415 7.327 8.363 17.615 12.545 30.863 12.545 5.92 0 11.768-.777 17.541-2.332 5.847-1.628 11.657-4.033 17.43-7.216v18.873a83.693 83.693 0 01-17.763 5.995c-6.07 1.332-12.545 1.999-19.428 1.999-18.725 0-33.601-5.884-44.629-17.652s-16.542-27.643-16.542-47.627c0-20.28 5.55-36.23 16.653-47.85 11.176-11.62 26.459-17.43 45.85-17.43 6.29 0 12.434.667 18.429 1.999a81.647 81.647 0 0117.43 5.773M578.984 189.066c-10.954 0-19.613 4.293-25.978 12.878-6.365 8.512-9.548 20.205-9.547 35.082 0 14.876 3.145 26.607 9.436 35.193 6.365 8.512 15.061 12.767 26.089 12.767 10.88 0 19.502-4.292 25.867-12.878 6.365-8.585 9.547-20.279 9.548-35.082 0-14.728-3.183-26.385-9.548-34.97-6.365-8.66-14.987-12.99-25.867-12.99m0-17.319c17.763 0 31.714 5.773 41.854 17.32s15.209 27.531 15.209 47.96c0 20.352-5.07 36.34-15.209 47.96-10.14 11.545-24.091 17.318-41.854 17.318-17.837 0-31.825-5.773-41.965-17.319-10.066-11.62-15.098-27.606-15.098-47.96 0-20.427 5.033-36.414 15.098-47.96 10.14-11.546 24.128-17.319 41.965-17.319M766.604 198.606c5.107-9.177 11.213-15.949 18.318-20.316 7.105-4.366 15.468-6.55 25.09-6.55 12.952 0 22.943 4.552 29.975 13.655 7.03 9.03 10.546 21.908 10.547 38.634v75.048h-20.538v-74.382c0-11.916-2.11-20.76-6.328-26.533-4.219-5.773-10.658-8.659-19.317-8.66-10.584.001-18.947 3.517-25.09 10.548-6.143 7.031-9.215 16.616-9.214 28.754v70.274h-20.538v-74.382c0-11.99-2.11-20.834-6.328-26.533-4.22-5.773-10.732-8.66-19.54-8.66-10.435 0-18.724 3.553-24.867 10.658-6.143 7.032-9.215 16.58-9.215 28.643v70.274h-20.538v-124.34h20.538v19.317c4.663-7.623 10.251-13.248 16.764-16.875 6.513-3.626 14.247-5.44 23.203-5.44 9.03 0 16.69 2.295 22.981 6.884 6.365 4.588 11.065 11.25 14.099 19.983M910.704 280.426v65.945h-20.538v-171.63h20.538v18.873c4.293-7.4 9.696-12.878 16.209-16.43 6.587-3.627 14.432-5.44 23.536-5.44 15.098 0 27.347 5.994 36.747 17.984 9.473 11.99 14.21 27.755 14.21 47.294 0 19.54-4.737 35.304-14.21 47.294-9.4 11.99-21.649 17.985-36.747 17.985-9.103 0-16.949-1.776-23.536-5.328-6.513-3.627-11.916-9.14-16.209-16.542m69.497-43.408c0-15.024-3.109-26.792-9.325-35.304-6.144-8.586-14.617-12.878-25.423-12.878-10.806 0-19.317 4.292-25.534 12.878-6.143 8.511-9.215 20.279-9.215 35.304 0 15.024 3.071 26.829 9.214 35.415 6.217 8.511 14.728 12.767 25.534 12.767s19.28-4.256 25.423-12.767c6.217-8.586 9.326-20.39 9.326-35.415M1091.774 236.576c-16.505 0-27.94 1.888-34.304 5.662-6.365 3.775-9.548 10.214-9.548 19.317 0 7.253 2.369 13.026 7.106 17.32 4.81 4.218 11.324 6.327 19.539 6.327 11.324 0 20.39-3.996 27.199-11.99 6.883-8.067 10.325-18.762 10.325-32.084v-4.551h-20.316m40.744-8.438v70.94h-20.427v-18.873c-4.663 7.55-10.473 13.137-17.43 16.764-6.958 3.553-15.47 5.329-25.534 5.329-12.73 0-22.87-3.553-30.42-10.658-7.475-7.18-11.212-16.764-11.212-28.754 0-13.988 4.662-24.535 13.988-31.64 9.4-7.105 23.388-10.658 41.965-10.658h28.643v-1.998c0-9.4-3.109-16.653-9.326-21.76-6.143-5.18-14.802-7.77-25.978-7.77-7.105 0-14.025.85-20.76 2.553-6.735 1.702-13.21 4.256-19.428 7.66v-18.873c7.475-2.886 14.728-5.033 21.76-6.439 7.03-1.48 13.876-2.22 20.537-2.22 17.985 0 31.418 4.663 40.3 13.988 8.88 9.325 13.321 23.462 13.321 42.409M1278.504 224.036v75.048h-20.427v-74.382c0-11.768-2.295-20.575-6.883-26.422-4.589-5.847-11.472-8.77-20.65-8.77-11.027 0-19.723 3.516-26.088 10.547-6.365 7.031-9.548 16.616-9.548 28.754v70.274h-20.538v-124.34h20.538v19.317c4.885-7.475 10.621-13.063 17.208-16.764 6.661-3.7 14.321-5.55 22.981-5.551 14.284 0 25.09 4.44 32.417 13.322 7.327 8.807 10.991 21.797 10.991 38.967M1371.204 310.626c-5.773 14.802-11.398 24.461-16.875 28.976-5.477 4.515-12.804 6.772-21.981 6.772h-16.32v-17.097h11.99c5.625 0 9.992-1.332 13.1-3.996s6.55-8.956 10.325-18.873l3.664-9.326-50.291-122.34h21.648l38.856 97.252 38.856-97.252h21.648l-54.621 135.89" />
    </g>
    <g fill="#666">
      <path d="M438.04 102.206c0-6.675-1.385-11.848-4.155-15.519-2.737-3.67-6.592-5.507-11.564-5.507-4.94 0-8.794 1.836-11.564 5.507-2.737 3.671-4.105 8.845-4.105 15.52 0 6.64 1.368 11.797 4.105 15.468 2.77 3.671 6.625 5.507 11.564 5.507 4.973 0 8.827-1.836 11.564-5.507 2.77-3.67 4.155-8.827 4.155-15.469m9.211 21.727c0 9.545-2.119 16.637-6.357 21.276-4.24 4.673-10.73 7.009-19.474 7.009-3.238 0-6.292-.25-9.162-.75a44.69 44.69 0 01-8.36-2.204v-8.96c2.703 1.468 5.373 2.552 8.01 3.253 2.636.701 5.323 1.052 8.06 1.052 6.04 0 10.563-1.586 13.567-4.756 3.004-3.138 4.505-7.893 4.505-14.268v-4.556c-1.902 3.304-4.338 5.774-7.309 7.41-2.97 1.635-6.524 2.452-10.663 2.452-6.875 0-12.415-2.62-16.62-7.86-4.206-5.24-6.308-12.181-6.308-20.825 0-8.678 2.102-15.636 6.307-20.876 4.206-5.24 9.746-7.86 16.621-7.86 4.139 0 7.693.818 10.663 2.453 2.97 1.635 5.407 4.105 7.31 7.41v-8.511h9.21v49.11M514.18 100.556v4.506h-42.352c.4 6.341 2.303 11.18 5.707 14.518 3.438 3.304 8.21 4.956 14.318 4.956 3.538 0 6.959-.434 10.263-1.302 3.337-.867 6.642-2.169 9.912-3.904v8.71a55.24 55.24 0 01-10.163 3.204 50.9 50.9 0 01-10.563 1.102c-8.944 0-16.037-2.603-21.276-7.81-5.206-5.206-7.81-12.248-7.81-21.126 0-9.178 2.47-16.454 7.41-21.827 4.973-5.406 11.664-8.11 20.075-8.11 7.542 0 13.5 2.437 17.872 7.31 4.405 4.839 6.608 11.43 6.608 19.773m-9.211-2.703c-.067-5.04-1.486-9.061-4.256-12.065-2.736-3.004-6.374-4.506-10.914-4.506-5.14 0-9.261 1.452-12.365 4.356-3.07 2.903-4.839 6.992-5.306 12.265l32.84-.05M575.71 97.046v33.842h-9.211v-33.54c0-5.307-1.035-9.279-3.104-11.916-2.07-2.636-5.173-3.954-9.312-3.955-4.972 0-8.894 1.586-11.765 4.756-2.87 3.17-4.305 7.493-4.305 12.966v31.69h-9.261v-56.07h9.261v8.711c2.203-3.37 4.79-5.89 7.76-7.56 3.003-1.668 6.458-2.502 10.363-2.502 6.44 0 11.314 2.002 14.618 6.007 3.304 3.972 4.956 9.829 4.956 17.572M642.14 100.556v4.506h-42.352c.4 6.341 2.303 11.18 5.707 14.518 3.438 3.304 8.21 4.956 14.318 4.956 3.538 0 6.959-.434 10.263-1.302 3.337-.867 6.642-2.169 9.912-3.904v8.71a55.24 55.24 0 01-10.163 3.204 50.9 50.9 0 01-10.563 1.102c-8.944 0-16.037-2.603-21.276-7.81-5.206-5.206-7.81-12.248-7.81-21.126 0-9.178 2.47-16.454 7.41-21.827 4.973-5.406 11.664-8.11 20.075-8.11 7.543 0 13.5 2.437 17.872 7.31 4.405 4.839 6.608 11.43 6.608 19.773m-9.211-2.703c-.067-5.04-1.485-9.061-4.256-12.065-2.736-3.004-6.374-4.506-10.913-4.506-5.14 0-9.261 1.452-12.365 4.356-3.07 2.903-4.839 6.992-5.306 12.265l32.84-.05M689.55 83.432a11.624 11.624 0 00-3.404-1.301c-1.202-.3-2.537-.45-4.005-.45-5.207 0-9.212 1.701-12.015 5.105-2.77 3.371-4.155 8.227-4.155 14.568v29.537h-9.262V74.822h9.262v8.711c1.935-3.404 4.455-5.924 7.56-7.56 3.103-1.668 6.874-2.502 11.313-2.502.634 0 1.335.05 2.103.15.767.067 1.618.184 2.553.35l.05 9.462M699.31 74.822h9.211v56.07h-9.211v-56.07m0-21.827h9.211V64.66h-9.211V52.995M768.1 76.974v8.61c-2.603-1.434-5.223-2.502-7.86-3.203a29.012 29.012 0 00-7.91-1.101c-5.974 0-10.613 1.902-13.917 5.707-3.304 3.771-4.956 9.078-4.956 15.92 0 6.841 1.652 12.165 4.957 15.97 3.304 3.77 7.943 5.657 13.917 5.657 2.67 0 5.306-.35 7.91-1.052 2.636-.734 5.256-1.819 7.859-3.254v8.51a37.736 37.736 0 01-8.01 2.704c-2.737.6-5.657.901-8.76.901-8.445 0-15.153-2.653-20.126-7.96-4.972-5.306-7.459-12.465-7.459-21.477 0-9.144 2.503-16.337 7.51-21.577 5.039-5.24 11.93-7.86 20.675-7.86 2.837 0 5.607.301 8.31.902a36.82 36.82 0 017.86 2.603M816.66 52.995h9.211v77.896h-9.211V52.995M866.82 81.28c-4.94 0-8.844 1.936-11.714 5.807-2.87 3.839-4.305 9.112-4.305 15.82 0 6.709 1.418 11.999 4.255 15.87 2.87 3.839 6.792 5.758 11.765 5.758 4.906 0 8.794-1.936 11.664-5.808 2.87-3.871 4.305-9.144 4.305-15.82 0-6.641-1.435-11.898-4.305-15.769-2.87-3.904-6.758-5.857-11.664-5.857m0-7.81c8.01 0 14.301 2.604 18.873 7.81 4.572 5.207 6.858 12.415 6.859 21.627 0 9.178-2.287 16.387-6.859 21.627-4.572 5.207-10.863 7.81-18.873 7.81-8.043 0-14.351-2.603-18.923-7.81-4.539-5.24-6.808-12.449-6.808-21.627 0-9.211 2.27-16.42 6.808-21.627 4.572-5.206 10.88-7.81 18.923-7.81M944.67 102.206c0-6.675-1.385-11.848-4.155-15.519-2.737-3.67-6.592-5.507-11.564-5.507-4.94 0-8.794 1.836-11.564 5.507-2.737 3.671-4.105 8.845-4.105 15.52 0 6.64 1.368 11.797 4.105 15.468 2.77 3.671 6.625 5.507 11.564 5.507 4.973 0 8.828-1.836 11.564-5.507 2.77-3.67 4.155-8.827 4.155-15.469m9.211 21.727c0 9.545-2.119 16.637-6.357 21.276-4.24 4.673-10.73 7.009-19.474 7.009-3.238 0-6.292-.25-9.162-.75a44.69 44.69 0 01-8.36-2.204v-8.96c2.703 1.468 5.373 2.552 8.01 3.253 2.636.701 5.323 1.052 8.06 1.052 6.04 0 10.563-1.586 13.567-4.756 3.004-3.138 4.505-7.893 4.505-14.268v-4.556c-1.902 3.304-4.338 5.774-7.309 7.41-2.97 1.635-6.524 2.452-10.663 2.452-6.875 0-12.415-2.62-16.62-7.86-4.206-5.24-6.308-12.181-6.308-20.825 0-8.678 2.102-15.636 6.307-20.876 4.206-5.24 9.746-7.86 16.621-7.86 4.139 0 7.693.818 10.663 2.453 2.97 1.635 5.407 4.105 7.31 7.41v-8.511h9.21v49.11M994.59 81.28c-4.94 0-8.844 1.936-11.714 5.807-2.87 3.839-4.305 9.112-4.305 15.82 0 6.709 1.418 11.999 4.255 15.87 2.87 3.839 6.792 5.758 11.765 5.758 4.906 0 8.794-1.936 11.664-5.808 2.87-3.871 4.305-9.144 4.305-15.82 0-6.641-1.435-11.898-4.305-15.769-2.87-3.904-6.758-5.857-11.664-5.857m0-7.81c8.01 0 14.3 2.604 18.873 7.81 4.572 5.207 6.858 12.415 6.858 21.627 0 9.178-2.286 16.387-6.858 21.627-4.572 5.207-10.864 7.81-18.873 7.81-8.043 0-14.351-2.603-18.924-7.81-4.539-5.24-6.808-12.449-6.808-21.627 0-9.211 2.269-16.42 6.808-21.627 4.572-5.206 10.88-7.81 18.924-7.81" />
    </g>
    <path
      d="M-184.26 202.82c0 157.74-127.87 285.61-285.61 285.61s-285.61-127.87-285.61-285.61S-627.61-82.79-469.87-82.79s285.61 127.87 285.61 285.61z"
      transform="rotate(-45 4.82 -413.542) scale(.61927)"
      fill="url(#prefix__a)"
    />
    <path
      d="M302.824 150.502c42.057 42.056 42.057 110.24 0 152.297s-110.24 42.057-152.297 0-42.056-110.241 0-152.297 110.241-42.057 152.297 0z"
      fill="#eee"
    />
  </svg>
);

DefaultLogo.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  className: PropTypes.string,
};

DefaultLogo.defaultProps = {
  width: 203,
  height: 56,
};

export default DefaultLogo;
