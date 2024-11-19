import type { SVGAttributes } from "react"

export const BrandStripeIcon = ({ ...props }: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={400}
      height={400}
      viewBox="0 0 400 400"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Stripe Icon"
      {...props}
    >
      <path fill="#635bff" fillRule="evenodd" clipRule="evenodd" d="M0 0h400v400H0z" />
      <path
        fill="#fff"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M184.4 155.5c0-9.4 7.7-13.1 20.5-13.1 18.4 0 41.6 5.6 60 15.5v-56.8C244.8 93.1 225 90 205 90c-49.1 0-81.7 25.6-81.7 68.4 0 66.7 91.9 56.1 91.9 84.9 0 11.1-9.7 14.7-23.2 14.7-20.1 0-45.7-8.2-66-19.3v57.5c22.5 9.7 45.2 13.8 66 13.8 50.3 0 84.9-24.9 84.9-68.2-.4-72-92.5-59.2-92.5-86.3z"
      />
    </svg>
  )
}
