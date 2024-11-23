import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();


/** 인벤토리 조회 API **/
router.get('/characters/:characterId/CharacterInventorys', async (req, res, next) => {
    const { characterId } = req.params;
  
    const character = await prisma.characters.findFirst({ 
      where: {
        characterId: +characterId,
      },
    });
    if (!character)
      return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });

    const characterInventory = await prisma.characterInventorys.findFirst();

    const characterInventoryId = characterInventory ? characterInventory.characterInventoryId : null; 

    const items = await prisma.items.findMany({
        where: { characterInventoryId: +characterInventoryId },
        select: {
          characterInventoryId: true,
          itemId: true,
          name: true,
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