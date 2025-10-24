// const db = sql("meals.db");

// export async function getMeals() {
// 	await new Promise((resolve) => setTimeout(resolve, 5000));

// 	// throw new Error('Loading meals failed');
// 	return db.prepare("SELECT * FROM meals").all();
// }

// export function getMeal(slug) {
// 	return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
// }

// export async function saveMeal(meal) {
// 	meal.slug = slugify(meal.title, { lower: true });
// 	meal.instructions = xss(meal.instructions);

// 	const extension = meal.image.name.split(".").pop();
// 	const fileName = `${meal.slug}.${extension}`;

// 	const bufferedImage = await meal.image.arrayBuffer();

// 	s3.putObject({
// 		Bucket: "maxschwarzmueller-nextjs-demo-users-image",
// 		Key: fileName,
// 		Body: Buffer.from(bufferedImage),
// 		ContentType: meal.image.type,
// 	});

// 	meal.image = fileName;

// 	db.prepare(
// 		`
//     INSERT INTO meals
//       (title, summary, instructions, creator, creator_email, image, slug)
//     VALUES (
//       @title,
//       @summary,
//       @instructions,
//       @creator,
//       @creator_email,
//       @image,
//       @slug
//     )
//   `
// 	).run(meal);
// }

import { S3 } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import xss from "xss";

const prisma = new PrismaClient();

export const runtime = "nodejs";
const s3 = new S3({
	region: "us-east-1", // your AWS region
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function getMeals() {
	await new Promise((resolve) => setTimeout(resolve, 500)); // Optional delay
	return prisma.meal.findMany();
}

export async function getMeal(slug) {
	return prisma.meal.findUnique({
		where: { slug },
	});
}

export async function saveMeal(meal) {
	meal.slug = slugify(meal.title, { lower: true });
	meal.instructions = xss(meal.instructions);

	const extension = meal.image.name.split(".").pop();
	const fileName = `${meal.slug}.${extension}`;

	const bufferedImage = await meal.image.arrayBuffer();

	await s3.putObject({
		Bucket: "meals-app-uploads", // ✅ your S3 bucket
		Key: fileName,
		Body: Buffer.from(bufferedImage),
		ContentType: meal.image.type,
	});

	meal.image = fileName;

	const newMeal = await prisma.meal.create({
		data: {
			title: meal.title,
			summary: meal.summary,
			instructions: meal.instructions,
			image: meal.image,
			slug: meal.slug,
			creator: meal.creator,
			creator_email: meal.creator_email,
		},
	});
	console.log("new meal created, ", newMeal);
	return newMeal;
}
