import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateReputationFromObservation = async ({
  authorId,
  validatorId,
  approved,
  giveBonusToValidator
}) => {
  if (approved) {
    await prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment: 3 } }
    });

    if (giveBonusToValidator) {
      await prisma.user.update({
        where: { id: validatorId },
        data: { reputation: { increment: 1 } }
      });
    }
  } else {
    await prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment: -1 } }
    });
  }
};