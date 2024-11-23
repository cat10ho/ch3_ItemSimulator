import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();
/*아이템 장착 API*/
router.put("/characters/:characterId/characterItems", authMiddleware, async (req, res, next) => {
    const { accountId } = req.user;
    const characterId = req.params.characterId;
    const { itemId } = req.body;

    if (!characterId || isNaN(+characterId)) {
      return res
        .status(400)
        .json({ message: "유효하지 않은 characterId 입니다." });
    }
    if (!itemId || isNaN(+itemId)) {
      return res.status(400).json({ message: "유효하지 않은 itemId 입니다." });
    }

    try {
      const characterInventory = await prisma.characterInventorys.findFirst({
        where: { characterId: +characterId },
      });

      const characterItem = await prisma.characterItems.findFirst({
        where: { characterId: +characterId },
      });

      const item = await prisma.items.findFirst({
        where: { itemId: +itemId },
      });

      const character = await prisma.characters.findFirst({
        where: { characterId: +characterId },
      });

      if (!characterInventory)
        return res.status(404).json({
          message: "캐릭터의 인벤토리가 존재하지 않습니다.",
        });

      if (!characterItem)
        return res.status(404).json({
          message: "캐릭터의 장비칸이 존재하지 않습니다.",
        });

      if (!item) return res.status(404).json({ message: "아이템이 없습니다." });
      if (item.characterInventoryId !==characterInventory.characterInventoryId) {
        return res
          .status(400)
          .json({ message: "캐릭터의 아이템이 아닙니다." });
      }
      

      if (!character)
        return res.status(404).json({ message: "캐릭터가 없습니다." });
      else if (character.accountId !== accountId)
        return res
          .status(401)
          .json({ message: "해당 캐릭터는 당신캐릭터가 아닙니다." });

      await prisma.items.update({
        data: { characterInventoryId: null, characterItemId: +characterItem.characterItemId }, //참조할 애를 잘
        where: {
          itemId: +itemId,
        },
      });

      return res.status(200).json({
        data: `${character.name} 가 ${item.name} 을 장착했습니다. `,
      });
    } catch (err) {
      console.error("Error updating item:", err);
      return res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  }
);

export default router;
