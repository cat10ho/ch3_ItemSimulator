import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
/** 캐릭터 생성 API **/ //스테미너스 만들기. 아이템도.
router.post("/characters", authMiddleware, async (req, res, next) => {
  const { accountId } = req.user;
  const { name } = req.body;
  try {
    const characters = await prisma.characters.create({
      data: {
        accountId: +accountId,
        name,
      },
    });
    
    // 생성된 characterId 추출
    const characterId = characters.characterId;
    
    // 스탯 생성
    const stats = await prisma.stats.create({
      data: {
        characterId: characterId,
      },
    });
    
    // 캐릭터 인벤토리 생성
    const characterInventory = await prisma.characterInventorys.create({
      data: {
        characterId: characterId,  // characterId를 사용
        accountId: +accountId,
      },
    });
    
    // 캐릭터 아이템 생성
    const characterItem = await prisma.characterItems.create({
      data: {
        characterId: characterId,  // characterId를 사용
        accountId: +accountId,
      },
    });

    return res.status(201).json({
      message: "캐릭터 생성 성공",
      data: {
        name: name,
        character: characters,
        stats:stats,
        characterInventory: characterInventory,
        characterItem: characterItem,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "캐릭터 생성 중 문제가 발생했습니다." });
  }
});

/** 캐릭터 목록 조회 API **/
router.get('/characters', async (req, res, next) => {
    const characters = await prisma.characters.findMany({
      select: {
        characterId: true,
        accountId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc', // 캐릭터를 최신순으로 정렬합니다.
      },
    });
  
    return res.status(200).json({ data: characters });
  });

  /** 캐릭터 상세 조회 API **/
  router.get("/characters/:charactersId", async (req, res, next) =>  {
    const  characterId  = req.params.charactersId;
    const character = await prisma.characters.findFirst({ 
      where: {characterId: +characterId },
      select: {
        characterId: true,
        accountId: true,
        name: true,
        money: true,
        createdAt: true,
        updatedAt: true,
        Stats: {
          select: {
            hp: true,
            str: true,
          },
        },
      },
    });
  
    if (!character)
      return res.status(404).json({ message: '캐릭터가 없습니다.' });
  
    return res.status(200).json({ data: character });
  });

  /** 캐릭터 삭제API **/
  router.delete("/characters/:charactersId", authMiddleware, async (req, res, next) =>  {
    const { accountId } = req.user;
    const  characterId  = req.params.charactersId;
    const character = await prisma.characters.findFirst({ where: {characterId: +characterId },});
  
    if (!character)
      return res.status(404).json({ message: '캐릭터가 없습니다.' });
    else if (character.accountId !== accountId)
      return res.status(401).json({ message: '해당 캐릭터는 당신캐릭터가 아닙니다.' });
    
    await prisma.characters.delete({ where: { characterId: +characterId } });


    return res.status(200).json({ data: '캐릭터가 삭제되었습니다.' });
  });




export default router;
