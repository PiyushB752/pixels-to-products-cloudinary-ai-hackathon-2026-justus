import api from "./api";

export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put(
    "/auth/change-password",
    data
  );

  return response.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  console.log("Uploading file:", file);
  console.log("FormData avatar:", formData.get("avatar"));

  const response = await api.post(
    "/auth/profile/avatar",
    formData
  );

  return response.data;
};

export const removeProfilePicture = async () => {
  const response = await api.delete("/auth/profile/avatar");
  return response.data;
};