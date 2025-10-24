import { S3 } from "@aws-sdk/client-s3";
import "dotenv/config"; // loads your .env variables

const s3 = new S3({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	
});

(async () => {
	try {
		const res = await s3.listBuckets({});
		console.log("✅ S3 connection successful!");
		console.log("Your Buckets:", res.Buckets);
	} catch (err) {
		console.error("❌ Error connecting to S3:", err);
	}
})();
