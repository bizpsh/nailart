import { z } from "zod";
import { CATEGORIES, COLORS } from "./constants";

export const designSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요").max(120),
  description: z.string().trim().min(1, "설명을 입력해주세요").max(2000),
  category: z.enum(CATEGORIES),
  colors: z
    .array(z.enum(COLORS))
    .min(1, "색상을 1개 이상 선택해주세요"),
  imageUrl: z.string().trim().min(1, "이미지를 업로드해주세요"),
  featured: z.boolean().optional().default(false),
});

export type DesignInput = z.infer<typeof designSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(100),
  email: z.string().trim().email("올바른 이메일을 입력해주세요"),
  message: z.string().trim().min(1, "메시지를 입력해주세요").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("올바른 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginInput = z.infer<typeof loginSchema>;
