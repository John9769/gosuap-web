const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// --- AUTH ---
export const loginAgent = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Server is not responding" };
  }
};

export const changePassword = async (currentPassword, newPassword, token) => {
  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return await response.json();
  } catch (error) {
    console.error("Change Password Error:", error);
    return { error: "Gagal menukar kata laluan" };
  }
};

// --- UPLOAD ---
export const uploadImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`${API_URL}/vendors/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Image upload failed" };
  }
};

// --- STATES ---
export const getStates = async () => {
  try {
    const response = await fetch(`${API_URL}/public/states`);
    return await response.json();
  } catch (error) {
    console.error("States Error:", error);
    return [];
  }
};

// --- VENDORS ---
export const createVendor = async (vendorData, token) => {
  try {
    const response = await fetch(`${API_URL}/vendors/onboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vendorData),
    });
    return await response.json();
  } catch (error) {
    console.error("Onboarding Error:", error);
    return { error: "Failed to save vendor" };
  }
};

export const getAgentVendors = async (token) => {
  try {
    const response = await fetch(`${API_URL}/vendors/my-shops`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch Vendors Error:", error);
    return [];
  }
};

// --- ADMIN ---
export const createAgent = async (agentData, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/create-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(agentData),
    });
    return await response.json();
  } catch (error) {
    console.error("Create Agent Error:", error);
    return { error: "Failed to create agent" };
  }
};

export const resetAgentPassword = async (agentId, newPassword, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ agentId, newPassword }),
    });
    return await response.json();
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: "Gagal menetapkan semula kata laluan" };
  }
};

// --- PAYMENTS ---
export const submitPayment = async (paymentData, token) => {
  try {
    const response = await fetch(`${API_URL}/payments/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    return await response.json();
  } catch (error) {
    console.error("Payment Submit Error:", error);
    return { error: "Failed to submit payment" };
  }
};

export const getAgentPayments = async (token) => {
  try {
    const response = await fetch(`${API_URL}/payments/my-payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch Payments Error:", error);
    return [];
  }
};