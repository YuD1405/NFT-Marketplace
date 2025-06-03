import { NFT_ADDRESS, MARKETPLACE_ADDRESS, NFT_ABI_JSON, MARKETPLACE_ABI_JSON } from "../config";

 test("Kiểm tra config.ts trả về đúng loại dữ liệu", () => {
   expect(typeof NFT_ADDRESS).toBe("string");
   console.log(NFT_ADDRESS)
   expect(typeof MARKETPLACE_ADDRESS).toBe("string");
   console.log(MARKETPLACE_ADDRESS)
   expect(Array.isArray(NFT_ABI_JSON)).toBe(true);
   console.log(NFT_ABI_JSON)
   expect(Array.isArray(MARKETPLACE_ABI_JSON)).toBe(true);
   console.log(MARKETPLACE_ABI_JSON)
 });

