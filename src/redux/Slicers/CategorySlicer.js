import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
    categoryData: null,
    createCategoryData: null,
    updateCategoryData: null,
    uploadCategoryImageData: null,
    deleteCategoryData: null,
    subCategoryData: null,
    loading: false, // Corrected typo: userLoginDtaLoading -> userLoginDataLoading
    error: null, // Corrected typo: userLoginDtaError -> userLoginDataError
};

export const categoryDataSlice = createSlice({
    name: "categoryDetails",
    initialState: initialState,
    reducers: {
        categoryLoading: (state) => {
            state.categoryData = null;
            state.loading = true;
            state.error = null;
        },
        categorySuccess: (state, { payload }) => {
            state.categoryData = payload;
            state.loading = false;
            state.error = null;
        },
        categoryError: (state, { payload }) => {
            state.categoryData = null;
            state.loading = false;
            state.error = payload;
        },
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
        createCategorySuccess: (state, { payload }) => {
            state.createCategoryData = payload;
            state.loading = false;
            state.error = null;
        },
        createCategoryError: (state, { payload }) => {
            state.createCategoryData = null;
            state.loading = false;
            state.error = payload;
        },
        createCategoryLoading: (state) => {
            state.createCategoryData = null;
            state.loading = true;
            state.error = null;
        },
        uploadCategoryImageSuccess: (state, { payload }) => {
            state.uploadCategoryImageData = payload;
            state.loading = false;
            state.error = null;
        },
        uploadCategoryImageError: (state, { payload }) => {
            state.uploadCategoryImageData = null;
            state.loading = false;
            state.error = payload;
        },
        uploadCategoryImageLoading: (state) => {
            state.uploadCategoryImageData = null;
            state.loading = true;
            state.error = null;
        },
        updateCategorySuccess: (state, { payload }) => {
            state.updateCategoryData = payload;
            state.loading = false;
            state.error = null;
        },
        updateCategoryError: (state, { payload }) => {
            state.updateCategoryData = null;
            state.loading = false;
            state.error = payload;
        },
        updateCategoryLoading: (state) => {
            state.updateCategoryData = null;
            state.loading = true;
            state.error = null;
        }

    },
});

// Export actions
export const {
    categoryLoading,
    categorySuccess,
    categoryError,
    subCategoryLoading,
    subCategorySuccess,
    subCategoryError,
    createCategorySuccess,
    createCategoryError,
    createCategoryLoading,
    uploadCategoryImageSuccess,
    uploadCategoryImageError,
    uploadCategoryImageLoading,
    updateCategorySuccess,
    updateCategoryError,
    updateCategoryLoading
} =
    categoryDataSlice.actions;

export default categoryDataSlice.reducer;

export const getCategory = () => async (dispatch) => {
    try {
        dispatch(createCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.get(`category/get`);

        if (data) {
            dispatch(categorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(categoryError("Login failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(categoryError(err.message || "Login failed")); // Dispatch error action
    }
};

export const createCategory = (dta) => async (dispatch) => {
    try {
        dispatch(categoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`category/create`, dta);

        if (data) {
            dispatch(createCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing (if needed)
        } else {
            dispatch(createCategoryError("Login failed: No data received")); // Dispatch error action
        }
    } catch (err) {
        dispatch(createCategoryError(err.message || "Login failed")); // Dispatch error action
        return err; // Return data for further processing (if needed)
    }
};

export const uploadCategoryImage = (categoryId, imageFile) => async (dispatch) => {
    try {
        dispatch(uploadCategoryImageLoading()); // Set loading state

        // Create FormData and append the image file
        const formData = new FormData();
        formData.append('path', imageFile); // 'image' should match your backend expectation

        const { data } = await axiosInstance.post(
            `category/upload-image/${categoryId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            }
        );

        if (data) {
            dispatch(uploadCategoryImageSuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(uploadCategoryImageError("Upload failed: No data received"));
            throw new Error("Upload failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Image upload failed";
        dispatch(uploadCategoryImageError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const updateCategory = (categoryDta) => async (dispatch) => {
    console.log('categoryDta', categoryDta)
    try {
        dispatch(updateCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`category/update/${categoryDta?.categoryId}`, categoryDta);

        if (data) {
            dispatch(updateCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(updateCategoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(updateCategoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

export const activeDeactiveCategory = (categoryDta) => async (dispatch) => {
    console.log('categoryDta', categoryDta)
    try {
        dispatch(updateCategoryLoading()); // Set loading state
        const { data } = await axiosInstance.post(`category/activeDeactive/${categoryDta?.categoryId}`, { userId: categoryDta?.userId });

        if (data) {
            dispatch(updateCategorySuccess(data)); // Dispatch success action
            return data; // Return data for further processing
        } else {
            dispatch(updateCategoryError("Update failed: No data received"));
            throw new Error("Update failed: No data received");
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Category update failed";
        dispatch(updateCategoryError(errorMessage));
        throw err; // Re-throw for component-level handling
    }
};

// export const getSubcategoriesByCategoryId = (categoryId) => async (dispatch) => {
//     try {
//         dispatch(categoryLoading()); // Set loading state
//         const { data } = await axiosInstance.get(`subcategory/category/${categoryId}`);

//         if (data) {
//             dispatch(categorySuccess(data)); // Dispatch success action
//             return data; // Return data for further processing (if needed)
//         } else {
//             dispatch(categoryError("Login failed: No data received")); // Dispatch error action
//         }
//     } catch (err) {
//         dispatch(categoryError(err.message || "Login failed")); // Dispatch error action
//     }
// };




