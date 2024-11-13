"use server";

import { getAccessToken } from "@/services/AuthService";

export interface UploadImageMessages {
  serverErrors?: string[];
  successMessage?: string;
  body?: any;
}

export async function uploadImage(
  formData: FormData
): Promise<UploadImageMessages> {
  const file = formData.get("file") as File;

  if (!file) {
    return {
      serverErrors: ["No file uploaded."],
    };
  }

  const accessToken = await getAccessToken(false);

  if (!accessToken) {
    console.error("Faulty access token");
    return {
      serverErrors: ["Can not set"],
    };
  }

  const bodyData = new FormData();
  bodyData.append("file", file);

  try {
    const response = await fetch(`${process.env.UPLOAD_API}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: bodyData,
      cache: "no-cache",
    });

    // Kiểm tra xem phản hồi có phải là JSON hay không
    const contentType = response.headers.get("content-type");
    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json(); // Phân tích JSON nếu là JSON
    } else {
      result = await response.text(); // Lấy nội dung dưới dạng văn bản
      console.log("Raw response: " + result); // Chỉ in ra khi cần thiết
    }

    // Kiểm tra xem phản hồi có thành công hay không
    if (response.ok) {
      return {
        successMessage: "Image uploaded successfully!",
        body: result.data, // Sử dụng URL nếu có
      };
    }

    // Nếu phản hồi không thành công, kiểm tra xem có lỗi không
    return { serverErrors: result.error ? [result.error] : ["Upload failed."] };

  } catch (error) {
    console.error("Error fetching upload image: " + error);
    return {
      serverErrors: ["Something went wrong: " + error],
    };
  }
}
