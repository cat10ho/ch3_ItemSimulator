import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/** 아이템 생성 API **/
router.post("/items", authMiddleware, async (req, res, next) => {
  try {
    const { accountId } = req.user;
    const { name, hp, str, price } = req.body;

    const item = await prisma.items.create({
      data: {
        accountId: +accountId,
        name,
        price: +price,
      },
    });

    const itemId = item.itemId;

    const addAbilitie = await prisma.addAbilities.create({
      data: {
        itemId: +itemId,
        hp: +hp,
        str: +str,
      },
    });

    return res.status(201).json({
      data: {
        item: item,
        addAbilitie: addAbilitie,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "아이템 생성 중 문제가 발생했습니다." });
  }
});

/** 아이템 목록 조회 API **/
router.get('/items', async (req, res, next) => {
 const items = await prisma.items.findMany({ 
    select: {
      itemId: true,
      accountId: true,
      name: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc', // 아이템을 최신순으로 정렬합니다.
    },
  });

  return res.status(200).json({ data: items });
});

/** 아이템 상세 조회 API **/
router.get('/items/:itemId', async (req, res, next) => {
  const { itemId } = req.params;

  const item = await prisma.items.findFirst({ 
    where: { itemId: +itemId,}, 
    select: {
      itemId: true,
      accountId: true,
      name: true,
      price: true,
      characterInventoryId: true,
      characterItemId: true,
      createdAt: true,
      updatedAt: true,
      AddAbilities: {
        select: {
          hp: true,
          str: true,
        },
      },
    },
  });
  if (!item)
    return res.status(404).json({ message: '아이템이 존재하지 않습니다.' });

  return res.status(200).json({ data: item });
});

/** 아이템 수정 API **/
router.put("/items/:itemId", authMiddleware, async (req, res, next) => {
  const { accountId } = req.user;
  const { itemId } = req.params;
  const { name, hp, str, price } = req.body;

  const item = await prisma.items.findUnique({
    where: { itemId: +itemId },
  });

  if (!item)
    return res.status(404).json({ message: '아이템이 없습니다.' });
  else if (item.accountId !== accountId)
    return res.status(401).json({ message: '해당 아이템은 당신이 만든게 아닙니다.' });

  await prisma.items.update({
    data: { name, price:+price },
    where: {
      itemId: +itemId,
      accountId: +accountId,
    },
  });

  await prisma.addAbilities.update({
    data: { hp:+hp, str:+str },
    where: {
      itemId: +itemId,
    },
  });

  return res.status(200).json({ data: '아이템이 수정되었습니다.' });
});

/** 아이템 삭제 API **/
router.delete("/items/:itemId", authMiddleware, async (req, res, next) =>  {
  const { accountId } = req.user;
  const { itemId } = req.params;

  const item = await prisma.items.findFirst({ where: { itemId: +itemId } });

  if (!item)
    return res.status(404).json({ message: '아이템이 없습니다.' });
  else if (item.accountId !== accountId)
    return res.status(401).json({ message: '해당 아이템은 당신이 만든게 아닙니다.' });

  await prisma.items.delete({ where: { itemId: +itemId } });

  return res.status(200).json({ data: '아이템이 삭제되었습니다.' });
});

export default router;
