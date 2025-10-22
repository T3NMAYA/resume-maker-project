import axios from "axios";

export const baseURL = "http://localhost:8080";

export const axiosInstance = axios.create({
    baseURL: baseURL,
});

// --- AI Resume Generation (This still uses a real backend if available) ---
export const generateResume = async (description) => {
    const response = await axiosInstance.post("/api/v1/resume/generate", {
        userDescription: description,
    });
    return response.data;
};


// --- MOCKED USER AUTHENTICATION ---
// We will simulate the backend using localStorage for testing purposes.

const USERS_DB = "users_db";

// Mock Register User
export const registerUser = async (userData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem(USERS_DB)) || [];
            const userExists = users.some(user => user.email === userData.email);

            if (userExists) {
                return reject({ message: "Email already registered!" });
            }

            // "Hash" the password (in a real app, the backend does this securely)
            const newUser = { ...userData, password: `hashed_${userData.password}` };
            users.push(newUser);
            localStorage.setItem(USERS_DB, JSON.stringify(users));

            console.log("Mock DB - Registered:", newUser);
            resolve({ message: "User successfully registered" });
        }, 500); // Simulate network delay
    });
};

// Mock Login User
export const loginUser = async (loginData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem(USERS_DB)) || [];
            const user = users.find(user => user.email === loginData.email);

            if (user && user.password === `hashed_${loginData.password}`) {
                // Return a user object without the password, just like a real backend
                const { password, ...userToReturn } = user;
                console.log("Mock DB - Logged In:", userToReturn);
                resolve(userToReturn);
            } else {
                reject({ message: "Invalid email or password" });
            }
        }, 500);
    });
};

// Mock Change Password
export const changePassword = async (passwordData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let users = JSON.parse(localStorage.getItem(USERS_DB)) || [];
            const userIndex = users.findIndex(user => user.email === passwordData.email);

            if (userIndex !== -1 && users[userIndex].password === `hashed_${passwordData.oldPassword}`) {
                users[userIndex].password = `hashed_${passwordData.newPassword}`;
                localStorage.setItem(USERS_DB, JSON.stringify(users));
                console.log("Mock DB - Password Changed for:", passwordData.email);
                resolve({ message: "Password changed successfully!" });
            } else {
                reject({ message: "Invalid email or old password" });
            }
        }, 500);
    });
};

// Mock Delete User
export const deleteUser = async (email) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let users = JSON.parse(localStorage.getItem(USERS_DB)) || [];
            const updatedUsers = users.filter(user => user.email !== email);

            if (users.length === updatedUsers.length) {
                return reject({ message: "User not found" });
            }

            localStorage.setItem(USERS_DB, JSON.stringify(updatedUsers));
            console.log("Mock DB - Deleted:", email);
            resolve({ message: "User account deleted successfully" });
        }, 500);
    });
};