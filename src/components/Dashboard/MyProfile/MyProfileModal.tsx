import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, PhoneIcon, UserRoundPen, XIcon } from "lucide-react";
import { UserSessionContext } from "@/types/context";
import Image from "next/image";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { getUserDataFromResponse, UserData, UserStatus } from "@/types/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ResizeImageModal from "./ResizeImageModal";
import {
  FILE_SIZE_TOO_LARGE_5MB,
  INVALID_IMG_FILE_TYPE,
} from "@/types/const/ErrorMessage";
import { ShowMyAccountModalType } from "../SideNavbar/MyAccountModal";
import { UserDataOnlyResponse } from "@/types/response";
import { setUserSessionCookie } from "@/services/AuthService";
import MyProfileEditModal from "./MyProfileEditModal";

const ACCEPTED_FILE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

interface MyProfileModalProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<ShowMyAccountModalType>>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5mbs
export const PROFILE_IMG_INPUT_ID = "uploaded_profile_img";

const MyProfileModal = (props: MyProfileModalProps) => {
  const { show, setShow } = props;
  const userSessionContext = useContext(UserSessionContext);
  const fileInputId = "uploaded_profile_img";
  const [imgFile, setImgFile] = useState<File>();
  const [imgPath, setImgPath] = useState<string>("");
  const [imgType, setImgType] = useState<string>("");
  const [croppedImg, setCroppedImg] = useState<Blob | null>(null);
  const [selectedFileError, setSelectedFileError] = useState<string>("");
  const [isEditingImg, setIsEditingImg] = useState<boolean>(false);
  const [croppedImgUrl, setCroppedImgUrl] = useState<string>("");
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  function onModalClose(open: boolean) {
    if (open) return;
    resetStates();
    setShow(ShowMyAccountModalType.NONE);
  }

  function resetStates() {
    setImgFile(undefined);
    setImgPath("");
    setImgType("");
    setCroppedImg(null);
    setSelectedFileError("");
    setIsEditingImg(false);
    setCroppedImgUrl("");
  }

  async function onSaveChanges(e: MouseEvent) {
    setIsUploadingImg(true);
    const success = await sendUpdateProfileImgApi();
    if (success) {
      resetStates();
      setIsUploadingImg(false);
    } else {
      setSelectedFileError("Failed to update profile picture");
      setIsUploadingImg(false);
    }
  }

  async function sendUpdateProfileImgApi() {
    if (!croppedImg) {
      console.log(
        "No image has been selected. Cannot send api to update profile pic."
      );
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("image", croppedImg);

      const res = await fetch(`/dashboard/api/user/image`, {
        method: "PUT",
        body: formData,
      });

      if (res.status !== 200) {
        throw new Error("Failed to update profile pic");
      }

      const body = (await res.json()) as UserDataOnlyResponse;
      const user: UserData | null = getUserDataFromResponse(body);
      if (!user) throw new Error("User is null");
      if (!userSessionContext) throw new Error("User session context is null");

      let temp = userSessionContext.currentUser;
      if (!temp) throw new Error("Current user in context is null");

      if (!user.image) throw new Error("Image is null in response");
      temp.image = user.image + `&t=${new Date().getTime()}`;
      console.log(temp.image);
      userSessionContext.setCurrentUser(temp);
      setUserSessionCookie(temp);
      return true;
    } catch (e) {
      console.log("Error: " + e);
      return false;
    }
  }

  if (!userSessionContext || !userSessionContext.currentUser)
    return <div>User context is null or current user is undefined</div>;

  return (
    <Dialog open={show} onOpenChange={onModalClose}>
      <DialogContent
        className="bg-dark-9 text-gray-2 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 px-0"
        onInteractOutside={(e) => {
          if (croppedImgUrl.length > 0) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-col space-y-8 mx-[24px] !text-left">
          <DialogTitle className="flex justify-between">
            <p className="self-center">User profile</p>
            <DialogTrigger>
              <XIcon className="cursor-pointer size-[24px] text-gray-1 hover:text-white transition" />
            </DialogTrigger>
          </DialogTitle>
          <div className="flex items-center space-x-10 mt-4">
            <div className="w-[80px] h-[80px] relative">
              <div
                className="group rounded-full cursor-pointer"
                onClick={() => {
                  document.getElementById(fileInputId)?.click();
                }}
              >
                <input
                  type="file"
                  id="uploaded_profile_img"
                  className="hidden"
                  onChange={(e) => {
                    if (e.currentTarget.files) {
                      const file = e.currentTarget.files[0];
                      e.target.value = "";
                      e.currentTarget.files = null;
                      if (file.size > MAX_FILE_SIZE) {
                        setSelectedFileError(FILE_SIZE_TOO_LARGE_5MB);
                        return;
                      }
                      let validFileType = false;
                      ACCEPTED_FILE_TYPE.filter((type, i, arr) => {
                        if (type === file.type) {
                          validFileType = true;
                          setImgFile(file);
                          setImgType(file.type);
                          setImgPath(URL.createObjectURL(file));
                          setIsEditingImg(true);
                          return;
                        } else if (i + 1 === arr.length && !validFileType)
                          setSelectedFileError(INVALID_IMG_FILE_TYPE);
                      });
                      return;
                    }
                  }}
                />
                <div className="size-[80px] flex justify-center absolute cursor-pointer">
                  <FontAwesomeIcon
                    icon={faPen}
                    fontSize={24}
                    className="text-white self-center invisible transition group-hover:visible"
                  />
                </div>
                <Image
                  className="rounded-full size-[80px] transition group-hover:opacity-50"
                  src={
                    croppedImgUrl.length > 0
                      ? croppedImgUrl
                      : userSessionContext.currentUser.image === null
                      ? "/assets/images/profile-pic.jpg"
                      : userSessionContext.currentUser.image
                  }
                  alt={
                    userSessionContext.currentUser.first_name +
                    "'s profile picture"
                  }
                  width={80}
                  height={80}
                />
              </div>
              <div className="size-[24px] absolute top-[56px] left-[56px] bg-dark-9 rounded-full">
                <div
                  className={cn(
                    "rounded-full size-[16px] bg-red-600 absolute top-[4px] left-[4px] ",
                    userSessionContext.currentUser.status ===
                      UserStatus.ONLINE && "bg-green-600",
                    userSessionContext.currentUser.status === UserStatus.IDLE &&
                      "bg-yellow-400",
                    userSessionContext.currentUser.status ===
                      UserStatus.DO_NOT_DISTURB && "bg-red-600",
                    userSessionContext.currentUser.status ===
                      UserStatus.OFFLINE && "bg-gray-10"
                  )}
                ></div>
              </div>
            </div>
            <div className="h-full w-full max-w-[344px] flex flex-col justify-center">
              <p className="font-semibold">
                {userSessionContext.currentUser.last_name +
                  " " +
                  userSessionContext.currentUser.first_name}
              </p>
              <p className="text-[13px] text-red-1 max-w-full text-nowrap overflow-hidden">
                {selectedFileError}
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="border-b-4 border-dark-3"></div>
        <div className="flex flex-col space-y-4 mt-4 mx-[24px]">
          <DialogDescription className="flex items-center space-x-4">
            <span className="font-semibold w-24 text-gray-2">Email:</span>
            <span className="flex-1 text-gray-4">
              {userSessionContext.currentUser.email}
            </span>
          </DialogDescription>
          <DialogDescription className="flex items-center space-x-4">
            <span className="font-semibold w-24 text-gray-2">Phone:</span>
            <span className="flex-1 text-gray-4">
              {userSessionContext.currentUser.phone || ""}
            </span>
          </DialogDescription>
          <DialogFooter>
            <Dialog>
              <section className="w-full flex flex-col">
                {croppedImgUrl.length === 0 && (
                  <div className="w-full flex justify-end">
                    <Button
                      variant="ghost"
                      className="hover:cursor-pointer focus-visible:ring-offset-0 focus-visible:ring-0"
                    >
                      <PhoneIcon className="mr-2" /> Edit Phone No
                    </Button>
                    <Button
                      variant="ghost"
                      className="ml-[12px] hover:cursor-pointer focus-visible:ring-offset-0 focus-visible:ring-0"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <UserRoundPen className="mr-2" /> Change Info
                    </Button>
                  </div>
                )}

                {croppedImgUrl.length > 0 && (
                  <div className="w-full h-[50px] bg-dark-10 mt-[12px] p-[10px] pl-[16px] rounded-[8px] flex flex-row justify-between">
                    <p className="text-[13px] max-sm:text-[12px] w-fit text-white font-bold self-center">
                      You have unsaved changes!
                    </p>

                    <div className="flex flex-row">
                      <button
                        className="hover:underline overflow-hidden text-[13px] max-sm:text-[12px] h-auto mr-[12px] px-[16px] py-[2px]"
                        onClick={() => onModalClose(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-[16px] py-[2px] text-center overflow-hidden text-[13px] max-sm:text-[12px] bg-green-700 hover:bg-green-800 transition rounded-[3px] flex"
                        onClick={onSaveChanges}
                      >
                        {isUploadingImg && (
                          <LucideLoaderCircle className="animate-spin size-[15px] mr-[6px] self-center" />
                        )}{" "}
                        <span className="self-center">
                          Save
                          <span className="hidden sm:inline">{" Changes"}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </section>
              <MyProfileEditModal
                show={isEditingProfile}
                setShow={setIsEditingProfile}
              />
            </Dialog>
          </DialogFooter>
        </div>

        {isEditingImg && imgFile && (
          <ResizeImageModal
            show={isEditingImg}
            img={imgFile}
            imgPath={imgPath}
            imgType={imgType}
            outputWidth={500}
            outputHeight={500}
            setImgFile={setImgFile}
            setOutputCroppedImg={setCroppedImg}
            setOutputCroppedImgUrl={setCroppedImgUrl}
            setIsEditingImg={setIsEditingImg}
            setError={setSelectedFileError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MyProfileModal;
