import axios from 'axios';
import cheerio from 'cheerio';

export const stalkFF = async (userId: string) => {
  const data = {
    "voucherPricePoint.id": 8050,
    "voucherPricePoint.price": "",
    "voucherPricePoint.variablePrice": "",
    "email": "",
    "n": "",
    "userVariablePrice": "",
    "order.data.profile": "",
    "user.userId": userId,
    "voucherTypeName": "FREEFIRE",
    "shopLang": "in_ID",
  };
  const response = await axios.post("https://order.codashop.com/id/initPayment.action", data, {
    headers: { "Content-Type": "application/json" }
  });
  return {
    id: userId,
    nickname: response.data["confirmationFields"]["roles"][0]["role"]
  };
};

export const stalkML = async (id: string, zoneId: string) => {
    const response = await axios.post(
        'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
        new URLSearchParams({
            productId: '1',
            itemId: '2',
            catalogId: '57',
            paymentId: '352',
            gameId: id,
            zoneId: zoneId,
            product_ref: 'REG',
            product_ref_denom: 'AE',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: 'https://www.duniagames.co.id/' } }
    );
    return response.data.data.gameDetail;
};

export const stalkPUBG = async (playerName: string) => {
    try {
        const { data } = await axios.get(`https://pubg.op.gg/user/${playerName}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);
        const userId = $('div[data-p-user_id]').attr('data-p-user_id');
        if (!userId) return { error: "User not found or private" };
        
        return { userId, profileUrl: `https://pubg.op.gg/user/${playerName}` };
    } catch (error) {
        return { error: "Failed to fetch PUBG data" };
    }
};