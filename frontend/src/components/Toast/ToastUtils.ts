export function extractErrorMessage(error: any): string {
  try {
    const bodyJson = JSON.parse(error?.error?.body);
    const reason = bodyJson?.error?.data?.reason;
    return reason || "❌ Đã xảy ra lỗi không xác định";
  } catch {
    return error?.message || "❌ Lỗi không xác định";
  }
}
