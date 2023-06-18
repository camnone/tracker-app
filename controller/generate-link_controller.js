import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import geoip from "geoip-lite";
import { getUserId } from "../config/get_userID.js";

const prisma = new PrismaClient();


export const generateLink = expressAsyncHandler(async (req, res) => {
  const params = req.query;
  const geo = geoip.lookup(req.ip);
  const userId = getUserId();

  const user_info = {
    user_id: userId,
    browser:  req.headers["user-agent"] ?? 'Unknow',
    language: req.headers["accept-language"] ?? "Unknow",
    country: geo ? geo.country : "Unknown",
    region: geo ? geo.region : "Unknown",
    ip: req.ip,
    headers: req.headers,
    app_id: params.g_app
  };


  const geek_params = {
    g_app: params.g_app,
    g_pid: params.gpid,
    g_c: params.gc,
    g_adset: params.gadset,
    userID:userId
  };

  const saveUser = await saveToDB(user_info)
  if(saveUser){
    await redirect(res, geek_params);
  }
 
 
});

const redirect = async (res, geek_params) => {
  try {
    res.redirect(
      `https://play.google.com/store/apps/details?id=${geek_params.g_app}&referrer=g_pid=${geek_params.g_pid}&g_c=${geek_params.g_c}&g_adset=${geek_params.g_adset}&userID=${geek_params.userID}`
    );
    res.status(200).send(geek_params);
  } catch (e) {
    res.status(400).send("Ошидка редиректа",e);
  }
};

const saveToDB =  async (userInfo) => {
  const user_info = await prisma.user.create({
    data: {
      browser: userInfo.browser,
      language: userInfo.language,
      country: userInfo.country,
      region: userInfo.region,
      ip: userInfo.ip,
      app_id: userInfo.app_id,
      user_id:userInfo.user_id
    },
  });
  return user_info
};

