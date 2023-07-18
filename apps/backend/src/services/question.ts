import createError from "http-errors";

import { prisma } from "../lib/prisma";
import type { CreateQuestionData } from "../types/question";

export const createQuestion = async (data: CreateQuestionData) => {
  try {
    const response = await prisma.question.create({
      data: {
        question: data.question,
        answers: {
          createMany: { data: data.answers },
        },
      },
    });
    return response;
  } catch {
    throw createError(400, "Could not create question.");
  }
};
