import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

export const reEntryCheckUser = expressAsyncHandler( async (req,res) => {
    const prisma = new PrismaClient();
    const params = req.params.userId;

    const user = await prisma.user.findUnique({
        where:{
            user_id: params
        },
        select:{
            user_id:true,
            browser:true,
            language:true,
            country:true,
            region:true,
            ip:true,
            app_id:true,

        }
    })

    if(!user){
        res.status(404).send('пользователь не найден');
    }

    const isExistUser = await prisma.successfulUser.findUnique({
        where:{
            user_id:user.user_id
        }
    })

    if(isExistUser){
        res.status(400).send('пользователь уже добавлен');
    }

    const successUser = await prisma.successfulUser.create({
        data:user
    })

    if(!successUser){
        res.status(400).send('ошибка')
    }
    res.status(200).send(successUser);
});

