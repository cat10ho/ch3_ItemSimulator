import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  validateItem,
  validateCharacter,
  validateCharacterInventory,
  validateCharacterItemSlot,
  validateItemOwnership,
} from "../middlewares/validate.middleware.js";

import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

/*아이템 장착 API*/
router.put(
  "/characters/:characterId/equipped",
  authMiddleware,
  validateCharacter,
  validateCharacterInventory,
  validateCharacterItemSlot,
  validateItem,
  validateItemOwnership,

  async (req, res) => {
    const { item, character, characterItem } = req;

    try {
      await prisma.$transaction(
        async (tx) => {
          await tx.items.update({
            data: {
              characterInventoryId: null,
              characterItemId: characterItem.characterItemId,
            },
            where: { itemId: item.itemId },
          });

          const addAbilitie = await tx.addAbilities.findFirst({
            where: { itemId: item.itemId },
          });
          const Stat = await tx.stats.findFirst({
            where: { characterId: character.characterId },
          });

          await tx.stats.update({
            data: {
              hp: Stat.hp + addAbilitie.hp,
              str: Stat.str + addAbilitie.str,
            },
            where: { characterId: character.characterId },
          });

          return;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );

      return res.status(200).json({
        data: `${character.name} 가 ${item.name} 을 장착했습니다.`,
      });
    } catch (err) {
      console.error("Error updating item:", err);
      return res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  }
);

/*아이템 탈착 API*/
router.put(
  "/characters/:characterId/detachment",
  authMiddleware,
  validateCharacter,
  validateCharacterInventory,
  validateCharacterItemSlot,
  validateItem,
  async (req, res) => {
    const { item, character, characterInventory, characterItem } = req;

    if (item.characterItemId !== characterItem.characterItemId) {
      return res
        .status(400)
        .json({ message: "해당 아이템은 캐릭터가 장착하지 않았습니다." });
    }

    try {
      await prisma.$transaction(
        async (tx) => {
          await tx.items.update({
            data: {
              characterInventoryId: characterInventory.characterInventoryId,
              characterItemId: null,
            },
            where: { itemId: item.itemId },
          });

          const addAbilitie = await tx.addAbilities.findFirst({
            where: { itemId: item.itemId },
          });
          const Stat = await tx.stats.findFirst({
            where: { characterId: character.characterId },
          });

          await tx.stats.update({
            data: {
              hp: Stat.hp - addAbilitie.hp,
              str: Stat.str - addAbilitie.str,
            },
            where: { characterId: character.characterId },
          });
          return;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );

      return res.status(200).json({
        data: `${character.name} 가 ${item.name} 을 장착해제 하였습니다.`,
      });
    } catch (err) {
      console.error("Error updating item:", err);
      return res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  }
);

export default router;
