import { join } from "path";

export const ROOT_FOLDER_PATH = process.cwd()

export const PUBLIC_FOLDER_NAME = "public"
export const TEMP_FOLDER_NAME = "temp";
export const PROFILE_FOLDER_NAME = "profile";
export const MENU_FOLDER_NAME = "menu";

export const PUBLIC_FOLDER_PATH = join(
    ROOT_FOLDER_PATH,
    PUBLIC_FOLDER_NAME,
);


export const TEMP_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    TEMP_FOLDER_NAME
);

export const PROFILE_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    PROFILE_FOLDER_NAME,
);

export const MENU_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    MENU_FOLDER_NAME,
);



//상대경로

export const PUBLIC_PROFILE_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    PROFILE_FOLDER_NAME,
);

export const PUBLIC_MENU_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    MENU_FOLDER_NAME,
);