import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
    inventoryData: null,
    getAllInventoryData: null,
    createInventoryData: null,
    updateInventoryData: null,
    uploadInventoryImageData: null,
    activeDeactiveInventoryData: null,
    sellerInventoryData: null,
    updateSellerInventoryData: null,
    loading: false,
    error: null,
};

export const inventoryDataSlice = createSlice({
    name: "inventoryDetails",
    initialState: initialState,
    reducers: {
        inventoryLoading: (state) => {
            state.inventoryData = null;
            state.loading = true;
            state.error = null;
        },
        inventorySuccess: (state, { payload }) => {
            state.inventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        inventoryError: (state, { payload }) => {
            state.inventoryData = null;
            state.loading = false;
            state.error = payload;
        },
        createInventoryLoading: (state) => {
            state.createInventoryData = null;
            state.loading = true;
            state.error = null;
        },
        createInventorySuccess: (state, { payload }) => {
            state.createInventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        createInventoryError: (state, { payload }) => {
            state.createInventoryData = null;
            state.loading = false;
            state.error = payload;
        },
        uploadInventoryImageLoading: (state) => {
            state.uploadInventoryImageData = null;
            state.loading = true;
            state.error = null;
        },
        uploadInventoryImageSuccess: (state, { payload }) => {
            state.uploadInventoryImageData = payload;
            state.loading = false;
            state.error = null;
        },
        uploadInventoryImageError: (state, { payload }) => {
            state.uploadInventoryImageData = null;
            state.loading = false;
            state.error = payload;
        },
        updateInventoryLoading: (state) => {
            state.updateInventoryData = null;
            state.loading = true;
            state.error = null;
        },
        updateInventorySuccess: (state, { payload }) => {
            state.updateInventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        updateInventoryError: (state, { payload }) => {
            state.updateInventoryData = null;
            state.loading = false;
            state.error = payload;
        },
        activeDeactiveInventoryLoading: (state) => {
            state.activeDeactiveInventoryData = null;
            state.loading = true;
            state.error = null;
        },
        activeDeactiveInventorySuccess: (state, { payload }) => {
            state.activeDeactiveInventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        activeDeactiveInventoryError: (state, { payload }) => {
            state.activeDeactiveInventoryData = null;
            state.loading = false;
            state.error = payload;
        },
        sellerInventoryLoading: (state) => {
            state.sellerInventoryData = null;
            state.loading = true;
            state.error = null;
        },
        sellerInventorySuccess: (state, { payload }) => {
            state.sellerInventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        sellerInventoryError: (state, { payload }) => {
            state.sellerInventoryData = null;
            state.loading = false;
            state.error = payload;
        },
        updateSellerInventoryLoading: (state) => {
            state.updateSellerInventoryData = null;
            state.loading = true;
            state.error = null;
        },
        updateSellerInventorySuccess: (state, { payload }) => {
            state.updateSellerInventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        updateSellerInventoryError: (state, { payload }) => {
            state.updateSellerInventoryData = null;
            state.loading = false;
            state.error = payload;
        },
        allInventoryLoading: (state) => {
            state.getAllInventoryData = null;
            state.loading = true;
            state.error = null;
        },
        allInventorySuccess: (state, { payload }) => {
            state.getAllInventoryData = payload;
            state.loading = false;
            state.error = null;
        },
        allInventoryError: (state, { payload }) => {
            state.getAllInventoryData = null;
            state.loading = false;
            state.error = payload;
        },


    },
});

// Export actions
export const {
    inventoryLoading,
    inventorySuccess,
    inventoryError,
    createInventoryLoading,
    createInventorySuccess,
    createInventoryError,
    uploadInventoryImageLoading,
    uploadInventoryImageSuccess,
    uploadInventoryImageError,
    updateInventoryLoading,
    updateInventorySuccess,
    updateInventoryError,
    activeDeactiveInventoryLoading,
    activeDeactiveInventorySuccess,
    activeDeactiveInventoryError,
    sellerInventoryLoading,
    sellerInventorySuccess,
    sellerInventoryError,
    updateSellerInventoryLoading,
    updateSellerInventorySuccess,
    updateSellerInventoryError,
    allInventoryLoading,
    allInventorySuccess,
    allInventoryError
} = inventoryDataSlice.actions;

export default inventoryDataSlice.reducer;

export const getInventory = (subCId) => async (dispatch) => {
    try {
        dispatch(inventoryLoading()); // Set loading state
        const { data } = await axiosInstance.get(`inventory/getInventory/${subCId}`);

        if (data) {
            dispatch(inventorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(inventoryError("Login failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(inventoryError(err.message || "Login failed")); // Dispatch error action
    }
};

export const getAllInventory = () => async (dispatch) => {
    try {
        dispatch(allInventoryLoading()); // Set loading state
        const { data } = await axiosInstance.get(`inventory/get`);

        if (data) {
            dispatch(allInventorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(allInventoryError("failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(allInventoryError(err.message || "Login failed")); // Dispatch error action
    }
};

export const createInventory = (dta) => async (dispatch) => {
    try {
        dispatch(createInventoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`inventory/create`, dta);

        if (data) {
            dispatch(createInventorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(createInventoryError("Login failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(createInventoryError(err.message || "Login failed")); // Dispatch error action
        return err; // Return data for further processing (if needed)
    }
};

export const uploadInventoryImage = (inventoryId, imageFile) => async (dispatch) => {
    try {
        dispatch(uploadInventoryImageLoading()); // Set loading state

        // Create FormData and append the image file
        const formData = new FormData();
        formData.append('path', imageFile); // 'image' should match your backend expectation

        const { data } = await axiosInstance.post(
            `inventory/upload-image/${inventoryId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            }
        );

        if (data) {
            dispatch(uploadInventoryImageSuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(uploadInventoryImageError("Upload failed: No data received"));
            throw new Error("Upload failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Image upload failed";
        dispatch(uploadInventoryImageError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const updateInventory = (inventoryDta) => async (dispatch) => {
    console.log('inventoryDta', inventoryDta)
    try {
        dispatch(updateInventoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`inventory/update/${inventoryDta?.inventoryId}`, inventoryDta);

        if (data) {
            dispatch(updateInventorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(updateInventoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(updateInventoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const activeDeactiveInventory = (inventoryDta) => async (dispatch) => {
    console.log('inventoryDta', inventoryDta)
    try {
        dispatch(activeDeactiveInventoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`inventory/active-inactive/${inventoryDta?.inventoryID}`, { userId: inventoryDta?.userId });

        if (data) {
            dispatch(activeDeactiveInventorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(activeDeactiveInventoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(activeDeactiveInventoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const getSellerInventory = (sellerID) => async (dispatch) => {
    console.log('sellerID', sellerID)
    try {
        dispatch(sellerInventoryLoading()); // Set loading state
        const { data } = await axiosInstance.get(`seller/sellers/${sellerID}/inventory`);
        if (data) {
            dispatch(sellerInventorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(sellerInventoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(sellerInventoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const updateSellerInventory = ({ sellerID, inventoryItems }) => async (dispatch) => {
    try {
        dispatch(updateSellerInventoryLoading());
        const { data } = await axiosInstance.post(`seller/update_inventory/${sellerID}/inventory`, { inventoryItems });

        if (data) {
            dispatch(updateSellerInventorySuccess(data));
            return data;
        } else {
            dispatch(updateSellerInventoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to update seller inventory";
        dispatch(updateSellerInventoryError(errorMessage));
        throw err;
    }
};




