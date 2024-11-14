import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { setUserSessionCookie } from "@/services/AuthService";
import { UserSessionContext } from "@/types/context";
import { UserDataOnlyResponse } from "@/types/response";
import { getUserDataFromResponse, UserData } from "@/types/user";
import { Dialog } from "@radix-ui/react-dialog";
import { LoaderCircleIcon, LucideLoaderCircle } from "lucide-react";
import { NextResponse } from "next/server";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { z } from "zod";

interface MyProfileEditModalProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export interface UpdateUserProfileRequestBody {
  first_name: string;
  last_name: string;
}

const updateUserProfileSchema: z.ZodType<UpdateUserProfileRequestBody> =
  z.object({
    first_name: z
      .string()
      .min(1, "First name must contain at least 1 character.")
      .max(50, "First name must be less than 50 characters."),
    last_name: z
      .string()
      .min(1, "Last name must contain at least 1 character.")
      .max(50, "Last name must be less than 50 characters."),
  });

const MyProfileEditModal = (props: MyProfileEditModalProps) => {
  const { show, setShow } = props;
  const userSessionContext = useContext(UserSessionContext);
  const user = userSessionContext?.currentUser;
  const setUser = userSessionContext?.setCurrentUser;
  const [firstName, setFirstName] = useState<string | undefined>(
    user?.first_name
  );
  const [lastName, setLastName] = useState<string | undefined>(user?.last_name);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user || !setUser || !firstName || !lastName)
    return (
      <DialogContent className="sm:max-w-[500px] h-[308px] flex justify-center text-gray-2 bg-dark-8 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
        <LoaderCircleIcon className="animate-spin size-[32px] m-auto" />
      </DialogContent>
    );

  function resetState() {
    if (!user) return;
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setHasChanges(false);
    setError(null);
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      resetState();
      setShow(false);
    }
  }

  function onCancel(e: MouseEvent) {
    resetState();
    setShow(false);
  }

  async function onSave(e: MouseEvent) {
    if (!hasChanges) return;
    setIsUpdating(true);
    const result = await sendRequestUpdateProfile();
    if (result) {
      resetState();
      setShow(false);
      setIsUpdating(false);
    } else {
      setIsUpdating(false);
    }
  }

  async function sendRequestUpdateProfile() {
    if (!firstName || !lastName) return false;

    const bodyData = {
      first_name: firstName.trimEnd().trimStart(),
      last_name: lastName.trimEnd().trimStart(),
    } as UpdateUserProfileRequestBody;

    const parseResult = updateUserProfileSchema.safeParse(bodyData);
    if (parseResult.success) {
      const res = await fetch(`/dashboard/api/user`, {
        method: "PUT",
        body: JSON.stringify(bodyData),
      });

      if (res.status !== 200) {
        setError("Failed to update profile.");
        return false;
      }

      const body = (await res.json()) as UserDataOnlyResponse;
      const userData: UserData | null = getUserDataFromResponse(body);

      let temp = user;
      if (!temp || !userData || !setUser) {
        setError("Failed to update profile.");
        return false;
      }

      temp.first_name = userData.first_name;
      temp.last_name = userData.last_name;
      setUser(temp);
      setUserSessionCookie(temp);
      return true;
    } else {
      let errorMessage = "";
      parseResult.error.issues.forEach(
        (issue) => (errorMessage = errorMessage.concat(issue.message + " "))
      );
      setError(errorMessage);
      return false;
    }
  }

  return (
    <Dialog open={show} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[500px] bg-dark-8 text-gray-2 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="text-gray-2">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 mt-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-left">
              First name
            </label>
            <input
              id="first_name"
              value={firstName}
              autoComplete="off"
              onChange={(e) => {
                setFirstName(e.target.value);
                if (
                  hasChanges &&
                  e.target.value === user.first_name &&
                  lastName === user.last_name
                )
                  setHasChanges(false);
                else setHasChanges(true);
              }}
              className="col-span-3 px-[0.5em] overflow-scroll bg-dark-6 text-gray-4 outline-none"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-left">
              Last name
            </label>
            <input
              id="last_name"
              value={lastName}
              autoComplete="off"
              onChange={(e) => {
                setLastName(e.target.value);
                if (
                  hasChanges &&
                  e.target.value === user.last_name &&
                  firstName === user.first_name
                )
                  setHasChanges(false);
                else setHasChanges(true);
              }}
              className="col-span-3 px-[0.5em] overflow-scroll bg-dark-6 text-gray-4 outline-none"
            />
          </div>
          <p className="text-[13px] text-red-1 max-w-full text-wrap">{error}</p>
        </div>
        <DialogFooter
          className={cn("flex justify-end ", hasChanges && "!justify-between")}
        >
          {hasChanges && (
            <p className="text-[13px] max-sm:text-[12px] w-fit text-white font-bold self-center">
              You have unsaved changes
            </p>
          )}
          <div>
            <Button
              variant="ghost"
              type="submit"
              className="hover:bg-red-400"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              type="submit"
              className={cn(
                "hover:bg-green-400 ml-[8px] ",
                isUpdating && "bg-green-400 text-accent-foreground"
              )}
              disabled={!hasChanges}
              onClick={onSave}
            >
              {isUpdating && (
                <LucideLoaderCircle className="animate-spin size-[15px] mr-[6px] self-center" />
              )}
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MyProfileEditModal;
