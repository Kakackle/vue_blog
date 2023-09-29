// get image from assets folder
// expects a subfolder path to expected file
export const getImageUrl = function(img_path) {
    return new URL(`${img_path}`, import.meta.url);
}