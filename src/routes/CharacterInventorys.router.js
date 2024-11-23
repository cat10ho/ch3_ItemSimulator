import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

/**인벤토리에 아이템 넣기 **/
router.put("/characters/:characterId/CharacterInventorys", authMiddleware, async (req, res, next) => {
  const { accountId } = req.user;
  const characterId = req.params.characterId;
  const { itemId } = req.body;

  if (!characterId || isNaN(+characterId)) {
    return res.status(400).json({ message: "유효하지 않은 characterId 입니다." });
  }
  if (!itemId || isNaN(+itemId)) {
    return res.status(400).json({ message: "유효하지 않은 itemId 입니다." });
  }

  try {
  const item = await prisma.items.findFirst({
    where: { itemId: +itemId },
  });
  const character = await prisma.characters.findFirst({ where: {characterId: +characterId },});

  if (!item)
    return res.status(404).json({ message: '아이템이 없습니다.' });
  if (item.characterInventoryId) {
    return res.status(400).json({ message: '이미 다른 인벤토리에 있는 아이템입니다.' });
  }
  if (item.characterItemId) {
    return res.status(400).json({ message: '이미 다른 캐릭터가 장착하고 있는 아이템입니다.' });
  }
  if (!character)
    return res.status(404).json({ message: '캐릭터가 없습니다.' });
  else if (character.accountId !== accountId)
    return res.status(401).json({ message: '해당 캐릭터는 당신캐릭터가 아닙니다.' });

  const characterInventory = await prisma.characterInventorys.findFirst({
    where: { characterId: +characterId },
  });

  if (!characterInventory)
    return res.status(404).json({
      message: "캐릭터의 인벤토리가 존재하지 않습니다.",
    });

    await prisma.items.update({
      data: { characterInventoryId: characterInventory.characterInventoryId }, //참조할 애를 잘
      where: {
        itemId: +itemId,
      },
    });

  return res.status(200).json({ data: `${character.name} 인벤토리에 ${item.name} 을 넣었습니다. ` });
} catch (err) {
  console.error("Error updating item:", err);
  return res.status(500).json({ message: "서버 에러가 발생했습니다." });
}
}
);

/** 인벤토리 조회 API **/
router.get('/characters/:characterId/CharacterInventorys', async (req, res, next) => {
  const characterId = req.params.characterId;
  
    const character = await prisma.characters.findFirst({ where: {characterId: +characterId },});

    if (!character)
      return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });

    const characterInventory = await prisma.characterInventorys.findFirst({
      where: { characterId: +characterId },
    });

    const characterInventoryId = characterInventory ? characterInventory.characterInventoryId : null; 

    const items = await prisma.items.findMany({
        where: { characterInventoryId: +characterInventoryId },
        select: {
          characterInventoryId: true,
          itemId: true,
          name: true,
          price: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc', // 캐릭터를 최신순으로 정렬합니다.
        },
      });


    //자 여기서. 우리는 아이템을 조회해야한다. 우리 인벤토리 안에있는. 그래그래. 
    //둘째로 착용중인건 캐릭터 조회할때 보도록 하자.
  
  
    return res.status(200).json({ data: items });
  });

export default router;