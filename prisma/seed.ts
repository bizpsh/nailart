import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleDesigns = [
  {
    slug: "classic-french-tips",
    title: "Classic French Tips",
    description: "타임리스한 화이트 팁의 클래식 프렌치 네일.",
    category: "French",
    colors: "White,Nude",
    imageUrl: "/window.svg",
    featured: true,
  },
  {
    slug: "sunset-ombre",
    title: "Sunset Ombre",
    description: "핑크에서 골드로 이어지는 그러데이션 옴브레 디자인.",
    category: "Ombre",
    colors: "Pink,Gold",
    imageUrl: "/globe.svg",
    featured: true,
  },
  {
    slug: "glitter-champagne",
    title: "Glitter Champagne",
    description: "은은한 샴페인 글리터로 마무리한 파티 네일.",
    category: "Glitter",
    colors: "Gold,White",
    imageUrl: "/vercel.svg",
    featured: true,
  },
  {
    slug: "spring-floral",
    title: "Spring Floral",
    description: "손그림 꽃무늬가 돋보이는 봄 시즌 디자인.",
    category: "Floral",
    colors: "Pink,Green,White",
    imageUrl: "/file.svg",
    featured: true,
  },
  {
    slug: "geometric-lines",
    title: "Geometric Lines",
    description: "네거티브 스페이스를 활용한 기하학적 라인 아트.",
    category: "Geometric",
    colors: "Black,White",
    imageUrl: "/next.svg",
    featured: false,
  },
  {
    slug: "minimal-nude",
    title: "Minimal Nude",
    description: "심플하고 우아한 뉴드톤 미니멀 네일.",
    category: "Minimalist",
    colors: "Nude",
    imageUrl: "/window.svg",
    featured: false,
  },
  {
    slug: "3d-pearl-art",
    title: "3D Pearl Art",
    description: "펄과 비즈로 입체감을 살린 3D 아트 네일.",
    category: "3D Art",
    colors: "White,Silver",
    imageUrl: "/globe.svg",
    featured: false,
  },
  {
    slug: "winter-snowflake",
    title: "Winter Snowflake",
    description: "실버 스노우플레이크 포인트의 겨울 시즌 디자인.",
    category: "Seasonal",
    colors: "Blue,Silver,White",
    imageUrl: "/vercel.svg",
    featured: false,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to seed the admin user"
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  for (const design of sampleDesigns) {
    await prisma.design.upsert({
      where: { slug: design.slug },
      update: design,
      create: design,
    });
  }

  console.log(`Seeded admin user (${adminEmail}) and ${sampleDesigns.length} designs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
