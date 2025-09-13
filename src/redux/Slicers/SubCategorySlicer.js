import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
    subCategoryData: null,
    subCategoryCreateData: null,
    subCategoryUpdateData: null,
    uploadSubCategoryImageData: null,
    activeDeactiveSubCategoryData: null,
    loading: false, // Corrected typo: userLoginDtaLoading -> userLoginDataLoading
    error: null, // Corrected typo: userLoginDtaError -> userLoginDataError
};

export const subCategoryDataSlice = createSlice({
    name: "subCategoryDetails",
    initialState: initialState,
    reducers: {
        subCategoryLoading: (state) => {
            state.subCategoryData = null;
            state.loading = true;
            state.error = null;
        },
        subCategorySuccess: (state, { payload }) => {
            state.subCategoryData = payload;
            state.loading = false;
            state.error = null;
        },
        subCategoryError: (state, { payload }) => {
            state.subCategoryData = null;
            state.loading = false;
            state.error = payload;
        },
        createSubCategorySuccess: (state, { payload }) => {
            state.subCategoryCreateData = payload;
            state.loading = false;
            state.error = null;
        },
        createSubCategoryError: (state, { payload }) => {
            state.subCategoryCreateData = null;
            state.loading = false;
            state.error = payload;
        },
        createSubCategoryLoading: (state) => {
            state.subCategoryCreateData = null;
            state.loading = true;
            state.error = null;
        },
        updateSubCategorySuccess: (state, { payload }) => {
            state.subCategoryUpdateData = payload;
            state.loading = false;
            state.error = null;
        },
        updateSubCategoryError: (state, { payload }) => {
            state.subCategoryUpdateData = null;
            state.loading = false;
            state.error = payload;
        },
        updateSubCategoryLoading: (state) => {
            state.subCategoryUpdateData = null;
            state.loading = true;
            state.error = null;
        },
        uploadSubCategoryImageSuccess: (state, { payload }) => {
            state.uploadSubCategoryImageData = payload;
            state.loading = false;
            state.error = null;
        },
        uploadSubCategoryImageError: (state, { payload }) => {
            state.uploadSubCategoryImageData = null;
            state.loading = false;
            state.error = payload;
        },
        uploadSubCategoryImageLoading: (state) => {
            state.uploadSubCategoryImageData = null;
            state.loading = true;
            state.error = null;
        },
        activeDeactiveSubCategorySuccess: (state, { payload }) => {
            state.activeDeactiveSubCategoryData = payload;
            state.loading = false;
            state.error = null;
        },
        activeDeactiveSubCategoryError: (state, { payload }) => {
            state.activeDeactiveSubCategoryData = null;
            state.loading = false;
            state.error = payload;
        },
        activeDeactiveSubCategoryLoading: (state) => {
            state.activeDeactiveSubCategoryData = null;
            state.loading = true;
            state.error = null;
        },

    },
});

// Export actions
export const {
    subCategoryLoading,
    subCategorySuccess,
    subCategoryError,
    createSubCategorySuccess,
    createSubCategoryError,
    createSubCategoryLoading,
    updateSubCategorySuccess,
    updateSubCategoryError,
    updateSubCategoryLoading,
    uploadSubCategoryImageSuccess,
    uploadSubCategoryImageError,
    uploadSubCategoryImageLoading,
    activeDeactiveSubCategorySuccess,
    activeDeactiveSubCategoryError,
    activeDeactiveSubCategoryLoading
} =
    subCategoryDataSlice.actions;

export default subCategoryDataSlice.reducer;



export const getSubcategoriesByCategoryId = (categoryId) => async (dispatch) => {
    try {
        dispatch(subCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.get(`subcategory/category/${categoryId}`);

        if (data) {
            dispatch(subCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(subCategoryError("Login failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(subCategoryError(err.message || "Login failed")); // Dispatch error action
    }
};

export const createSubcategory = (dta) => async (dispatch) => {
    try {
        dispatch(createSubCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`subcategory/create`, dta);

        if (data) {
            dispatch(createSubCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(createSubCategoryError("Login failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(createSubCategoryError(err.message || "Login failed")); // Dispatch error action
        return err; // Return data for further processing (if needed)
    }
};

export const uploadSubcategoryImage = (subcategoryId, imageFile) => async (dispatch) => {
    try {
        dispatch(uploadSubCategoryImageLoading()); // Set loading state

        // Create FormData and append the image file
        const formData = new FormData();
        formData.append('path', imageFile); // 'image' should match your backend expectation

        const { data } = await axiosInstance.post(
            `subcategory/upload-image/${subcategoryId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            }
        );

        if (data) {
            dispatch(uploadSubCategoryImageSuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(uploadSubCategoryImageError("Upload failed: No data received"));
            throw new Error("Upload failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Image upload failed";
        dispatch(uploadSubCategoryImageError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const updateSubCategory = (subCategoryDta) => async (dispatch) => {
    console.log('subCategoryDta', subCategoryDta)
    try {
        dispatch(updateSubCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`subcategory/update/${subCategoryDta?.subcategoryId}`, subCategoryDta);

        if (data) {
            dispatch(updateSubCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(updateSubCategoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(updateSubCategoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const activeDeactiveSubCategory = (subcategoryDta) => async (dispatch) => {
    console.log('categoryDta', subcategoryDta)
    try {
        dispatch(activeDeactiveSubCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`subcategory/active-deactive/${subcategoryDta?.subcid}`, { userId: subcategoryDta?.userId });

        if (data) {
            dispatch(activeDeactiveSubCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(activeDeactiveSubCategoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(activeDeactiveSubCategoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};






