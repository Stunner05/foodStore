/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "meals-app-uploads.s3.eu-north-1.amazonaws.com",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
