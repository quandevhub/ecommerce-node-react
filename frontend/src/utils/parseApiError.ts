import axios from "axios";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Dữ liệu không hợp lệ",
  401: "Email hoặc mật khẩu không đúng",
  403: "Bạn không có quyền thực hiện thao tác này",
  409: "Email đã được sử dụng",
  422: "Dữ liệu không hợp lệ",
  429: "Quá nhiều yêu cầu, vui lòng thử lại sau",
  500: "Lỗi máy chủ, vui lòng thử lại sau",
};

export function parseApiError(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return fallback;
  }

  if (!err.response) {
    if (err.code === "ECONNABORTED")
      return "Yêu cầu quá thời gian, vui lòng thử lại";
    return "Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng";
  }

  const serverMessage = err.response.data?.message;
  if (serverMessage) return serverMessage;

  return STATUS_MESSAGES[err.response.status] ?? fallback;
}
